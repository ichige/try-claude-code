import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'
import { date } from 'quasar'

export const useAppStore = defineStore(
  'app',
  () => {
    const processingMonth = ref(date.formatDate(new Date(), 'YYYYMM'))

    /** YYYY年MM月 形式のラベル */
    const processingMonthLabel = computed(() => {
      const ym = processingMonth.value
      return `${ym.substring(0, 4)}年${ym.substring(4, 6)}月`
    })

    /** 処理月の年 */
    const processingYear = computed(() => parseInt(processingMonth.value.substring(0, 4)))

    /** 処理月の月 (1-12) */
    const processingMonthNum = computed(() => parseInt(processingMonth.value.substring(4, 6)))

    return { processingMonth, processingMonthLabel, processingYear, processingMonthNum }
  },
  { persist: true },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
