export const useCounterStore = defineStore('counter', () => {
  // Set on the server during SSR; arrives in the browser via the Nuxt payload
  const count = ref(0)
  const renderedOn = ref('')

  function increment() {
    count.value++
  }

  return { count, renderedOn, increment }
})
