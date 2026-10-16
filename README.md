# weather-app

A weather app built with Nuxt 4, Vue 3, Tailwind CSS and Pinia, developed inside Docker. Search for a city, see current conditions and a 5-day forecast, and save your favourite cities.

![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-state-FFD859?logo=pinia&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Screenshot

<!-- Add screenshots to docs/screenshots/ and reference them here, e.g. ![Home](docs/screenshots/home.png) -->
_Screenshot coming soon. Images will live in `docs/screenshots/`._

## Features

- City search with debounced autocomplete suggestions, fully keyboard accessible (arrow keys, Home, End, Enter, Escape)
- Current conditions: temperature, feels-like, humidity, wind speed, and a weather label and icon
- 5-day forecast with daily high/low and chance of rain
- Celsius / Fahrenheit toggle
- Saved cities: add, remove and select favourites
- Unit and saved cities persisted in the browser (`localStorage`)
- Loading skeletons and an error state with a retry button
- Responsive layout with a mobile navigation menu
- Server routes that proxy and cache [Open-Meteo](https://open-meteo.com) requests

## Tech stack

| Area | Technology |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com) |
| UI | [Vue 3](https://vuejs.org), TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) (Vite plugin) |
| State | [Pinia](https://pinia.vuejs.org) via `@pinia/nuxt` |
| Data | [Open-Meteo](https://open-meteo.com) geocoding and forecast APIs |
| Runtime | Node 24 (inside Docker) |
| Containers | Docker, Docker Compose |
| CI | GitHub Actions workflow that builds a static site for GitHub Pages |

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

Open-Meteo needs no API key.

## API routes

The browser calls these Nuxt server routes, never Open-Meteo directly. Responses are cached on the server.

| Method | Path | Parameters | Description |
|---|---|---|---|
| GET | `/api/geocode` | `q` (required, 2-100 characters) | Returns up to 5 matching places: `id`, `name`, `region`, `country`, `lat`, `lon`, `timezone`. Cached for 24 hours. |
| GET | `/api/weather` | `lat` (required, -90 to 90), `lon` (required, -180 to 180) | Returns `current` conditions and a 5-day `daily` forecast in Celsius. Cached for 10 minutes. |

Errors: `400` for invalid parameters, `502` when Open-Meteo fails, `503` when it rate-limits us, `504` when it times out.

Try them:

```bash
curl "http://localhost:3002/api/geocode?q=Dhaka"
curl "http://localhost:3002/api/weather?lat=23.71&lon=90.41"
```

## Project structure

```
.
├── .github/workflows/     # GitHub Pages deploy workflow
├── app/
│   ├── assets/css/        # Tailwind entry (main.css)
│   ├── components/        # CitySearch, CurrentWeatherCard, ForecastList, FavouriteCities, UnitToggle, WeatherSkeleton, AppLogo
│   ├── composables/       # useDebouncedSearch
│   ├── layouts/           # default layout with responsive navbar
│   ├── pages/             # file-based routes (index.vue)
│   ├── stores/            # Pinia weather store
│   ├── utils/             # weather code mapping, localStorage helpers
│   └── app.vue
├── docs/screenshots/      # README screenshots
├── public/                # static files
├── server/
│   ├── api/               # geocode.get.ts, weather.get.ts
│   └── utils/             # Open-Meteo fetch helper
├── .env.example
├── CLAUDE.md
├── docker-compose.yml
├── Dockerfile
├── LICENSE
├── nuxt.config.ts
└── package.json
```

## Manual test checklist

- [ ] `docker compose up -d --build` starts and http://localhost:3002 loads
- [ ] Typing 1 character shows no suggestions; 2 or more shows suggestions after a short pause
- [ ] Arrow keys move through suggestions, Enter selects, Escape closes the list
- [ ] Selecting a city shows a loading skeleton, then the current conditions and 5 forecast cards
- [ ] A search with no matches (for example `zzzzqqxx`) shows "No cities found"
- [ ] The °C / °F toggle changes every temperature without a reload
- [ ] "Save city" adds a chip under the search box; the chip selects the city; × removes it
- [ ] After a page reload, saved cities and the chosen unit are still there
- [ ] Stopping the network (or the container) and selecting a city shows the error state; "Try again" works once it is back
- [ ] The layout works at phone width and the menu button opens and closes the navigation
- [ ] `curl` calls from the API routes section return JSON; a missing `q` returns `400`

## Troubleshooting

**Port already in use**
`docker compose up` fails with "port is already allocated". Change `APP_PORT` in `.env` to a free port (for example `3003`), then run `docker compose up -d --build` and open that port.

**Hot reload not working**
Edits are not reflected in the browser. File polling is enabled in `docker-compose.yml`, so first check the container is running and watch the logs:

```bash
docker compose ps
docker compose logs -f weather-app
```

If the project is on a path Docker cannot watch (for example inside WSL but opened from Windows, or the reverse), keep the repository on the same side as Docker.

**Missing environment variables**
`docker compose` complains about empty values such as the container name or ports, or the app does not start. Create the file from the template and start again:

```bash
cp .env.example .env
docker compose up -d --build
```

**Cannot find module after pulling changes**
The `node_modules` Docker volume is out of date after dependencies change. Reset it:

```bash
docker compose down -v && docker compose up -d --build
```

**Open-Meteo requests fail**
Search or weather shows an error, or the API routes return `502`, `503` or `504`.

- Check that the container has internet access and try again in a minute (`503` means the provider rate-limited us)
- Call the route directly to see the message: `curl -i "http://localhost:3002/api/weather?lat=23.71&lon=90.41"`
- Check the provider itself: `curl "https://api.open-meteo.com/v1/forecast?latitude=23.71&longitude=90.41&current=temperature_2m"`
- Responses are cached on the server (10 minutes for weather, 24 hours for places), so a fix may take that long to show for an already-requested location unless the container is restarted

**Search does not work on the GitHub Pages site**
The Pages workflow builds a static site with `nuxt generate`, which has no server, so `/api/geocode` and `/api/weather` do not exist there. Run the app with Docker (or any Node host) to use it.

## Notes

- Source is bind-mounted, so edits hot-reload (file polling is enabled for Windows/macOS).
- `node_modules` lives in a separate Docker volume so Linux-built packages stay out of your host files.
- Never commit `.env`. If a secret is committed, rotate it first, then purge it from git history.

## Roadmap

- [ ] Hourly forecast
- [ ] Use the browser's location to find the current city
- [ ] Wind and rain details per day
- [ ] Dark mode
- [ ] Automated tests
- [ ] Server hosting for the API routes (the static GitHub Pages build has none)

## Attribution

Weather data and geocoding by [Open-Meteo.com](https://open-meteo.com/), provided under the [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) license. Open-Meteo's free API is for non-commercial use.

## License

Released under the [MIT License](LICENSE).
