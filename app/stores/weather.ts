import type { GeocodeResult } from '~~/server/api/geocode.get'
import type { WeatherResponse } from '~~/server/api/weather.get'

export type TemperatureUnit = 'celsius' | 'fahrenheit'

const toFahrenheit = (c: number) => Math.round((c * 9) / 5 + 32)

export const useWeatherStore = defineStore('weather', () => {
  const city = ref<GeocodeResult | null>(null)
  const weather = ref<WeatherResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const unit = ref<TemperatureUnit>('celsius')

  // Latest request wins: a slow earlier response must not overwrite a newer one
  let requestId = 0

  const convert = (celsius: number) =>
    unit.value === 'celsius' ? Math.round(celsius) : toFahrenheit(celsius)

  const unitSymbol = computed(() => (unit.value === 'celsius' ? '°C' : '°F'))

  const current = computed(() => {
    const data = weather.value?.current
    if (!data) return null
    return {
      ...data,
      temperature: convert(data.temperature),
      feelsLike: convert(data.feelsLike)
    }
  })

  const forecast = computed(() =>
    (weather.value?.daily ?? []).map(day => ({
      ...day,
      tempMax: convert(day.tempMax),
      tempMin: convert(day.tempMin)
    }))
  )

  async function selectCity(selected: GeocodeResult) {
    city.value = selected
    await fetchWeather()
  }

  async function fetchWeather() {
    if (!city.value) return

    const id = ++requestId
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<WeatherResponse>('/api/weather', {
        query: { lat: city.value.lat, lon: city.value.lon }
      })
      if (id !== requestId) return
      weather.value = data
    } catch (e: any) {
      if (id !== requestId) return
      weather.value = null
      error.value = e?.data?.message ?? 'Could not load weather. Please try again.'
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  // Favourites and unit are stored in the browser. They are loaded by hydrate() after
  // mount, never during setup, so the first client render matches the server HTML.
  const favourites = ref<GeocodeResult[]>([])
  const hydrated = ref(false)

  function hydrate() {
    if (hydrated.value) return
    unit.value = readStorage(STORAGE_KEYS.unit, parseUnit, 'celsius')
    favourites.value = readStorage(STORAGE_KEYS.favourites, parseFavourites, [])
    hydrated.value = true
  }

  // Saving only starts once hydrated, otherwise the empty defaults would overwrite stored data
  watch(favourites, (list) => {
    if (hydrated.value) writeStorage(STORAGE_KEYS.favourites, list)
  }, { deep: true })

  watch(unit, (value) => {
    if (hydrated.value) writeStorage(STORAGE_KEYS.unit, value)
  })

  const isFavourite = (id: number) => favourites.value.some(item => item.id === id)

  const canAddFavourite = computed(() => favourites.value.length < MAX_FAVOURITES)

  function addFavourite(selected: GeocodeResult) {
    if (isFavourite(selected.id) || !canAddFavourite.value) return
    favourites.value.push({ ...selected })
  }

  function removeFavourite(id: number) {
    favourites.value = favourites.value.filter(item => item.id !== id)
  }

  function toggleFavourite(selected: GeocodeResult) {
    if (isFavourite(selected.id)) removeFavourite(selected.id)
    else addFavourite(selected)
  }

  function setUnit(next: TemperatureUnit) {
    unit.value = next
  }

  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  function reset() {
    requestId++
    city.value = null
    weather.value = null
    loading.value = false
    error.value = null
  }

  return {
    city, weather, loading, error, unit, favourites, hydrated,
    unitSymbol, current, forecast, canAddFavourite,
    selectCity, fetchWeather, setUnit, toggleUnit, reset,
    hydrate, isFavourite, addFavourite, removeFavourite, toggleFavourite
  }
})
