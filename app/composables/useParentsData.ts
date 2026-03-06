import { ref } from 'vue'

export interface ParentRow {
  id: string
  prefix: string
  firstName: string
  lastName: string
  phone: string
  email: string
  relation: string        // ความสัมพันธ์: บิดา, มารดา, ผู้ปกครอง
  studentName: string     // ชื่อนักเรียนที่ดูแล
  studentId: string
  studentClass: string
  address: string
  lineId: string
  status: 'ใช้งาน' | 'ระงับ'
}

export function useParentsData() {
  const rows = ref<ParentRow[]>([
    { id: 'P001', prefix: 'นาย', firstName: 'สมชาย', lastName: 'กล้าหาญ', phone: '081-111-2233', email: 'somchai@mail.com', relation: 'บิดา', studentName: 'สมศรี กล้าหาญ', studentId: '66100001', studentClass: 'ม.3/1', address: '12 ถ.สุขาภิบาล', lineId: 'somchai.k', status: 'ใช้งาน' },
    { id: 'P002', prefix: 'นาง', firstName: 'มาลี', lastName: 'สุขใส', phone: '086-222-3344', email: 'malee@mail.com', relation: 'มารดา', studentName: 'มานพ สุขใส', studentId: '66100002', studentClass: 'ม.3/1', address: '45 ถ.พหลโยธิน', lineId: 'malee.s', status: 'ใช้งาน' },
    { id: 'P003', prefix: 'นาย', firstName: 'วิชัย', lastName: 'ดีมาก', phone: '089-333-4455', email: '', relation: 'ผู้ปกครอง', studentName: 'วิไล ดีมาก', studentId: '66100003', studentClass: 'ม.4/2', address: '78 หมู่ 3', lineId: '', status: 'ใช้งาน' },
    { id: 'P004', prefix: 'นาง', firstName: 'รัตนา', lastName: 'พรมมา', phone: '082-444-5566', email: 'rattana@mail.com', relation: 'มารดา', studentName: 'รัตนพล พรมมา', studentId: '66100004', studentClass: 'ม.5/3', address: '9 ซ.สามัคคี', lineId: 'ratt.p', status: 'ใช้งาน' },
    { id: 'P005', prefix: 'นาย', firstName: 'ประยุทธ', lastName: 'แสงทอง', phone: '083-555-6677', email: '', relation: 'บิดา', studentName: 'ประภัสสร แสงทอง', studentId: '66100005', studentClass: 'ม.6/1', address: '33 ถ.รามคำแหง', lineId: '', status: 'ระงับ' },
    { id: 'P006', prefix: 'นาง', firstName: 'กนกวรรณ', lastName: 'ใจบุญ', phone: '084-666-7788', email: 'kanok@mail.com', relation: 'มารดา', studentName: 'กวิน ใจบุญ', studentId: '66100006', studentClass: 'ม.1/2', address: '56 ม.4 ต.บางรัก', lineId: 'kanok.jai', status: 'ใช้งาน' },
    { id: 'P007', prefix: 'นาย', firstName: 'ธนพัฒน์', lastName: 'ศิริมงคล', phone: '085-777-8899', email: '', relation: 'บิดา', studentName: 'ธนัชชา ศิริมงคล', studentId: '66100007', studentClass: 'ม.2/1', address: '11 ซ.นวมินทร์', lineId: 'tanaphat.s', status: 'ใช้งาน' },
    { id: 'P008', prefix: 'นาง', firstName: 'ศิริพร', lastName: 'เฮงซวย', phone: '087-888-9900', email: 'siriporn@mail.com', relation: 'มารดา', studentName: 'ศิวะ เฮงซวย', studentId: '66100008', studentClass: 'ม.3/2', address: '99 ถ.ลาดพร้าว', lineId: 'siri.p', status: 'ใช้งาน' },
  ])

  function addRow(row: ParentRow) { rows.value.push(row) }
  function updateRow(id: string, data: Partial<ParentRow>) {
    const idx = rows.value.findIndex(r => r.id === id)
    if (idx !== -1) rows.value[idx] = { ...rows.value[idx], ...data }
  }
  function deleteRow(id: string) { rows.value = rows.value.filter(r => r.id !== id) }

  return { rows, addRow, updateRow, deleteRow }
}
