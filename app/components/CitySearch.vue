<script setup lang="ts">
import type { GeocodeResult } from '~~/server/api/geocode.get'

const emit = defineEmits<{ select: [city: GeocodeResult] }>()

const { query, results, loading, error, clear } = useDebouncedSearch()

const listId = useId()
const open = ref(false)
const activeIndex = ref(-1)

const hasQuery = computed(() => query.value.trim().length >= 2)
const showList = computed(() => open.value && results.value.length > 0)
const showEmpty = computed(
  () => open.value && hasQuery.value && !loading.value && !error.value && results.value.length === 0
)
const optionId = (i: number) => `${listId}-option-${i}`

watch(results, () => {
  activeIndex.value = -1
})

function label(city: GeocodeResult) {
  return [city.name, city.region, city.country].filter(Boolean).join(', ')
}

function choose(city: GeocodeResult) {
  emit('select', city)
  clear()
  open.value = false
  activeIndex.value = -1
}

function onKeydown(event: KeyboardEvent) {
  const count = results.value.length

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      open.value = true
      if (count) activeIndex.value = (activeIndex.value + 1) % count
      break
    case 'ArrowUp':
      event.preventDefault()
      open.value = true
      if (count) activeIndex.value = (activeIndex.value - 1 + count) % count
      break
    case 'Home':
      if (showList.value) {
        event.preventDefault()
        activeIndex.value = 0
      }
      break
    case 'End':
      if (showList.value) {
        event.preventDefault()
        activeIndex.value = count - 1
      }
      break
    case 'Enter': {
      if (!showList.value) break
      event.preventDefault()
      const city = results.value[activeIndex.value >= 0 ? activeIndex.value : 0]
      if (city) choose(city)
      break
    }
    case 'Escape':
      open.value = false
      activeIndex.value = -1
      break
  }
}
</script>

<template>
  <div class="relative">
    <label for="city-search" class="sr-only">Search for a city</label>
    <input
      id="city-search"
      v-model="query"
      type="search"
      role="combobox"
      autocomplete="off"
      placeholder="Search for a city…"
      aria-autocomplete="list"
      :aria-expanded="showList"
      :aria-controls="listId"
      :aria-activedescendant="activeIndex >= 0 ? optionId(activeIndex) : undefined"
      class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
      @focus="open = true"
      @input="open = true"
      @blur="open = false"
      @keydown="onKeydown"
    >

    <ul
      v-show="showList"
      :id="listId"
      role="listbox"
      aria-label="City suggestions"
      class="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
    >
      <li
        v-for="(city, i) in results"
        :id="optionId(i)"
        :key="city.id"
        role="option"
        :aria-selected="i === activeIndex"
        class="cursor-pointer px-4 py-2"
        :class="i === activeIndex ? 'bg-sky-50 text-sky-700' : 'text-slate-700'"
        @mousedown.prevent="choose(city)"
        @mousemove="activeIndex = i"
      >
        {{ label(city) }}
      </li>
    </ul>

    <p
      v-if="showEmpty"
      class="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-lg"
    >
      No cities found
    </p>

    <p class="sr-only" role="status" aria-live="polite">
      <template v-if="loading">Searching…</template>
      <template v-else-if="showList">{{ results.length }} suggestions available. Use up and down arrows to review.</template>
      <template v-else-if="showEmpty">No cities found</template>
    </p>
    <p v-if="error" class="mt-2 text-sm text-red-600" role="alert">{{ error }}</p>
  </div>
</template>
