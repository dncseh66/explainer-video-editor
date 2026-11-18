#!/bin/sh
# Prints the auth header for the Epidemic Sound MCP server as JSON.
# Reads EPIDEMIC_SOUND_MCP_API_KEY from this project's .env, so the key never sits in .mcp.json.
# Used by .mcp.json -> headersHelper. Prints nothing secret to the terminal on its own.
DIR="$(cd "$(dirname "$0")/.." && pwd)"
KEY="$(grep -E '^EPIDEMIC_SOUND_MCP_API_KEY=' "$DIR/.env" 2>/dev/null | head -1 | cut -d= -f2- | tr -d '"'"'"' \r')"
[ -n "$KEY" ] || { echo "EPIDEMIC_SOUND_MCP_API_KEY missing in $DIR/.env" >&2; exit 1; }
printf '{"Authorization":"Bearer %s"}\n' "$KEY"
