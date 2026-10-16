<script setup lang="ts">
const store = useWeatherStore()
const { favourites, city } = storeToRefs(store)
</script>

<template>
  <section v-if="favourites.length" aria-labelledby="favourites-heading">
    <h2 id="favourites-heading" class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
      Saved cities
    </h2>
    <ul class="flex flex-wrap gap-2">
      <li
        v-for="item in favourites"
        :key="item.id"
        class="flex items-center overflow-hidden rounded-full border bg-white text-sm"
        :class="city?.id === item.id ? 'border-sky-500' : 'border-slate-300'"
      >
        <button
          type="button"
          class="py-1.5 pl-3 pr-2 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500"
          :aria-current="city?.id === item.id ? 'true' : undefined"
          @click="store.selectCity(item)"
        >
          {{ item.name }}<span v-if="item.country" class="text-slate-500">, {{ item.country }}</span>
        </button>
        <button
          type="button"
          class="py-1.5 pl-1 pr-3 text-slate-400 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500"
          :aria-label="`Remove ${item.name} from saved cities`"
          @click="store.removeFavourite(item.id)"
        >
          <span aria-hidden="true">×</span>
        </button>
      </li>
    </ul>
  </section>
</template>
