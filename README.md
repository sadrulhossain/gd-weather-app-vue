# weather-app-vue

A Nuxt 4 + TypeScript weather app, developed inside Docker.

## Requirements

- Docker and Docker Compose
- Git

Node.js is not required on your host machine.

## Getting started

```bash
cp .env.example .env
docker compose up -d --build
```

Open http://localhost:3002.

## Configuration

Settings live in `.env` (ignored by git). `.env.example` lists every variable with placeholder values.

| Variable | Purpose | Default |
|---|---|---|
| `APP_NAME` | Container name | `weather-app-vue` |
| `NODE_ENV` | Node environment | `development` |
| `APP_PORT` | Host port you open in the browser | `3002` |
| `CONTAINER_PORT` | Nuxt's port inside the container | `3000` |
| `HOST` | Dev server bind address | `0.0.0.0` |

## Common commands

```bash
docker compose up -d --build     # build and start
docker compose logs -f weather-app   # follow logs
docker compose down              # stop
docker compose down -v && docker compose up -d --build   # reset after dependency changes
docker compose exec weather-app npm install <package>    # install a package inside Docker
```

## Notes

- Source is bind-mounted, so edits hot-reload (file polling is enabled for Windows/macOS).
- `node_modules` lives in a separate Docker volume so Linux-built packages stay out of your host files.
- Never commit `.env`. If a secret is committed, rotate it first, then purge it from git history.
