import { ref } from 'vue'

export interface StudentRow {
  id: string
  name: string
  class: string
  advisor: string
  gpa: string
  discipline: number
  status: string
}

export function useStudentsData() {
  const rows = ref<StudentRow[]>([
    { id: '66100001', name: 'เด็กชายธนวัฒน์ สุขสันต์', class: 'ม.1/1', advisor: 'นางมาลี ดอกไม้', gpa: '3.50', discipline: 95, status: 'ปกติ' },
    { id: '66100002', name: 'เด็กหญิงนภาพร ใจงาม', class: 'ม.1/1', advisor: 'นางมาลี ดอกไม้', gpa: '3.80', discipline: 100, status: 'ปกติ' },
    { id: '66100003', name: 'เด็กชายพลวัต เข้มแข็ง', class: 'ม.2/2', advisor: 'นายวิชัย รักเรียน', gpa: '2.90', discipline: 88, status: 'ปกติ' },
    { id: '66100004', name: 'เด็กหญิงสุภาวดี หอมหวาน', class: 'ม.3/1', advisor: 'นางสาวสมหมาย ใจดี', gpa: '3.20', discipline: 92, status: 'ปกติ' },
    { id: '66100005', name: 'นายก้องภพ ท้องฟ้า', class: 'ม.4/1', advisor: 'นางสาวพรทิพย์ สุขใจ', gpa: '2.50', discipline: 75, status: 'ปกติ' },
    { id: '66100006', name: 'นางสาวชลิตา สดใส', class: 'ม.4/1', advisor: 'นางสาวพรทิพย์ สุขใจ', gpa: '3.90', discipline: 98, status: 'ปกติ' },
    { id: '66100007', name: 'นายอภิชาต โชคดี', class: 'ม.5/2', advisor: 'นายประสิทธิ์ เกษตรกร', gpa: '2.10', discipline: 65, status: 'รออนุมัติ' },
    { id: '66100008', name: 'นางสาวพิมพ์ใจ งามดี', class: 'ม.6/1', advisor: 'นายธีระ มั่นคง', gpa: '3.70', discipline: 97, status: 'ปกติ' },
    { id: '66100009', name: 'นายเจษฎา บึกบึน', class: 'ม.6/1', advisor: 'นายธีระ มั่นคง', gpa: '1.80', discipline: 60, status: 'ปกติ' },
    { id: '66100010', name: 'นางสาวกานดา รุ่งเรือง', class: 'ม.2/2', advisor: 'นายวิชัย รักเรียน', gpa: '3.40', discipline: 90, status: 'ย้ายออก' },
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
