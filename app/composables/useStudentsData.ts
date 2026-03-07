import { ref } from 'vue'

export interface ParentInfo {
  relation: string
  name: string
  phone: string
  occupation: string
}

export interface AcademicRecord {
  year: string
  semester: string
  gpa: string
  note: string
}

export interface StudentRow {
  id: string
  name: string
  class: string
  advisor: string
  gpa: string
  discipline: number
  status: string
  parent: ParentInfo
  academicHistory: AcademicRecord[]
}

export function useStudentsData() {
  const rows = ref<StudentRow[]>([
    {
      id: '66100001', name: 'เด็กชายธนวัฒน์ สุขสันต์', class: 'ม.1/1', advisor: 'นางมาลี ดอกไม้', gpa: '3.50', discipline: 95, status: 'ปกติ',
      parent: { relation: 'บิดา', name: 'นายสมชาย สุขสันต์', phone: '081-111-0001', occupation: 'ค้าขาย' },
      academicHistory: [
        { year: '2566', semester: '1', gpa: '3.50', note: 'ผ่านเกณฑ์' },
        { year: '2565', semester: '2', gpa: '3.40', note: 'ผ่านเกณฑ์' },
        { year: '2565', semester: '1', gpa: '3.30', note: 'ผ่านเกณฑ์' },
      ],
    },
    {
      id: '66100002', name: 'เด็กหญิงนภาพร ใจงาม', class: 'ม.1/1', advisor: 'นางมาลี ดอกไม้', gpa: '3.80', discipline: 100, status: 'ปกติ',
      parent: { relation: 'มารดา', name: 'นางสมศรี ใจงาม', phone: '082-222-0002', occupation: 'ครู' },
      academicHistory: [
        { year: '2566', semester: '1', gpa: '3.80', note: 'เกียรตินิยม' },
        { year: '2565', semester: '2', gpa: '3.75', note: 'เกียรตินิยม' },
      ],
    },
    {
      id: '66100003', name: 'เด็กชายพลวัต เข้มแข็ง', class: 'ม.2/2', advisor: 'นายวิชัย รักเรียน', gpa: '2.90', discipline: 88, status: 'ปกติ',
      parent: { relation: 'บิดา', name: 'นายวีระ เข้มแข็ง', phone: '083-333-0003', occupation: 'เกษตรกร' },
      academicHistory: [
        { year: '2566', semester: '1', gpa: '2.90', note: 'ผ่านเกณฑ์' },
        { year: '2565', semester: '2', gpa: '2.80', note: 'ผ่านเกณฑ์' },
        { year: '2565', semester: '1', gpa: '2.70', note: 'ผ่านเกณฑ์' },
      ],
    },
    {
      id: '66100004', name: 'เด็กหญิงสุภาวดี หอมหวาน', class: 'ม.3/1', advisor: 'นางสาวสมหมาย ใจดี', gpa: '3.20', discipline: 92, status: 'ปกติ',
      parent: { relation: 'มารดา', name: 'นางวรรณา หอมหวาน', phone: '084-444-0004', occupation: 'พยาบาล' },
      academicHistory: [
        { year: '2566', semester: '1', gpa: '3.20', note: 'ผ่านเกณฑ์' },
        { year: '2565', semester: '2', gpa: '3.10', note: 'ผ่านเกณฑ์' },
      ],
    },
    {
      id: '66100005', name: 'นายก้องภพ ท้องฟ้า', class: 'ม.4/1', advisor: 'นางสาวพรทิพย์ สุขใจ', gpa: '2.50', discipline: 75, status: 'ปกติ',
      parent: { relation: 'บิดา', name: 'นายกิตติ ท้องฟ้า', phone: '085-555-0005', occupation: 'รับจ้าง' },
      academicHistory: [
        { year: '2566', semester: '1', gpa: '2.50', note: 'ต้องติดตาม' },
        { year: '2565', semester: '2', gpa: '2.40', note: 'ต้องติดตาม' },
        { year: '2565', semester: '1', gpa: '2.30', note: 'ต้องติดตาม' },
      ],
    },
    {
      id: '66100006', name: 'นางสาวชลิตา สดใส', class: 'ม.4/1', advisor: 'นางสาวพรทิพย์ สุขใจ', gpa: '3.90', discipline: 98, status: 'ปกติ',
      parent: { relation: 'มารดา', name: 'นางชลอ สดใส', phone: '086-666-0006', occupation: 'แพทย์' },
      academicHistory: [
        { year: '2566', semester: '1', gpa: '3.90', note: 'เกียรตินิยมอันดับ 1' },
        { year: '2565', semester: '2', gpa: '3.85', note: 'เกียรตินิยม' },
        { year: '2565', semester: '1', gpa: '3.80', note: 'เกียรตินิยม' },
      ],
    },
    {
      id: '66100007', name: 'นายอภิชาต โชคดี', class: 'ม.5/2', advisor: 'นายประสิทธิ์ เกษตรกร', gpa: '2.10', discipline: 65, status: 'ปกติ',
      parent: { relation: 'บิดา', name: 'นายอภิรัตน์ โชคดี', phone: '087-777-0007', occupation: 'ค้าขาย' },
      academicHistory: [
        { year: '2566', semester: '1', gpa: '2.10', note: 'ต้องปรับปรุง' },
        { year: '2565', semester: '2', gpa: '2.00', note: 'ต้องปรับปรุง' },
      ],
    },
    {
      id: '66100008', name: 'นางสาวพิมพ์ใจ งามดี', class: 'ม.6/1', advisor: 'นายธีระ มั่นคง', gpa: '3.70', discipline: 97, status: 'ปกติ',
      parent: { relation: 'มารดา', name: 'นางพิมพา งามดี', phone: '088-888-0008', occupation: 'ข้าราชการ' },
      academicHistory: [
        { year: '2566', semester: '1', gpa: '3.70', note: 'เกียรตินิยม' },
        { year: '2565', semester: '2', gpa: '3.65', note: 'เกียรตินิยม' },
        { year: '2565', semester: '1', gpa: '3.60', note: 'เกียรตินิยม' },
      ],
    },
    {
      id: '66100009', name: 'นายเจษฎา บึกบึน', class: 'ม.6/1', advisor: 'นายธีระ มั่นคง', gpa: '1.80', discipline: 60, status: 'ปกติ',
      parent: { relation: 'บิดา', name: 'นายเจริญ บึกบึน', phone: '089-999-0009', occupation: 'รับจ้าง' },
      academicHistory: [
        { year: '2566', semester: '1', gpa: '1.80', note: 'เสี่ยงตก' },
        { year: '2565', semester: '2', gpa: '1.90', note: 'เสี่ยงตก' },
      ],
    },
    {
      id: '66100010', name: 'นางสาวกานดา รุ่งเรือง', class: 'ม.2/2', advisor: 'นายวิชัย รักเรียน', gpa: '3.40', discipline: 90, status: 'ปกติ',
      parent: { relation: 'มารดา', name: 'นางกาญจนา รุ่งเรือง', phone: '090-000-0010', occupation: 'ช่างเสริมสวย' },
      academicHistory: [
        { year: '2566', semester: '1', gpa: '3.40', note: 'ผ่านเกณฑ์' },
        { year: '2565', semester: '2', gpa: '3.30', note: 'ผ่านเกณฑ์' },
      ],
    },
  ])

  function addRow(row: StudentRow) {
    rows.value.push(row)
  }

  function updateRow(id: string, data: Partial<StudentRow>) {
    const idx = rows.value.findIndex(r => r.id === id)
    if (idx !== -1) rows.value[idx] = { ...rows.value[idx], ...data }
  }

  function deleteRow(id: string) {
    rows.value = rows.value.filter(r => r.id !== id)
  }

  return { rows, addRow, updateRow, deleteRow }
}
