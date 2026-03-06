import { ref } from 'vue'

export interface ApprovalRow {
  id: string
  type: string
  detail: string
  date: string
  status: string
}

export function useApprovalsData() {
  const rows = ref<ApprovalRow[]>([
    { id: 'REQ001', type: 'ขอลาป่วย', detail: 'ลาป่วย 2 วัน วันที่ 4-5 มีนาคม 2568', date: '03/03/2568', status: 'อนุมัติแล้ว' },
    { id: 'REQ002', type: 'ขอแก้ไขคะแนน', detail: 'แก้ไขคะแนนสอบของนักเรียนรหัส 66100005', date: '05/03/2568', status: 'รอดำเนินการ' },
    { id: 'REQ003', type: 'ขอสื่อการสอน', detail: 'ขอโปรเจกเตอร์เพื่อใช้ในการสอนห้อง 301', date: '01/03/2568', status: 'อนุมัติแล้ว' },
    { id: 'REQ004', type: 'ขอลากิจ', detail: 'ลากิจไปงานอบรมครู 1 วัน', date: '06/03/2568', status: 'รอดำเนินการ' },
    { id: 'REQ005', type: 'ขอจัดทำข้อสอบ', detail: 'ขออนุมัติข้อสอบกลางภาควิชาคณิตศาสตร์ ม.3', date: '28/02/2568', status: 'ปฏิเสธ' },
  ])

  return { rows }
}
