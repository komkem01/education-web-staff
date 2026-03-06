import { ref } from 'vue'

export interface TeacherRow {
  id: string
  prefix: string
  firstName: string
  lastName: string
  email: string
  phone: string
  subjectGroup: string        // กลุ่มสาระ
  position: string            // ตำแหน่ง
  advisorClass: string        // ครูที่ปรึกษาห้อง
  courses: number
  joinDate: string
  status: 'อนุมัติแล้ว' | 'รออนุมัติ' | 'ระงับ'
}

export function useTeachersData() {
  const rows = ref<TeacherRow[]>([
    { id: 'T001', prefix: 'นางสาว', firstName: 'สมหมาย', lastName: 'ใจดี', email: 'sommai@school.ac.th', phone: '081-111-0001', subjectGroup: 'คณิตศาสตร์', position: 'ครูชำนาญการ', advisorClass: 'ม.3/1', courses: 3, joinDate: '1 มิ.ย. 2561', status: 'อนุมัติแล้ว' },
    { id: 'T002', prefix: 'นาย', firstName: 'วิชัย', lastName: 'รักเรียน', email: 'wichai@school.ac.th', phone: '081-111-0002', subjectGroup: 'ภาษาไทย', position: 'ครูชำนาญการพิเศษ', advisorClass: 'ม.2/2', courses: 4, joinDate: '1 พ.ค. 2558', status: 'อนุมัติแล้ว' },
    { id: 'T003', prefix: 'นาง', firstName: 'มาลี', lastName: 'ดอกไม้', email: 'malee@school.ac.th', phone: '081-111-0003', subjectGroup: 'วิทยาศาสตร์', position: 'ครูชำนาญการ', advisorClass: 'ม.1/1', courses: 2, joinDate: '1 พ.ค. 2562', status: 'อนุมัติแล้ว' },
    { id: 'T004', prefix: 'นาย', firstName: 'สมศักดิ์', lastName: 'บุญมา', email: 'somsak@school.ac.th', phone: '081-111-0004', subjectGroup: 'สังคมศึกษา', position: 'ครู', advisorClass: '', courses: 3, joinDate: '1 มิ.ย. 2566', status: 'อนุมัติแล้ว' },
    { id: 'T005', prefix: 'นางสาว', firstName: 'พรทิพย์', lastName: 'สุขใจ', email: 'porntip@school.ac.th', phone: '081-111-0005', subjectGroup: 'ภาษาต่างประเทศ', position: 'ครูผู้ช่วย', advisorClass: 'ม.4/1', courses: 5, joinDate: '15 พ.ค. 2567', status: 'รออนุมัติ' },
    { id: 'T006', prefix: 'นาย', firstName: 'ประสิทธิ์', lastName: 'เกษตรกร', email: 'prasit@school.ac.th', phone: '081-111-0006', subjectGroup: 'สุขศึกษาและพลศึกษา', position: 'ครูชำนาญการ', advisorClass: 'ม.5/2', courses: 2, joinDate: '1 พ.ค. 2560', status: 'อนุมัติแล้ว' },
    { id: 'T007', prefix: 'นาง', firstName: 'จันทร์', lastName: 'กลมกลิ้ง', email: 'jan@school.ac.th', phone: '081-111-0007', subjectGroup: 'ศิลปะ', position: 'ครูชำนาญการ', advisorClass: '', courses: 4, joinDate: '1 มิ.ย. 2559', status: 'อนุมัติแล้ว' },
    { id: 'T008', prefix: 'นาย', firstName: 'ธีระ', lastName: 'มั่นคง', email: 'theera@school.ac.th', phone: '081-111-0008', subjectGroup: 'คณิตศาสตร์', position: 'ครูชำนาญการพิเศษ', advisorClass: 'ม.6/1', courses: 3, joinDate: '1 พ.ค. 2556', status: 'อนุมัติแล้ว' },
  ])

  function addRow(row: TeacherRow) {
    rows.value.push(row)
  }

  function updateRow(id: string, data: Partial<TeacherRow>) {
    const idx = rows.value.findIndex(r => r.id === id)
    if (idx !== -1) rows.value[idx] = { ...rows.value[idx], ...data }
  }

  function deleteRow(id: string) {
    rows.value = rows.value.filter(r => r.id !== id)
  }

  function approveRow(id: string) {
    updateRow(id, { status: 'อนุมัติแล้ว' })
  }

  return { rows, addRow, updateRow, deleteRow, approveRow }
}
