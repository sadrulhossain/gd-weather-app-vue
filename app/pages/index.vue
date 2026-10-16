<script setup lang="ts">
const store = useWeatherStore()
const { city, weather, loading, error } = storeToRefs(store)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div class="flex-1">
        <CitySearch @select="store.selectCity" />
      </div>
      <UnitToggle />
    </div>

    <WeatherSkeleton v-if="loading" />

    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-6 text-center" role="alert">
      <p class="font-medium text-red-700">{{ error }}</p>
      <button
        v-if="city"
        type="button"
        class="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        @click="store.fetchWeather()"
      >
        Try again
      </button>
    </div>

    <template v-else-if="weather">
      <CurrentWeatherCard />
      <ForecastList />
    </template>

    <div v-else class="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
      <p class="text-5xl" aria-hidden="true">🌍</p>
      <p class="mt-3 text-lg">Search for a city to see its weather.</p>
    </div>
  </div>
</template>
