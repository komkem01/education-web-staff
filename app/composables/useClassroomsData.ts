import { ref } from 'vue'

export interface ClassroomRow {
  id: string
  name: string
  level: string
  advisor: string
  students: number
  room: string
}

export function useClassroomsData() {
  const rows = ref<ClassroomRow[]>([
    { id: 'CR001', name: 'ม.1/1', level: 'ม.1', advisor: 'นางมาลี ดอกไม้', students: 35, room: '101' },
    { id: 'CR002', name: 'ม.1/2', level: 'ม.1', advisor: 'นายสมศักดิ์ บุญมา', students: 33, room: '102' },
    { id: 'CR003', name: 'ม.2/1', level: 'ม.2', advisor: 'นางจันทร์ กลมกลิ้ง', students: 36, room: '201' },
    { id: 'CR004', name: 'ม.2/2', level: 'ม.2', advisor: 'นายวิชัย รักเรียน', students: 34, room: '202' },
    { id: 'CR005', name: 'ม.3/1', level: 'ม.3', advisor: 'นางสาวสมหมาย ใจดี', students: 37, room: '301' },
    { id: 'CR006', name: 'ม.4/1', level: 'ม.4', advisor: 'นางสาวพรทิพย์ สุขใจ', students: 30, room: '401' },
    { id: 'CR007', name: 'ม.5/2', level: 'ม.5', advisor: 'นายประสิทธิ์ เกษตรกร', students: 28, room: '502' },
    { id: 'CR008', name: 'ม.6/1', level: 'ม.6', advisor: 'นายธีระ มั่นคง', students: 32, room: '601' },
  ])

  return { rows }
}
