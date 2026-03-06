import { ref } from 'vue'

export interface CalendarEvent {
  id: string
  title: string
  date: string
  endDate?: string
  type: string
  description: string
}

export function useCalendarData() {
  const events = ref<CalendarEvent[]>([
    { id: 'E001', title: 'สอบกลางภาค', date: '17/03/2568', endDate: '21/03/2568', type: 'สอบ', description: 'การสอบกลางภาคเรียนที่ 1/2568' },
    { id: 'E002', title: 'วันกีฬาสี', date: '28/02/2568', type: 'กิจกรรม', description: 'กิจกรรมกีฬาสีประจำปี' },
    { id: 'E003', title: 'ประชุมผู้ปกครอง', date: '14/03/2568', type: 'ประชุม', description: 'ประชุมผู้ปกครองประจำภาคเรียน' },
    { id: 'E004', title: 'วันหยุดราชการ', date: '06/04/2568', type: 'วันหยุด', description: 'วันจักรี' },
    { id: 'E005', title: 'ปิดภาคเรียนที่ 1', date: '30/04/2568', type: 'การศึกษา', description: 'วันสุดท้ายของภาคเรียนที่ 1/2568' },
    { id: 'E006', title: 'เปิดภาคเรียนที่ 2', date: '19/05/2568', type: 'การศึกษา', description: 'วันแรกของภาคเรียนที่ 2/2568' },
  ])

  return { events }
}
