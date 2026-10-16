<script setup lang="ts">
const store = useWeatherStore()
const { city, current, unitSymbol, favourites, canAddFavourite } = storeToRefs(store)

const saved = computed(() => !!city.value && favourites.value.some(item => item.id === city.value!.id))

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
    <div class="flex items-start justify-between gap-3">
      <h2 id="current-heading" class="text-lg font-medium text-sky-100">{{ place }}</h2>
      <button
        v-if="city"
        type="button"
        class="shrink-0 rounded-full bg-white/20 px-3 py-1 text-sm font-medium hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50"
        :aria-pressed="saved"
        :disabled="!saved && !canAddFavourite"
        :title="!saved && !canAddFavourite ? 'Saved cities limit reached' : undefined"
        @click="store.toggleFavourite(city)"
      >
        <span aria-hidden="true">{{ saved ? '★' : '☆' }}</span>
        {{ saved ? 'Saved' : 'Save city' }}
      </button>
    </div>

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
