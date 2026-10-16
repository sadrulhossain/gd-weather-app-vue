<script setup lang="ts">
const isOpen = ref(false)

const links = [
  { label: 'Home', to: '/' }
]

const route = useRoute()
watch(() => route.fullPath, () => {
  isOpen.value = false
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="border-b border-slate-200 bg-white">
      <nav class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <NuxtLink to="/" class="text-lg font-semibold text-sky-600">
          Weather App
        </NuxtLink>

        <button
          type="button"
          class="rounded p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          :aria-expanded="isOpen"
          aria-controls="nav-links"
          aria-label="Toggle navigation"
          @click="isOpen = !isOpen"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path v-if="!isOpen" stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <ul
          id="nav-links"
          :class="isOpen ? 'flex' : 'hidden'"
          class="absolute left-0 right-0 top-14 flex-col gap-1 border-b border-slate-200 bg-white p-4 md:static md:flex md:flex-row md:gap-6 md:border-0 md:p-0"
        >
          <li v-for="link in links" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="block rounded px-2 py-1 text-slate-600 hover:text-sky-600"
              active-class="font-medium text-sky-600"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <slot />
    </main>
  </div>
</template>
