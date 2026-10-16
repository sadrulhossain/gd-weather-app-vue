# weather-app

A weather app built with Nuxt 4, Vue 3, Tailwind CSS and Pinia, developed inside Docker.

![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-state-FFD859?logo=pinia&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)

> **Status:** early development. The app currently has a responsive layout and a Pinia test store; weather features are not built yet (see the [roadmap](#roadmap)).

## Screenshot

<!-- Add screenshots to docs/screenshots/ and reference them here, e.g. ![Home](docs/screenshots/home.png) -->
_Screenshot coming soon. Images will live in `docs/screenshots/`._

## Tech stack

| Area | Technology |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com) |
| UI | [Vue 3](https://vuejs.org), TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) (Vite plugin) |
| State | [Pinia](https://pinia.vuejs.org) via `@pinia/nuxt` |
| Runtime | Node 24 (inside Docker) |
| Containers | Docker, Docker Compose |
| Deployment | Static build to GitHub Pages (GitHub Actions) |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose
- [Git](https://git-scm.com/downloads)

Node.js is not required on your host machine.

## Getting started

```bash
git clone https://github.com/sadrulhossain/gd-weather-app-vue.git
cd gd-weather-app-vue
cp .env.example .env
docker compose up -d --build
```

Open http://localhost:3002.

### Stop

```bash
docker compose down
```

### Rebuild

```bash
docker compose up -d --build
```

After changing dependencies, reset the `node_modules` volume and rebuild:

```bash
docker compose down -v && docker compose up -d --build
```

### Other commands

```bash
docker compose logs -f weather-app
docker compose exec weather-app npm install <package>
```

## Configuration

Settings live in `.env` (ignored by git). `.env.example` lists every variable.

| Variable | Purpose | Default |
|---|---|---|
| `APP_NAME` | Container name | `weather-app-vue` |
| `NODE_ENV` | Node environment | `development` |
| `APP_PORT` | Host port you open in the browser | `3002` |
| `CONTAINER_PORT` | Nuxt's port inside the container | `3000` |
| `HOST` | Dev server bind address | `0.0.0.0` |

## Project structure

```
.
├── .github/workflows/   # GitHub Pages deploy workflow
├── app/
│   ├── assets/css/      # Tailwind entry (main.css)
│   ├── layouts/         # default layout with responsive navbar
│   ├── pages/           # file-based routes
│   ├── stores/          # Pinia stores
│   └── app.vue
├── docs/screenshots/    # README screenshots
├── public/              # static files
├── .env.example
├── CLAUDE.md
├── docker-compose.yml
├── Dockerfile
├── nuxt.config.ts
└── package.json
```

## Notes

- Source is bind-mounted, so edits hot-reload (file polling is enabled for Windows/macOS).
- `node_modules` lives in a separate Docker volume so Linux-built packages stay out of your host files.
- Never commit `.env`. If a secret is committed, rotate it first, then purge it from git history.

## Roadmap

- [ ] City search
- [ ] Current weather
- [ ] Multi-day forecast
- [ ] Saved locations
- [ ] Unit toggle (°C / °F)
- [ ] Tests

## Credits

Weather data is planned to come from [Open-Meteo](https://open-meteo.com), a free weather API. It is not integrated yet.

## License

Released under the MIT License.
