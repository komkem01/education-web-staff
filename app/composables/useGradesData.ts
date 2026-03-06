import { ref } from 'vue'

export interface GradeRow {
  studentId: string
  studentName: string
  class: string
  course: string
  midterm: number
  final: number
  total: number
  grade: string
}

export function getGrade(total: number): string {
  if (total >= 80) return '4'
  if (total >= 75) return '3.5'
  if (total >= 70) return '3'
  if (total >= 65) return '2.5'
  if (total >= 60) return '2'
  if (total >= 55) return '1.5'
  if (total >= 50) return '1'
  return '0'
}

export function useGradesData() {
  const rows = ref<GradeRow[]>([
    { studentId: '66100001', studentName: 'เด็กชายธนวัฒน์ สุขสันต์', class: 'ม.1/1', course: 'วิทยาศาสตร์ ม.1', midterm: 42, final: 44, total: 86, grade: '4' },
    { studentId: '66100002', studentName: 'เด็กหญิงนภาพร ใจงาม', class: 'ม.1/1', course: 'วิทยาศาสตร์ ม.1', midterm: 45, final: 48, total: 93, grade: '4' },
    { studentId: '66100003', studentName: 'เด็กชายพลวัต เข้มแข็ง', class: 'ม.2/2', course: 'ภาษาไทยพื้นฐาน ม.2', midterm: 35, final: 38, total: 73, grade: '3' },
    { studentId: '66100004', studentName: 'เด็กหญิงสุภาวดี หอมหวาน', class: 'ม.3/1', course: 'คณิตศาสตร์พื้นฐาน ม.3', midterm: 38, final: 40, total: 78, grade: '3.5' },
    { studentId: '66100005', studentName: 'นายก้องภพ ท้องฟ้า', class: 'ม.4/1', course: 'ภาษาอังกฤษ ม.4', midterm: 28, final: 30, total: 58, grade: '1.5' },
    { studentId: '66100006', studentName: 'นางสาวชลิตา สดใส', class: 'ม.4/1', course: 'ภาษาอังกฤษ ม.4', midterm: 47, final: 49, total: 96, grade: '4' },
    { studentId: '66100007', studentName: 'นายอภิชาต โชคดี', class: 'ม.5/2', course: 'พลศึกษา ม.5', midterm: 22, final: 24, total: 46, grade: '0' },
    { studentId: '66100008', studentName: 'นางสาวพิมพ์ใจ งามดี', class: 'ม.6/1', course: 'แคลคูลัส ม.6', midterm: 42, final: 43, total: 85, grade: '4' },
    { studentId: '66100009', studentName: 'นายเจษฎา บึกบึน', class: 'ม.6/1', course: 'แคลคูลัส ม.6', midterm: 20, final: 22, total: 42, grade: '0' },
  ])

  return { rows }
}
