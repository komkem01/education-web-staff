import { ref } from 'vue'

export interface CourseRow {
  id: string
  name: string
  subject: string
  teacher: string
  credits: number
  students: number
  semester: string
}

export function useCoursesData() {
  const rows = ref<CourseRow[]>([
    { id: 'C001', name: 'คณิตศาสตร์พื้นฐาน ม.3', subject: 'คณิตศาสตร์', teacher: 'นางสาวสมหมาย ใจดี', credits: 1.5, students: 37, semester: '1/2568' },
    { id: 'C002', name: 'ภาษาไทยพื้นฐาน ม.2', subject: 'ภาษาไทย', teacher: 'นายวิชัย รักเรียน', credits: 1.5, students: 70, semester: '1/2568' },
    { id: 'C003', name: 'วิทยาศาสตร์ ม.1', subject: 'วิทยาศาสตร์', teacher: 'นางมาลี ดอกไม้', credits: 1.5, students: 68, semester: '1/2568' },
    { id: 'C004', name: 'สังคมศึกษา ม.2', subject: 'สังคมศึกษา', teacher: 'นายสมศักดิ์ บุญมา', credits: 1.0, students: 70, semester: '1/2568' },
    { id: 'C005', name: 'ภาษาอังกฤษ ม.4', subject: 'ภาษาต่างประเทศ', teacher: 'นางสาวพรทิพย์ สุขใจ', credits: 1.5, students: 30, semester: '1/2568' },
    { id: 'C006', name: 'พลศึกษา ม.5', subject: 'พลศึกษา', teacher: 'นายประสิทธิ์ เกษตรกร', credits: 1.0, students: 28, semester: '1/2568' },
    { id: 'C007', name: 'ศิลปะ ม.3', subject: 'ศิลปะ', teacher: 'นางจันทร์ กลมกลิ้ง', credits: 1.0, students: 37, semester: '1/2568' },
    { id: 'C008', name: 'แคลคูลัส ม.6', subject: 'คณิตศาสตร์', teacher: 'นายธีระ มั่นคง', credits: 1.5, students: 32, semester: '1/2568' },
  ])

  return { rows }
}
