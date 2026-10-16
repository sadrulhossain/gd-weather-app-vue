<template>
  <div class="animate-pulse space-y-6" role="status" aria-label="Loading weather">
    <div class="h-52 rounded-2xl bg-slate-200" />
    <div>
      <div class="mb-3 h-6 w-40 rounded bg-slate-200" />
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div v-for="n in 5" :key="n" class="h-44 rounded-xl bg-slate-200" />
      </div>
    </div>
    <span class="sr-only">Loading weather…</span>
  </div>
</template>
