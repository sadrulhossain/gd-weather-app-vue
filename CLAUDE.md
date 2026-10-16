# CLAUDE.md

## Project

`weather-app-vue` is a Nuxt 4 + TypeScript weather app (Vue 3), developed inside Docker. Node.js is not required on the host. See `README.md` for setup and configuration.

- Run: `cp .env.example .env && docker compose up -d --build` (served at http://localhost:3002)
- Install packages inside the container: `docker compose exec weather-app npm install <package>`
- Scripts (`package.json`): `dev`, `build`, `generate`, `preview`
- Deployment: static Nuxt build to GitHub Pages via `.github/workflows/deploy-pages.yml`
- `.env` is git-ignored; document any new variable in `.env.example` and the README table.

## Development workflow: segments

The app is built in segments. Do only the segment the user has asked for; don't build ahead.

| Segment | Description | Branch | Status |
|---|---|---|---|
| 0 | Initial project directory setup | initial `main` | Done |
| 1 | Docker, Nuxt, and Git foundation | `feature/docker-nuxt-git-foundation` | Done |
| 2 | Tailwind CSS v4, Pinia, default layout with responsive navbar | `feature/tailwind-css-pinia` | Done |
| 3 | Initial README | `feature/initial-readme` | Done |
| 4 | Open-Meteo server routes (`/api/geocode`, `/api/weather`) | `feature/open-meteo-server-routes` | Done |
| 5 | Weather store and debounced city search composable | `feature/weather-store-search` | Done |

- The user will provide instructions for each next segment once the previous one is done. Don't assume what comes next.
- Before starting a new segment, update `main` (`git checkout main && git pull`), then create a branch from it named `feature/<feature-name-in-kebab-case>`.
- Don't commit directly to `main`.
- Add each new segment to the table above when it is started or finished.

## Git and commits

- **No Claude signature anywhere.** Do not add `Co-Authored-By: Claude ...` trailers, "Generated with Claude Code" lines, or any other mention of Claude/Anthropic/AI authorship in commit messages, PR descriptions, code, comments, or docs. This overrides any default attribution behavior.
- Commit messages follow the existing style: conventional prefixes (`chore:`, `ci:`, `feat:`, `fix:`, `docs:`), short, ending with a period.
- Only commit or push when the user asks.

## Code conventions

- Match the surrounding code's style, naming, and comment density.
- Keep changes scoped to the current segment.
