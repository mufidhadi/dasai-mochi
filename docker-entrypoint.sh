#!/bin/sh

# Start FastAPI Uvicorn backend in background
uv run uvicorn dasai_mochi.api:app --host 127.0.0.1 --port 8000 &

# Start Nginx in foreground
exec nginx -g "daemon off;"
