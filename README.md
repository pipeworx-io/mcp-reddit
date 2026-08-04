# mcp-reddit

Reddit MCP — public Reddit data via the Atom/RSS feeds.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_subreddit` | Get posts from a REDDIT subreddit — r/LocalLLaMA, r/python, r/news. PREFER for "what are people posting in r/<sub>", "whats new on r/<sub> today", "top posts on Reddit this week". Sorted hot (default), new, top, rising, or controversial. For "top"/"controversial" pass a time window (day/week/month/year/all) — e.g. "top posts in r/programming this week". Returns post id, title, author, permalink, date, and a body snippet. (Vote score and comment count are not available via Reddit RSS.) |
| `search_posts` | Search Reddit posts by keyword — across all subreddits, or scoped to one via the subreddit argument ("search r/<sub> for X"). Sort by relevance (default), hot, top, new, or comments. Returns post id, title, author, subreddit, permalink, and date. |
| `get_post` | Get a Reddit post and its comments by post ID. Returns the post (title, author, body, permalink) and the comment threads (author, body, date). Vote scores aren't available via Reddit RSS. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "reddit": {
      "url": "https://gateway.pipeworx.io/reddit/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Reddit data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
