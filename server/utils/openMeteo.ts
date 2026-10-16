const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

// Fetch from Open-Meteo and map failures to clean HTTP errors for our own clients
export async function openMeteoFetch<T>(url: string, query: Record<string, string | number>): Promise<T> {
  try {
    return await $fetch(url, { query, timeout: 8000 }) as T
  } catch (error: any) {
    const status = error?.response?.status
    // Open-Meteo answers 400 for bad parameters; anything else is the upstream's fault
    if (status === 400) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Open-Meteo rejected the request parameters' })
    }
    if (status === 429) {
      throw createError({ statusCode: 503, statusMessage: 'Service Unavailable', message: 'Weather provider rate limit reached, try again later' })
    }
    if (error?.name === 'TimeoutError' || error?.cause?.name === 'TimeoutError') {
      throw createError({ statusCode: 504, statusMessage: 'Gateway Timeout', message: 'Weather provider timed out' })
    }
    throw createError({ statusCode: 502, statusMessage: 'Bad Gateway', message: 'Weather provider is unavailable' })
  }
}

export { GEOCODING_URL, FORECAST_URL }
