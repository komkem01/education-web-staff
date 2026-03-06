import { ref, onMounted } from 'vue'

export function usePageLoad(delay = 600) {
  const loading = ref(true)

  onMounted(() => {
    setTimeout(() => {
      loading.value = false
    }, delay)
  })

  return { loading }
}
