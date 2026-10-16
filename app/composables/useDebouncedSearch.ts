import type { GeocodeResult } from '~~/server/api/geocode.get'

interface Options {
  delay?: number
  minLength?: number
}

export function useDebouncedSearch({ delay = 300, minLength = 2 }: Options = {}) {
  const query = ref('')
  const results = ref<GeocodeResult[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let timer: ReturnType<typeof setTimeout> | undefined
  let controller: AbortController | undefined

  function cancel() {
    clearTimeout(timer)
    controller?.abort()
    controller = undefined
  }

  async function search(term: string) {
    controller = new AbortController()
    const { signal } = controller
    loading.value = true
    error.value = null

    try {
      results.value = await $fetch<GeocodeResult[]>('/api/geocode', {
        query: { q: term },
        signal
      })
    } catch (e: any) {
      // An aborted request means a newer search replaced it
      if (signal.aborted) return
      results.value = []
      error.value = e?.data?.message ?? 'Search failed. Please try again.'
    } finally {
      if (!signal.aborted) loading.value = false
    }
  }

  function clear() {
    cancel()
    query.value = ''
    results.value = []
    loading.value = false
    error.value = null
  }

  watch(query, (value) => {
    cancel()
    const term = value.trim()

    if (term.length < minLength) {
      results.value = []
      loading.value = false
      error.value = null
      return
    }

    loading.value = true
    timer = setTimeout(() => search(term), delay)
  })

  onScopeDispose(cancel)

  return { query, results, loading, error, clear }
}
