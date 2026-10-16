<script setup lang="ts">
// Respect the base URL used when deployed under a sub-path (GitHub Pages)
const { baseURL } = useRuntimeConfig().app
useHead({
  link: [{ rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` }]
})
</script>

<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>
