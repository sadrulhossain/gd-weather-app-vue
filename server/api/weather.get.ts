interface OpenMeteoForecastResponse {
  timezone: string
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    wind_speed_10m: number
    weather_code: number
    is_day: number
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: Array<number | null>
  }
}

export interface WeatherResponse {
  timezone: string
  current: {
    time: string
    temperature: number
    feelsLike: number
    humidity: number
    windSpeed: number
    weatherCode: number
    isDay: boolean
  }
  daily: Array<{
    date: string
    weatherCode: number
    tempMax: number
    tempMin: number
    precipitationChance: number | null
  }>
}

function parseCoordinate(value: unknown, min: number, max: number): number | null {
  if (typeof value !== 'string' || value.trim() === '') return null
  const num = Number(value)
  return Number.isFinite(num) && num >= min && num <= max ? num : null
}

export default defineCachedEventHandler(async (event): Promise<WeatherResponse> => {
  const query = getQuery(event)
  const lat = parseCoordinate(query.lat, -90, 90)
  const lon = parseCoordinate(query.lon, -180, 180)

  if (lat === null || lon === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Query "lat" (-90 to 90) and "lon" (-180 to 180) are required numbers'
    })
  }

  const data = await openMeteoFetch<OpenMeteoForecastResponse>(FORECAST_URL, {
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    forecast_days: 5,
    timezone: 'auto'
  })

  return {
    timezone: data.timezone,
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1
    },
    daily: data.daily.time.map((date, i) => ({
      date,
      weatherCode: data.daily.weather_code[i]!,
      tempMax: data.daily.temperature_2m_max[i]!,
      tempMin: data.daily.temperature_2m_min[i]!,
      precipitationChance: data.daily.precipitation_probability_max[i] ?? null
    }))
  }
}, {
  // Current conditions update every ~15 min upstream
  maxAge: 60 * 10,
  getKey: (event) => {
    const { lat, lon } = getQuery(event)
    // Round to ~1 km so nearby requests share one cache entry
    return `weather:${Number(lat).toFixed(2)}:${Number(lon).toFixed(2)}`
  }
})
