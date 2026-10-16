<script setup lang="ts">
const counter = useCounterStore()

// Runs during SSR only on first load, so the value is serialized into the payload
if (!counter.renderedOn) {
  counter.count = 5
  counter.renderedOn = import.meta.server ? 'server' : 'client'
}
</script>

<template>
  <section class="rounded-lg bg-white p-6 shadow-sm">
    <h1 class="text-2xl font-bold">Pinia test store</h1>
    <p class="mt-2 text-slate-600">
      Initial state was set on the <strong>{{ counter.renderedOn }}</strong>.
    </p>
    <p class="mt-4 text-4xl font-semibold text-sky-600">{{ counter.count }}</p>
    <button
      type="button"
      class="mt-4 rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
      @click="counter.increment()"
    >
      Increment
    </button>
  </section>
</template>
