import { ref } from 'vue'

export type RequestStatus = 'รอดำเนินการ' | 'อนุมัติแล้ว' | 'ปฏิเสธ' | 'ต้องการข้อมูลเพิ่มเติม'
export type RequestType =
  | 'ขอแก้ไขข้อมูลนักเรียน'
  | 'ขอแก้ไขข้อมูลส่วนตัว'
  | 'ขอเปิดรายวิชา'
  | 'ขอแก้ไขรายวิชา'
  | 'ขอเอกสารราชการ'
  | 'ขอใบรับรองการสอน'
  | 'ขอเบิกพัสดุ'
  | 'ขอเบิกงบประมาณ'
  | 'ลงทะเบียนครูใหม่'
  | 'ขอแก้ไขเกรด'
  | 'อื่นๆ'

export interface ApprovalInboxRow {
  id: string
  type: RequestType
  requesterName: string       // ชื่อครูที่ขอ
  requesterRole: 'ครู' | 'บุคลากร' | 'นักเรียน'
  description: string         // รายละเอียด
  attachments: string[]       // ไฟล์แนบ (ชื่อไฟล์)
  status: RequestStatus
  priority: 'ด่วนมาก' | 'ด่วน' | 'ปกติ'
  submittedAt: string
  resolvedAt: string
  resolvedBy: string
  remark: string              // หมายเหตุจากบุคลากร
}

export function useApprovalsInboxData() {
  const rows = ref<ApprovalInboxRow[]>([
    {
      id: 'REQ-001',
      type: 'ขอแก้ไขข้อมูลนักเรียน',
      requesterName: 'ครูสมหมาย ใจดี',
      requesterRole: 'ครู',
      description: 'ขอแก้ไขชื่อนักเรียน เลขประจำตัว 66100005 จาก "ประภัส แสงทอง" เป็น "ประภัสสร แสงทอง" เนื่องจากชื่อผิดพลาดจากการบันทึก',
      attachments: ['สำเนาทะเบียนบ้าน.pdf'],
      status: 'รอดำเนินการ',
      priority: 'ปกติ',
      submittedAt: '6 มี.ค. 2568',
      resolvedAt: '',
      resolvedBy: '',
      remark: '',
    },
    {
      id: 'REQ-002',
      type: 'ขอเบิกพัสดุ',
      requesterName: 'ครูวิมล สดใส',
      requesterRole: 'ครู',
      description: 'ขอเบิกกระดาษ A4 จำนวน 10 รีม และหมึกพิมพ์ Canon 2 ตลับ สำหรับใช้ในห้องเรียน ม.3/1',
      attachments: [],
      status: 'รอดำเนินการ',
      priority: 'ด่วน',
      submittedAt: '6 มี.ค. 2568',
      resolvedAt: '',
      resolvedBy: '',
      remark: '',
    },
    {
      id: 'REQ-003',
      type: 'ขอเปิดรายวิชา',
      requesterName: 'ครูสุชาติ เรียนดี',
      requesterRole: 'ครู',
      description: 'ขอเปิดรายวิชาเพิ่มเติม "โปรแกรมมิ่งเบื้องต้น" สำหรับนักเรียน ม.4 ภาคเรียนที่ 1/2568 จำนวน 40 ชั่วโมง',
      attachments: ['แผนการสอน.pdf', 'หลักสูตร.docx'],
      status: 'อนุมัติแล้ว',
      priority: 'ปกติ',
      submittedAt: '1 มี.ค. 2568',
      resolvedAt: '3 มี.ค. 2568',
      resolvedBy: 'นางสาวสมใจ รักงาน',
      remark: 'อนุมัติ เริ่มเปิดสอนได้ภาคเรียนที่ 1/2568',
    },
    {
      id: 'REQ-004',
      type: 'ขอเอกสารราชการ',
      requesterName: 'ครูอนุชา สว่างใจ',
      requesterRole: 'ครู',
      description: 'ขอเอกสารรับรองการปฏิบัติงาน เพื่อใช้ประกอบการยื่นขอวิทยฐานะ',
      attachments: [],
      status: 'ต้องการข้อมูลเพิ่มเติม',
      priority: 'ปกติ',
      submittedAt: '28 ก.พ. 2568',
      resolvedAt: '',
      resolvedBy: '',
      remark: 'กรุณาระบุปีการปฏิบัติงานที่ต้องการ และวัตถุประสงค์การใช้งานให้ชัดเจน',
    },
    {
      id: 'REQ-005',
      type: 'ขอแก้ไขเกรด',
      requesterName: 'ครูนภา แสนดี',
      requesterRole: 'ครู',
      description: 'ขอแก้ไขเกรดนักเรียน เลขประจำตัว 66100010 วิชาภาษาไทย 1 จาก "ร" เป็น "1.5" เนื่องจากนักเรียนส่งงานครบแล้ว',
      attachments: ['หลักฐานงาน.jpg'],
      status: 'ปฏิเสธ',
      priority: 'ด่วน',
      submittedAt: '25 ก.พ. 2568',
      resolvedAt: '27 ก.พ. 2568',
      resolvedBy: 'นางสาวสมใจ รักงาน',
      remark: 'ไม่สามารถแก้ไขหลังปิดเทอมแล้ว กรุณาติดต่อหัวหน้าฝ่ายวิชาการ',
    },
    {
      id: 'REQ-006',
      type: 'ลงทะเบียนครูใหม่',
      requesterName: 'ครูปิยะ มั่นคง',
      requesterRole: 'ครู',
      description: 'ขอลงทะเบียนเข้าระบบเพื่อใช้งาน Portal ครู ตำแหน่งครูผู้ช่วยวิชาวิทยาศาสตร์',
      attachments: ['บัตรประชาชน.pdf', 'วุฒิการศึกษา.pdf'],
      status: 'รอดำเนินการ',
      priority: 'ด่วนมาก',
      submittedAt: '7 มี.ค. 2568',
      resolvedAt: '',
      resolvedBy: '',
      remark: '',
    },
  ])

  return { rows }
}
