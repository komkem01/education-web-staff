import { ref } from 'vue'

export type DocStatus = 'ร้องขอ' | 'กำลังดำเนินการ' | 'เสร็จสิ้น' | 'ยกเลิก'
export type DocCategory = 'เอกสารราชการ' | 'ใบรับรอง' | 'แบบฟอร์ม' | 'คู่มือ' | 'เอกสารประกาศ'

export interface DocumentRequest {
  id: string
  docType: string             // ประเภทเอกสาร
  category: DocCategory
  requesterName: string
  requesterRole: string
  purpose: string             // วัตถุประสงค์
  copies: number             // จำนวนชุด
  status: DocStatus
  requestedAt: string
  completedAt: string
  handledBy: string           // ผู้ดำเนินการ
  note: string
}

export interface DocumentTemplate {
  id: string
  name: string
  category: DocCategory
  description: string
  lastUpdated: string
  downloadCount: number
}

export function useDocumentsData() {
  const requests = ref<DocumentRequest[]>([
    {
      id: 'DOC-001',
      docType: 'หนังสือรับรองการสอน',
      category: 'ใบรับรอง',
      requesterName: 'ครูอนุชา สว่างใจ',
      requesterRole: 'ครู',
      purpose: 'ใช้ประกอบการขอวิทยฐานะ',
      copies: 2,
      status: 'กำลังดำเนินการ',
      requestedAt: '28 ก.พ. 2568',
      completedAt: '',
      handledBy: 'นางสาวสมใจ รักงาน',
      note: '',
    },
    {
      id: 'DOC-002',
      docType: 'ปพ.1 (ปริญญาบัตร)',
      category: 'เอกสารราชการ',
      requesterName: 'นักเรียน เลขที่ 66100001',
      requesterRole: 'นักเรียน',
      purpose: 'ใช้สมัครเรียนต่อมหาวิทยาลัย',
      copies: 1,
      status: 'เสร็จสิ้น',
      requestedAt: '1 มี.ค. 2568',
      completedAt: '3 มี.ค. 2568',
      handledBy: 'นางสาวสมใจ รักงาน',
      note: 'รับเอกสารแล้วเมื่อ 3 มี.ค.',
    },
    {
      id: 'DOC-003',
      docType: 'ปพ.7 (ระเบียนแสดงผลการเรียน)',
      category: 'เอกสารราชการ',
      requesterName: 'นักเรียน เลขที่ 66100003',
      requesterRole: 'นักเรียน',
      purpose: 'ใช้สมัครงาน',
      copies: 3,
      status: 'ร้องขอ',
      requestedAt: '7 มี.ค. 2568',
      completedAt: '',
      handledBy: '',
      note: '',
    },
    {
      id: 'DOC-004',
      docType: 'หนังสือรับรองเป็นนักเรียน',
      category: 'ใบรับรอง',
      requesterName: 'นักเรียน เลขที่ 66100008',
      requesterRole: 'นักเรียน',
      purpose: 'ใช้เปิดบัญชีธนาคาร',
      copies: 1,
      status: 'เสร็จสิ้น',
      requestedAt: '5 มี.ค. 2568',
      completedAt: '6 มี.ค. 2568',
      handledBy: 'นางสาวสมใจ รักงาน',
      note: '',
    },
    {
      id: 'DOC-005',
      docType: 'แบบฟอร์มขอลา',
      category: 'แบบฟอร์ม',
      requesterName: 'ครูวิมล สดใส',
      requesterRole: 'ครู',
      purpose: 'ลากิจส่วนตัว 2 วัน',
      copies: 1,
      status: 'เสร็จสิ้น',
      requestedAt: '4 มี.ค. 2568',
      completedAt: '4 มี.ค. 2568',
      handledBy: 'นางสาวสมใจ รักงาน',
      note: '',
    },
  ])

  const templates = ref<DocumentTemplate[]>([
    { id: 'T001', name: 'แบบฟอร์มขอลา', category: 'แบบฟอร์ม', description: 'แบบฟอร์มขออนุญาตลางาน สำหรับครูและบุคลากร', lastUpdated: '1 ม.ค. 2568', downloadCount: 142 },
    { id: 'T002', name: 'แบบฟอร์มขอเบิกพัสดุ', category: 'แบบฟอร์ม', description: 'แบบฟอร์มขอเบิกวัสดุและอุปกรณ์', lastUpdated: '1 ม.ค. 2568', downloadCount: 87 },
    { id: 'T003', name: 'แบบฟอร์มขอเปิดรายวิชา', category: 'แบบฟอร์ม', description: 'แบบฟอร์มขอเปิดหรือปรับปรุงรายวิชา', lastUpdated: '15 ก.พ. 2568', downloadCount: 23 },
    { id: 'T004', name: 'แบบฟอร์ม ปพ.5', category: 'เอกสารราชการ', description: 'สมุดบันทึกผลการเรียนรู้รายวิชา', lastUpdated: '1 พ.ค. 2567', downloadCount: 210 },
    { id: 'T005', name: 'คู่มือการใช้งานระบบ', category: 'คู่มือ', description: 'คู่มือสำหรับครูและบุคลากรในการใช้งาน EduFlow', lastUpdated: '1 มี.ค. 2568', downloadCount: 65 },
    { id: 'T006', name: 'แบบฟอร์มใบแจ้งซ่อม', category: 'แบบฟอร์ม', description: 'แจ้งซ่อมอุปกรณ์และสิ่งอำนวยความสะดวก', lastUpdated: '1 ม.ค. 2568', downloadCount: 31 },
  ])

  return { requests, templates }
}
