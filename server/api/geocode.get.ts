interface OpenMeteoGeocodeResponse {
  results?: Array<{
    id: number
    name: string
    latitude: number
    longitude: number
    country?: string
    admin1?: string
    timezone?: string
  }>
}

export interface GeocodeResult {
  id: number
  name: string
  region: string | null
  country: string | null
  lat: number
  lon: number
  timezone: string | null
}

export default defineCachedEventHandler(async (event): Promise<GeocodeResult[]> => {
  const { q } = getQuery(event)
  const term = typeof q === 'string' ? q.trim() : ''

  if (term.length < 2 || term.length > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Query "q" is required and must be 2-100 characters'
    })
  }

  const data = await openMeteoFetch<OpenMeteoGeocodeResponse>(GEOCODING_URL, {
    name: term,
    count: 5,
    language: 'en',
    format: 'json'
  })

  // Open-Meteo omits "results" entirely when nothing matches
  return (data.results ?? []).map(place => ({
    id: place.id,
    name: place.name,
    region: place.admin1 ?? null,
    country: place.country ?? null,
    lat: place.latitude,
    lon: place.longitude,
    timezone: place.timezone ?? null
  }))
}, {
  // Place names rarely change
  maxAge: 60 * 60 * 24,
  getKey: (event) => {
    const { q } = getQuery(event)
    return `geocode:${String(q ?? '').trim().toLowerCase()}`
  }
})
