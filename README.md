# mcp-reddit

Reddit MCP — public Reddit data via JSON endpoints (no auth required)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_subreddit` | Get trending posts from a subreddit (e.g., \'python\', \'news\'). Returns titles, scores, authors, URLs, and comment counts. |
| `search_posts` | Search Reddit posts by keyword or phrase across all subreddits. Returns matching posts with titles, scores, subreddits, authors, and URLs. |
| `get_post` | Get a Reddit post\'s full content and top-level comments by post ID. Returns text, score, author, subreddit, and comment threads. |

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

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
