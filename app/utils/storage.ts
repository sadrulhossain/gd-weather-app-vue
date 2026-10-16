import type { GeocodeResult } from '~~/server/api/geocode.get'

export const STORAGE_KEYS = {
  favourites: 'weather-app:v1:favourites',
  unit: 'weather-app:v1:unit'
} as const

export const MAX_FAVOURITES = 20

// localStorage can throw (private mode, blocked cookies, quota), so every access is guarded
export function readStorage<T>(key: string, parse: (raw: unknown) => T, fallback: T): T {
  if (!import.meta.client) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return parse(JSON.parse(raw))
  } catch {
    return fallback
  }
}

export function writeStorage(key: string, value: unknown): void {
  if (!import.meta.client) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota exceeded or storage unavailable: the app still works, it just won't persist
  }
}

// Stored data is user-editable, so nothing read back is trusted

export function parseUnit(raw: unknown): 'celsius' | 'fahrenheit' {
  return raw === 'fahrenheit' ? 'fahrenheit' : 'celsius'
}

const text = (value: unknown, max = 100): string | null =>
  typeof value === 'string' && value.trim() !== '' ? value.trim().slice(0, max) : null

function parseCity(raw: unknown): GeocodeResult | null {
  if (typeof raw !== 'object' || raw === null) return null
  const item = raw as Record<string, unknown>

  const name = text(item.name)
  const { id, lat, lon } = item
  if (
    !name
    || typeof id !== 'number' || !Number.isInteger(id)
    || typeof lat !== 'number' || !Number.isFinite(lat) || lat < -90 || lat > 90
    || typeof lon !== 'number' || !Number.isFinite(lon) || lon < -180 || lon > 180
  ) {
    return null
  }

  // Rebuild the object so unexpected extra fields are dropped
  return {
    id,
    name,
    region: text(item.region),
    country: text(item.country),
    lat,
    lon,
    timezone: text(item.timezone)
  }
}

export function parseFavourites(raw: unknown): GeocodeResult[] {
  if (!Array.isArray(raw)) return []

  const seen = new Set<number>()
  const cities: GeocodeResult[] = []

  for (const entry of raw) {
    const city = parseCity(entry)
    if (!city || seen.has(city.id)) continue
    seen.add(city.id)
    cities.push(city)
    if (cities.length >= MAX_FAVOURITES) break
  }

  return cities
}
