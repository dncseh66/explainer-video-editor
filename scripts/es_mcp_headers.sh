#!/bin/sh
# Prints the auth header for the Epidemic Sound MCP server as JSON.
# Reads EPIDEMIC_SOUND_MCP_API_KEY from the environment (cloud sessions) or this project's .env (local),
# so the key never sits in .mcp.json. Used by .mcp.json -> headersHelper. Prints nothing secret on its own.
DIR="$(cd "$(dirname "$0")/.." && pwd)"
KEY="$EPIDEMIC_SOUND_MCP_API_KEY"
[ -n "$KEY" ] || KEY="$(grep -E '^EPIDEMIC_SOUND_MCP_API_KEY=' "$DIR/.env" 2>/dev/null | head -1 | cut -d= -f2- | tr -d '"'"'"' \r')"
[ -n "$KEY" ] || { echo "EPIDEMIC_SOUND_MCP_API_KEY missing (set it in .env or as an environment variable)" >&2; exit 1; }
printf '{"Authorization":"Bearer %s"}\n' "$KEY"
