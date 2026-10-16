<script setup lang="ts">
const store = useWeatherStore()
const { forecast, unitSymbol } = storeToRefs(store)

// Noon avoids the date shifting a day when parsed in another timezone
function weekday(date: string, index: number) {
  if (index === 0) return 'Today'
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' })
}
</script>

<template>
  <section v-if="forecast.length" aria-labelledby="forecast-heading">
    <h2 id="forecast-heading" class="mb-3 text-lg font-semibold">5-day forecast</h2>
    <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <li
        v-for="(day, i) in forecast"
        :key="day.date"
        class="rounded-xl bg-white p-4 text-center shadow-sm"
      >
        <p class="font-medium">{{ weekday(day.date, i) }}</p>
        <p class="my-2 text-4xl" aria-hidden="true">{{ getWeatherInfo(day.weatherCode).icon }}</p>
        <p class="text-sm text-slate-600">{{ getWeatherInfo(day.weatherCode).label }}</p>
        <p class="mt-2">
          <span class="font-semibold">{{ day.tempMax }}{{ unitSymbol }}</span>
          <span class="text-slate-500"> / {{ day.tempMin }}{{ unitSymbol }}</span>
        </p>
        <p v-if="day.precipitationChance !== null" class="mt-1 text-xs text-sky-700">
          {{ day.precipitationChance }}% rain
        </p>
      </li>
    </ul>
  </section>
</template>
