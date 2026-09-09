#!/bin/sh

# Start FastAPI Uvicorn backend using virtualenv python directly
/app/.venv/bin/uvicorn dasai_mochi.api:app --host 127.0.0.1 --port 8000 &

# Start Nginx in foreground
exec nginx -g "daemon off;"
