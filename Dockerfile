# Stage 1: Build React application
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

COPY . .
RUN pnpm build

# Stage 2: Serve React with Nginx and FastAPI Python Backend with UV
FROM python:3.12-slim-bookworm

# Install nginx, ffmpeg, curl
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    ffmpeg \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install uv package manager
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Copy python project definition, readme, and source
COPY pyproject.toml uv.lock README.md ./
COPY src ./src
COPY nginx.conf /etc/nginx/sites-available/default
RUN rm -f /etc/nginx/sites-enabled/default && ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Copy static frontend dist build
COPY --from=builder /app/dist /usr/share/nginx/html

# Install python dependencies with uv
RUN uv sync --frozen || uv sync

ENV PYTHONPATH="/app/src"
ENV PATH="/app/.venv/bin:$PATH"

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s \
  CMD curl -f http://127.0.0.1/api/health || exit 1

CMD ["/docker-entrypoint.sh"]
