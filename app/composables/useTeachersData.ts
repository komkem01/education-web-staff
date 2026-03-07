import { ref } from 'vue'

export interface EducationRecord {
  degree: string
  major: string
  institution: string
  year: string
  gpa: string
}

export interface WorkRecord {
  position: string
  organization: string
  startYear: string
  endYear: string
  note: string
}

export interface TeacherRow {
  id: string
  prefix: string
  firstName: string
  lastName: string
  email: string
  phone: string
  subjectGroup: string
  position: string
  advisorClass: string
  courses: number
  joinDate: string
  status: 'อนุมัติแล้ว' | 'รออนุมัติ' | 'ระงับ'
  education: EducationRecord[]
  workHistory: WorkRecord[]
}

export function useTeachersData() {
  const rows = ref<TeacherRow[]>([
    {
      id: 'T001', prefix: 'นางสาว', firstName: 'สมหมาย', lastName: 'ใจดี', email: 'sommai@school.ac.th', phone: '081-111-0001',
      subjectGroup: 'คณิตศาสตร์', position: 'ครูชำนาญการ', advisorClass: 'ม.3/1', courses: 3, joinDate: '1 มิ.ย. 2561', status: 'อนุมัติแล้ว',
      education: [
        { degree: 'ปริญญาตรี', major: 'คณิตศาสตร์ศึกษา', institution: 'มหาวิทยาลัยเกษตรศาสตร์', year: '2556', gpa: '3.55' },
        { degree: 'ปริญญาโท', major: 'หลักสูตรและการสอน', institution: 'จุฬาลงกรณ์มหาวิทยาลัย', year: '2560', gpa: '3.70' },
      ],
      workHistory: [
        { position: 'ครูผู้สอน', organization: 'โรงเรียนสาธิตมหาวิทยาลัยเกษตรศาสตร์', startYear: '2557', endYear: '2561', note: '' },
        { position: 'ครูชำนาญการ', organization: 'โรงเรียนปัจจุบัน', startYear: '2561', endYear: 'ปัจจุบัน', note: '' },
      ],
    },
    {
      id: 'T002', prefix: 'นาย', firstName: 'วิชัย', lastName: 'รักเรียน', email: 'wichai@school.ac.th', phone: '081-111-0002',
      subjectGroup: 'ภาษาไทย', position: 'ครูชำนาญการพิเศษ', advisorClass: 'ม.2/2', courses: 4, joinDate: '1 พ.ค. 2558', status: 'อนุมัติแล้ว',
      education: [
        { degree: 'ปริญญาตรี', major: 'การสอนภาษาไทย', institution: 'มหาวิทยาลัยศรีนครินทรวิโรฒ', year: '2550', gpa: '3.80' },
        { degree: 'ปริญญาโท', major: 'ภาษาไทย', institution: 'มหาวิทยาลัยศรีนครินทรวิโรฒ', year: '2554', gpa: '3.90' },
      ],
      workHistory: [
        { position: 'ครูผู้สอน', organization: 'โรงเรียนมัธยมวัดสิงห์', startYear: '2551', endYear: '2558', note: '' },
        { position: 'ครูชำนาญการพิเศษ', organization: 'โรงเรียนปัจจุบัน', startYear: '2558', endYear: 'ปัจจุบัน', note: '' },
      ],
    },
    {
      id: 'T003', prefix: 'นาง', firstName: 'มาลี', lastName: 'ดอกไม้', email: 'malee@school.ac.th', phone: '081-111-0003',
      subjectGroup: 'วิทยาศาสตร์', position: 'ครูชำนาญการ', advisorClass: 'ม.1/1', courses: 2, joinDate: '1 พ.ค. 2562', status: 'อนุมัติแล้ว',
      education: [
        { degree: 'ปริญญาตรี', major: 'ชีววิทยา', institution: 'มหาวิทยาลัยมหิดล', year: '2558', gpa: '3.40' },
      ],
      workHistory: [
        { position: 'ครูผู้สอน', organization: 'โรงเรียนปัจจุบัน', startYear: '2562', endYear: 'ปัจจุบัน', note: '' },
      ],
    },
    {
      id: 'T004', prefix: 'นาย', firstName: 'สมศักดิ์', lastName: 'บุญมา', email: 'somsak@school.ac.th', phone: '081-111-0004',
      subjectGroup: 'สังคมศึกษา', position: 'ครู', advisorClass: '', courses: 3, joinDate: '1 มิ.ย. 2566', status: 'อนุมัติแล้ว',
      education: [
        { degree: 'ปริญญาตรี', major: 'สังคมศึกษา', institution: 'มหาวิทยาลัยธรรมศาสตร์', year: '2562', gpa: '3.20' },
      ],
      workHistory: [
        { position: 'ครูผู้สอน', organization: 'โรงเรียนปัจจุบัน', startYear: '2566', endYear: 'ปัจจุบัน', note: '' },
      ],
    },
    {
      id: 'T005', prefix: 'นางสาว', firstName: 'พรทิพย์', lastName: 'สุขใจ', email: 'porntip@school.ac.th', phone: '081-111-0005',
      subjectGroup: 'ภาษาต่างประเทศ', position: 'ครูผู้ช่วย', advisorClass: 'ม.4/1', courses: 5, joinDate: '15 พ.ค. 2567', status: 'รออนุมัติ',
      education: [
        { degree: 'ปริญญาตรี', major: 'ภาษาอังกฤษ', institution: 'มหาวิทยาลัยรามคำแหง', year: '2565', gpa: '3.60' },
      ],
      workHistory: [],
    },
    {
      id: 'T006', prefix: 'นาย', firstName: 'ประสิทธิ์', lastName: 'เกษตรกร', email: 'prasit@school.ac.th', phone: '081-111-0006',
      subjectGroup: 'สุขศึกษาและพลศึกษา', position: 'ครูชำนาญการ', advisorClass: 'ม.5/2', courses: 2, joinDate: '1 พ.ค. 2560', status: 'อนุมัติแล้ว',
      education: [
        { degree: 'ปริญญาตรี', major: 'พลศึกษา', institution: 'มหาวิทยาลัยเกษตรศาสตร์', year: '2556', gpa: '3.10' },
      ],
      workHistory: [
        { position: 'ครูผู้สอน', organization: 'โรงเรียนปัจจุบัน', startYear: '2560', endYear: 'ปัจจุบัน', note: '' },
      ],
    },
    {
      id: 'T007', prefix: 'นาง', firstName: 'จันทร์', lastName: 'กลมกลิ้ง', email: 'jan@school.ac.th', phone: '081-111-0007',
      subjectGroup: 'ศิลปะ', position: 'ครูชำนาญการ', advisorClass: '', courses: 4, joinDate: '1 มิ.ย. 2559', status: 'อนุมัติแล้ว',
      education: [
        { degree: 'ปริญญาตรี', major: 'ศิลปศึกษา', institution: 'มหาวิทยาลัยศิลปากร', year: '2554', gpa: '3.65' },
      ],
      workHistory: [
        { position: 'ครูผู้สอน', organization: 'โรงเรียนปัจจุบัน', startYear: '2559', endYear: 'ปัจจุบัน', note: '' },
      ],
    },
    {
      id: 'T008', prefix: 'นาย', firstName: 'ธีระ', lastName: 'มั่นคง', email: 'theera@school.ac.th', phone: '081-111-0008',
      subjectGroup: 'คณิตศาสตร์', position: 'ครูชำนาญการพิเศษ', advisorClass: 'ม.6/1', courses: 3, joinDate: '1 พ.ค. 2556', status: 'อนุมัติแล้ว',
      education: [
        { degree: 'ปริญญาตรี', major: 'คณิตศาสตร์', institution: 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง', year: '2550', gpa: '3.75' },
        { degree: 'ปริญญาโท', major: 'คณิตศาสตร์ประยุกต์', institution: 'จุฬาลงกรณ์มหาวิทยาลัย', year: '2553', gpa: '3.85' },
      ],
      workHistory: [
        { position: 'นักวิจัย', organization: 'ศูนย์วิจัยคณิตศาสตร์แห่งชาติ', startYear: '2554', endYear: '2556', note: '' },
        { position: 'ครูชำนาญการพิเศษ', organization: 'โรงเรียนปัจจุบัน', startYear: '2556', endYear: 'ปัจจุบัน', note: '' },
      ],
    },
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
