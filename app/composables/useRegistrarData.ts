import { ref } from 'vue'

export type RegStatus = 'รอตรวจสอบ' | 'ลงทะเบียนแล้ว' | 'ปฏิเสธ' | 'ยกเลิก'
export type TransferStatus = 'รอดำเนินการ' | 'เสร็จสิ้น' | 'ยกเลิก'
export type TransferType = 'ย้ายเข้า' | 'ย้ายออก'

export interface RegistrationRow {
  id: string
  studentId: string
  studentName: string
  prefix: string
  dob: string                   // วันเกิด
  nationalId: string            // เลขบัตรประชาชน
  targetClass: string           // ห้องที่ขอเข้า
  parentName: string
  parentPhone: string
  registeredBy: string          // ครู หรือ บุคลากร
  registeredByRole: string
  status: RegStatus
  submittedAt: string
  processedAt: string
  note: string
}

export interface TransferRow {
  id: string
  studentId: string
  studentName: string
  currentClass: string
  transferType: TransferType
  targetSchool: string          // โรงเรียนปลายทาง (ย้ายออก) หรือต้นทาง (ย้ายเข้า)
  reason: string
  status: TransferStatus
  requestedAt: string
  completedAt: string
  handledBy: string
}

export function useRegistrarData() {
  const registrations = ref<RegistrationRow[]>([
    {
      id: 'REG-001',
      studentId: 'NEW',
      studentName: 'พิชาภัค เรืองศรี',
      prefix: 'ด.ญ.',
      dob: '10 ก.พ. 2554',
      nationalId: '1-2345-67890-12-3',
      targetClass: 'ม.1/1',
      parentName: 'นางสาวธิดา เรืองศรี',
      parentPhone: '081-999-0011',
      registeredBy: 'ครูสมหมาย ใจดี',
      registeredByRole: 'ครู',
      status: 'รอตรวจสอบ',
      submittedAt: '7 มี.ค. 2568',
      processedAt: '',
      note: '',
    },
    {
      id: 'REG-002',
      studentId: 'NEW',
      studentName: 'กิตติกร วงศ์ทอง',
      prefix: 'ด.ช.',
      dob: '22 พ.ค. 2554',
      nationalId: '1-3456-78901-23-4',
      targetClass: 'ม.1/2',
      parentName: 'นายชัยยุทธ วงศ์ทอง',
      parentPhone: '089-000-1122',
      registeredBy: 'นางสาวสมใจ รักงาน',
      registeredByRole: 'บุคลากร',
      status: 'ลงทะเบียนแล้ว',
      submittedAt: '5 มี.ค. 2568',
      processedAt: '6 มี.ค. 2568',
      note: 'ลงทะเบียนเรียบร้อย มอบหมายประจำห้อง ม.1/2',
    },
    {
      id: 'REG-003',
      studentId: 'NEW',
      studentName: 'อรอุมา สุขสวัสดิ์',
      prefix: 'ด.ญ.',
      dob: '5 ส.ค. 2554',
      nationalId: '1-4567-89012-34-5',
      targetClass: 'ม.1/1',
      parentName: 'นางอุษา สุขสวัสดิ์',
      parentPhone: '086-111-2233',
      registeredBy: 'ครูวิมล สดใส',
      registeredByRole: 'ครู',
      status: 'รอตรวจสอบ',
      submittedAt: '7 มี.ค. 2568',
      processedAt: '',
      note: '',
    },
  ])

  const transfers = ref<TransferRow[]>([
    {
      id: 'TRF-001',
      studentId: '66100011',
      studentName: 'ธนวัฒน์ ปิยะมิตร',
      currentClass: 'ม.3/2',
      transferType: 'ย้ายออก',
      targetSchool: 'โรงเรียนรัตนวิทยา',
      reason: 'ผู้ปกครองย้ายที่อยู่',
      status: 'เสร็จสิ้น',
      requestedAt: '28 ก.พ. 2568',
      completedAt: '3 มี.ค. 2568',
      handledBy: 'นางสาวสมใจ รักงาน',
    },
    {
      id: 'TRF-002',
      studentId: 'NEW',
      studentName: 'ชลธาร มีสุข',
      currentClass: '—',
      transferType: 'ย้ายเข้า',
      targetSchool: 'โรงเรียนอุดมศึกษา',
      reason: 'ผู้ปกครองย้ายภูมิลำเนา',
      status: 'รอดำเนินการ',
      requestedAt: '6 มี.ค. 2568',
      completedAt: '',
      handledBy: '',
    },
  ])

  return { registrations, transfers }
}
