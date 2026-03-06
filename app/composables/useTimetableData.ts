import { ref } from 'vue'

export interface TimetableRow {
  period: string
  time: string
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
}

export function useTimetableData() {
  const rows = ref<TimetableRow[]>([
    { period: '1', time: '08:00–08:50', monday: 'คณิตศาสตร์ ม.3/1', tuesday: 'คณิตศาสตร์ ม.3/1', wednesday: '-', thursday: 'คณิตศาสตร์ ม.2/1', friday: '-' },
    { period: '2', time: '08:50–09:40', monday: '-', tuesday: '-', wednesday: 'คณิตศาสตร์ ม.2/1', thursday: '-', friday: 'คณิตศาสตร์ ม.6/1' },
    { period: '3', time: '09:40–10:30', monday: 'คณิตศาสตร์ ม.6/1', tuesday: '-', wednesday: '-', thursday: '-', friday: 'คณิตศาสตร์ ม.3/1' },
    { period: '4', time: '10:30–11:20', monday: '-', tuesday: 'คณิตศาสตร์ ม.6/1', wednesday: '-', thursday: 'คณิตศาสตร์ ม.3/1', friday: '-' },
    { period: '5', time: '11:20–12:00', monday: '-', tuesday: '-', wednesday: 'ที่ปรึกษา ม.3/1', thursday: '-', friday: '-' },
    { period: '6', time: '13:00–13:50', monday: 'คณิตศาสตร์ ม.2/1', tuesday: '-', wednesday: '-', thursday: '-', friday: 'คณิตศาสตร์ ม.2/1' },
    { period: '7', time: '13:50–14:40', monday: '-', tuesday: 'คณิตศาสตร์ ม.2/1', wednesday: '-', thursday: 'คณิตศาสตร์ ม.6/1', friday: '-' },
    { period: '8', time: '14:40–15:30', monday: '-', tuesday: '-', wednesday: 'คณิตศาสตร์ ม.6/1', thursday: '-', friday: '-' },
  ])

  return { rows }
}
