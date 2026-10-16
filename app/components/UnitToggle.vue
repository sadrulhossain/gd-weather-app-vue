<script setup lang="ts">
const store = useWeatherStore()
const { unit } = storeToRefs(store)

const options = [
  { value: 'celsius', label: '°C' },
  { value: 'fahrenheit', label: '°F' }
] as const
</script>

<template>
  <div class="inline-flex rounded-lg border border-slate-300 bg-white p-0.5" role="group" aria-label="Temperature unit">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :aria-pressed="unit === option.value"
      class="rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      :class="unit === option.value ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
      @click="store.setUnit(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
