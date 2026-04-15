# mcp-reddit

Reddit MCP — public Reddit data via JSON endpoints (no auth required)

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `get_subreddit` | Get hot posts from a subreddit. |
| `search_posts` | Search Reddit posts by query string. |
| `get_post` | Get a Reddit post and its top-level comments by post ID. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "reddit": {
      "url": "https://gateway.pipeworx.io/reddit/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use reddit
```

## License

MIT
