import { ref } from 'vue'

export interface AnnouncementRow {
  id: string
  title: string
  author: string
  category: string
  date: string
  status: string
  isOwn: boolean
}

const rows = ref<AnnouncementRow[]>([
  { id: 'A001', title: 'แจ้งกำหนดการสอบกลางภาค ภาคเรียนที่ 1/2568', author: 'ฝ่ายวิชาการ', category: 'วิชาการ', date: '04/03/2568', status: 'เผยแพร่แล้ว', isOwn: false },
  { id: 'A002', title: 'ประกาศรับสมัครนักเรียนใหม่ประจำปีการศึกษา 2569', author: 'ฝ่ายทะเบียน', category: 'ทั่วไป', date: '03/03/2568', status: 'เผยแพร่แล้ว', isOwn: false },
  { id: 'A003', title: 'นัดประชุมครูประจำเดือนมีนาคม', author: 'ครูสมหมาย ใจดี', category: 'ประชุม', date: '02/03/2568', status: 'เผยแพร่แล้ว', isOwn: true },
  { id: 'A004', title: 'กิจกรรมวันกีฬาสีประจำปี 2568', author: 'ฝ่ายกิจกรรม', category: 'กิจกรรม', date: '01/03/2568', status: 'เผยแพร่แล้ว', isOwn: false },
  { id: 'A005', title: 'แจ้งนักเรียนห้อง ม.3/1 ส่งการบ้านพิเศษ', author: 'ครูสมหมาย ใจดี', category: 'วิชาการ', date: '28/02/2568', status: 'ฉบับร่าง', isOwn: true },
])

export function useAnnouncementsData() {
  return { rows }
}
