import { ref } from 'vue'

export interface AttendanceRow {
  studentId: string
  studentName: string
  class: string
  course: string
  date: string
  status: string
  note: string
}

export function useAttendanceData() {
  const rows = ref<AttendanceRow[]>([
    { studentId: '66100001', studentName: 'เด็กชายธนวัฒน์ สุขสันต์', class: 'ม.1/1', course: 'คณิตศาสตร์พื้นฐาน ม.3', date: '06/03/2568', status: 'มาเรียน', note: '' },
    { studentId: '66100002', studentName: 'เด็กหญิงนภาพร ใจงาม', class: 'ม.1/1', course: 'คณิตศาสตร์พื้นฐาน ม.3', date: '06/03/2568', status: 'มาเรียน', note: '' },
    { studentId: '66100003', studentName: 'เด็กชายพลวัต เข้มแข็ง', class: 'ม.2/2', course: 'คณิตศาสตร์ ม.2/1', date: '06/03/2568', status: 'ขาดเรียน', note: 'ไม่มีใบลา' },
    { studentId: '66100004', studentName: 'เด็กหญิงสุภาวดี หอมหวาน', class: 'ม.3/1', course: 'คณิตศาสตร์พื้นฐาน ม.3', date: '06/03/2568', status: 'มาเรียน', note: '' },
    { studentId: '66100005', studentName: 'นายก้องภพ ท้องฟ้า', class: 'ม.4/1', course: 'แคลคูลัส ม.6', date: '06/03/2568', status: 'ลาป่วย', note: 'มีใบรับรองแพทย์' },
    { studentId: '66100006', studentName: 'นางสาวชลิตา สดใส', class: 'ม.4/1', course: 'แคลคูลัส ม.6', date: '06/03/2568', status: 'มาเรียน', note: '' },
    { studentId: '66100007', studentName: 'นายอภิชาต โชคดี', class: 'ม.5/2', course: 'คณิตศาสตร์ ม.2/1', date: '06/03/2568', status: 'มาสาย', note: 'สาย 15 นาที' },
    { studentId: '66100008', studentName: 'นางสาวพิมพ์ใจ งามดี', class: 'ม.6/1', course: 'แคลคูลัส ม.6', date: '06/03/2568', status: 'มาเรียน', note: '' },
    { studentId: '66100009', studentName: 'นายเจษฎา บึกบึน', class: 'ม.6/1', course: 'แคลคูลัส ม.6', date: '06/03/2568', status: 'ขาดเรียน', note: '' },
  ])

  return { rows }
}
