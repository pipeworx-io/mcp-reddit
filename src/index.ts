interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Reddit MCP — public Reddit data via JSON endpoints (no auth required)
 *
 * Tools:
 * - get_subreddit: Get hot posts from a subreddit
 * - search_posts: Search Reddit posts by query
 * - get_post: Get a post and its comments by post ID
 */


const BASE = 'https://www.reddit.com';
const USER_AGENT = 'pipeworx-mcp/1.0 (https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'get_subreddit',
    description: 'Get hot posts from a subreddit.',
    inputSchema: {
      type: 'object',
      properties: {
        subreddit: {
          type: 'string',
          description: 'Subreddit name without the r/ prefix (e.g. "programming")',
        },
        limit: {
          type: 'number',
          description: 'Number of posts to return (default: 10, max: 100)',
        },
      },
      required: ['subreddit'],
    },
  },
  {
    name: 'search_posts',
    description: 'Search Reddit posts by query string.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        limit: {
          type: 'number',
          description: 'Number of results to return (default: 10, max: 100)',
        },
        sort: {
          type: 'string',
          description: 'Sort order: relevance, hot, top, new, comments (default: relevance)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_post',
    description: 'Get a Reddit post and its top-level comments by post ID.',
    inputSchema: {
      type: 'object',
      properties: {
        post_id: {
          type: 'string',
          description: 'Reddit post ID (the alphanumeric ID, e.g. "abc123")',
        },
      },
      required: ['post_id'],
    },
  },
];

interface RedditPost {
  data: {
    id: string;
    title: string;
    subreddit: string;
    author: string;
    score: number;
    url: string;
    permalink: string;
    selftext?: string;
    num_comments: number;
    created_utc: number;
    is_self: boolean;
    thumbnail?: string;
    link_flair_text?: string;
  };
}

interface RedditListing {
  data: {
    children: RedditPost[];
    after?: string;
  };
}

interface RedditComment {
  kind: string;
  data: {
    id: string;
    author?: string;
    body?: string;
    score?: number;
    created_utc?: number;
    replies?: RedditListing | string;
  };
}

interface RedditPostResponse {
  data: {
    children: RedditPost[];
  };
}

interface RedditCommentsResponse {
  data: {
    children: RedditComment[];
  };
}

function mapPost(post: RedditPost) {
  return {
    id: post.data.id,
    title: post.data.title,
    subreddit: post.data.subreddit,
    author: post.data.author,
    score: post.data.score,
    url: post.data.url,
    permalink: `https://www.reddit.com${post.data.permalink}`,
    num_comments: post.data.num_comments,
    created_utc: post.data.created_utc,
    is_self: post.data.is_self,
    selftext: post.data.selftext || null,
    flair: post.data.link_flair_text ?? null,
  };
}

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const headers = { 'User-Agent': USER_AGENT };

  switch (name) {
    case 'get_subreddit': {
      const subreddit = args.subreddit as string;
      const limit = Math.max(1, Math.min(100, (args.limit as number) ?? 10));

      const params = new URLSearchParams({ limit: String(limit) });
      const res = await fetch(`${BASE}/r/${subreddit}/hot.json?${params}`, { headers });
      if (!res.ok) throw new Error(`Reddit subreddit error: ${res.status}`);

      const data = (await res.json()) as RedditListing;

      return {
        subreddit,
        count: data.data.children.length,
        posts: data.data.children.map(mapPost),
      };
    }

    case 'search_posts': {
      const query = args.query as string;
      const limit = Math.max(1, Math.min(100, (args.limit as number) ?? 10));
      const sort = (args.sort as string) ?? 'relevance';

      const params = new URLSearchParams({ q: query, limit: String(limit), sort });
      const res = await fetch(`${BASE}/search.json?${params}`, { headers });
      if (!res.ok) throw new Error(`Reddit search error: ${res.status}`);

      const data = (await res.json()) as RedditListing;

      return {
        query,
        sort,
        count: data.data.children.length,
        posts: data.data.children.map(mapPost),
      };
    }

    case 'get_post': {
      const postId = args.post_id as string;

      const res = await fetch(`${BASE}/comments/${postId}.json`, { headers });
      if (!res.ok) throw new Error(`Reddit post error: ${res.status}`);

      const data = (await res.json()) as [RedditPostResponse, RedditCommentsResponse];
      const postData = data[0].data.children[0];
      const commentsData = data[1].data.children;

      return {
        post: mapPost(postData),
        comments: commentsData
          .filter((c) => c.kind === 't1')
          .map((c) => ({
            id: c.data.id,
            author: c.data.author ?? null,
            body: c.data.body ?? null,
            score: c.data.score ?? null,
            created_utc: c.data.created_utc ?? null,
          })),
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies McpToolExport;
