<script setup lang="ts">
const store = useWeatherStore()
const { city, current, unitSymbol } = storeToRefs(store)

const info = computed(() =>
  current.value ? getWeatherInfo(current.value.weatherCode, current.value.isDay) : null
)

const place = computed(() =>
  [city.value?.name, city.value?.region, city.value?.country].filter(Boolean).join(', ')
)
</script>

<template>
  <section
    v-if="current && info"
    aria-labelledby="current-heading"
    class="rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-6 text-white shadow-md"
  >
    <h2 id="current-heading" class="text-lg font-medium text-sky-100">{{ place }}</h2>

    <div class="mt-4 flex items-center justify-between gap-4">
      <div>
        <p class="text-6xl font-bold sm:text-7xl">{{ current.temperature }}{{ unitSymbol }}</p>
        <p class="mt-1 text-xl">{{ info.label }}</p>
      </div>
      <span class="text-7xl sm:text-8xl" aria-hidden="true">{{ info.icon }}</span>
    </div>

    <dl class="mt-6 grid grid-cols-3 gap-4 border-t border-white/25 pt-4 text-sm">
      <div>
        <dt class="text-sky-100">Feels like</dt>
        <dd class="text-lg font-semibold">{{ current.feelsLike }}{{ unitSymbol }}</dd>
      </div>
      <div>
        <dt class="text-sky-100">Humidity</dt>
        <dd class="text-lg font-semibold">{{ current.humidity }}%</dd>
      </div>
      <div>
        <dt class="text-sky-100">Wind</dt>
        <dd class="text-lg font-semibold">{{ current.windSpeed }} km/h</dd>
      </div>
    </dl>
  </section>
</template>
