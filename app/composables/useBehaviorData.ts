import { ref } from 'vue'

export interface BehaviorRow {
  id: string
  studentId: string
  studentName: string
  class: string
  type: string
  points: number
  note: string
  recordedBy: string
  date: string
}

export function useBehaviorData() {
  const rows = ref<BehaviorRow[]>([
    { id: 'B001', studentId: '66100003', studentName: 'เด็กชายพลวัต เข้มแข็ง', class: 'ม.2/2', type: 'ตัดคะแนน', points: -5, note: 'ขาดเรียนไม่มีใบลา', recordedBy: 'ครูสมหมาย ใจดี', date: '05/03/2568' },
    { id: 'B002', studentId: '66100006', studentName: 'นางสาวชลิตา สดใส', class: 'ม.4/1', type: 'เพิ่มคะแนน', points: 5, note: 'ช่วยเหลืองานโรงเรียน', recordedBy: 'ครูสมหมาย ใจดี', date: '04/03/2568' },
    { id: 'B003', studentId: '66100007', studentName: 'นายอภิชาต โชคดี', class: 'ม.5/2', type: 'ตัดคะแนน', points: -10, note: 'ทะเลาะวิวาท', recordedBy: 'นายประสิทธิ์ เกษตรกร', date: '03/03/2568' },
    { id: 'B004', studentId: '66100009', studentName: 'นายเจษฎา บึกบึน', class: 'ม.6/1', type: 'ตัดคะแนน', points: -5, note: 'ขาดเรียนซ้ำ', recordedBy: 'นายธีระ มั่นคง', date: '02/03/2568' },
    { id: 'B005', studentId: '66100001', studentName: 'เด็กชายธนวัฒน์ สุขสันต์', class: 'ม.1/1', type: 'เพิ่มคะแนน', points: 10, note: 'ชนะการแข่งขันคณิตศาสตร์', recordedBy: 'นางมาลี ดอกไม้', date: '01/03/2568' },
  ])

  return { rows }
}
