# mcp-reddit

Reddit MCP — public Reddit data via the Atom/RSS feeds.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/reddit/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Reddit data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
