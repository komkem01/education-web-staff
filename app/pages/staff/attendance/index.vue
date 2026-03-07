<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :rows="5" :cols="6" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">บันทึกการเข้าเรียน</h2>
          <p class="page-desc">บันทึกและตรวจสอบการเข้าเรียนในคาบที่คุณสอน</p>
        </div>
        <button type="button" class="btn btn-primary" @click="openAdd">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          บันทึกการเข้าเรียน
        </button>
      </div>

      <div class="filter-row">
        <div class="search-wrap">
          <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9ca3af" stroke-width="1.4"/><path d="M10 10l3 3" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/></svg>
          <input v-model="search" class="input search" type="text" placeholder="ค้นหาชื่อนักเรียน..." autocomplete="off" />
        </div>
        <input v-model="filterDate" class="input" type="date" style="width: auto; min-width: 160px;" />
        <select v-model="filterStatus" class="input sel">
          <option value="">ทุกสถานะ</option>
          <option>มาเรียน</option>
          <option>ขาดเรียน</option>
          <option>ลาป่วย</option>
          <option>มาสาย</option>
        </select>
        <select v-model="filterCourse" class="input sel">
          <option value="">ทุกวิชา</option>
          <option>คณิตศาสตร์พื้นฐาน ม.3</option>
          <option>แคลคูลัส ม.6</option>
          <option>คณิตศาสตร์ ม.2/1</option>
        </select>
        <button v-if="search || filterDate || filterStatus || filterCourse" type="button" class="btn btn-clear" @click="clearFilters">ล้างตัวกรอง</button>
      </div>

      <!-- Summary badges -->
      <div class="summary-row">
        <div class="summary-badge present"><span class="dot" />มาเรียน <strong>{{ statusCount('มาเรียน') }}</strong></div>
        <div class="summary-badge absent"><span class="dot" />ขาดเรียน <strong>{{ statusCount('ขาดเรียน') }}</strong></div>
        <div class="summary-badge sick"><span class="dot" />ลาป่วย <strong>{{ statusCount('ลาป่วย') }}</strong></div>
        <div class="summary-badge late"><span class="dot" />มาสาย <strong>{{ statusCount('มาสาย') }}</strong></div>
      </div>

      <StaffDataTable title="บันทึกการเข้าเรียน" :columns="cols" :rows="filteredRows">
        <template #cell-status="{ value }">
          <StaffStatusBadge :label="value as string" />
        </template>
        <template #rowActions="{ row }">
          <div class="action-btns">
            <button type="button" class="btn btn-sm btn-edit" @click="openEdit(row as unknown as AttendanceRow)">แก้ไข</button>
          </div>
        </template>
      </StaffDataTable>

      <!-- Add / Edit Modal -->
      <StaffAppModal
        v-model="showModal"
        :title="editTarget ? 'แก้ไขการเข้าเรียน' : 'บันทึกการเข้าเรียน'"
        size="md"
        confirm-label="บันทึก"
        @confirm="saveRow"
      >
        <div class="form-grid">
          <label class="field">
            <span>วันที่ <span class="req">*</span></span>
            <input v-model="form.date" class="input" type="date" />
          </label>
          <label class="field">
            <span>คาบ/วิชา <span class="req">*</span></span>
            <select v-model="form.course" class="input">
              <option>คณิตศาสตร์พื้นฐาน ม.3</option>
              <option>แคลคูลัส ม.6</option>
              <option>คณิตศาสตร์ ม.2/1</option>
            </select>
          </label>
          <label class="field">
            <span>เลขประจำตัวนักเรียน <span class="req">*</span></span>
            <input v-model="form.studentId" class="input" type="text" placeholder="66100001" :disabled="!!editTarget" />
          </label>
          <label class="field">
            <span>ชื่อ-นามสกุล</span>
            <input v-model="form.studentName" class="input" type="text" placeholder="ชื่อนักเรียน" :disabled="!!editTarget" />
          </label>
          <label class="field">
            <span>ชั้น/ห้อง</span>
            <input v-model="form.class" class="input" type="text" placeholder="ม.3/1" :disabled="!!editTarget" />
          </label>
          <label class="field">
            <span>สถานะ <span class="req">*</span></span>
            <select v-model="form.status" class="input">
              <option>มาเรียน</option>
              <option>ขาดเรียน</option>
              <option>ลาป่วย</option>
              <option>มาสาย</option>
            </select>
          </label>
          <label class="field field-full">
            <span>หมายเหตุ</span>
            <input v-model="form.note" class="input" type="text" placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)" />
          </label>
        </div>
      </StaffAppModal>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAttendanceData, type AttendanceRow } from '~/composables/useAttendanceData'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()
const { rows } = useAttendanceData()

const search = ref('')
const filterDate = ref('')
const filterStatus = ref('')
const filterCourse = ref('')
const showModal = ref(false)
const editTarget = ref<AttendanceRow | null>(null)
const form = ref({ date: '', course: 'คณิตศาสตร์พื้นฐาน ม.3', studentId: '', studentName: '', class: '', status: 'มาเรียน', note: '' })

const cols = [
  { key: 'date', label: 'วันที่' },
  { key: 'course', label: 'วิชา' },
  { key: 'studentId', label: 'เลขประจำตัว' },
  { key: 'studentName', label: 'นักเรียน' },
  { key: 'class', label: 'ชั้น/ห้อง' },
  { key: 'status', label: 'สถานะ' },
  { key: 'note', label: 'หมายเหตุ' },
]

const filteredRows = computed(() =>
  rows.value.filter((r: AttendanceRow) => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || r.studentName.toLowerCase().includes(q) || r.studentId.includes(q)
    const matchDate = !filterDate.value || r.date === filterDate.value
    const matchStatus = !filterStatus.value || r.status === filterStatus.value
    const matchCourse = !filterCourse.value || r.course === filterCourse.value
    return matchSearch && matchDate && matchStatus && matchCourse
  })
)

function statusCount(s: string) {
  return filteredRows.value.filter((r: AttendanceRow) => r.status === s).length
}

function openAdd() {
  editTarget.value = null
  const today = new Date().toISOString().split('T')[0]
  form.value = { date: today, course: 'คณิตศาสตร์พื้นฐาน ม.3', studentId: '', studentName: '', class: '', status: 'มาเรียน', note: '' }
  showModal.value = true
}

function openEdit(row: AttendanceRow) {
  editTarget.value = row
  form.value = { date: row.date, course: row.course, studentId: row.studentId, studentName: row.studentName, class: row.class, status: row.status, note: row.note }
  showModal.value = true
}

function saveRow() {
  if (editTarget.value) {
    const idx = rows.value.findIndex(r => r.studentId === editTarget.value!.studentId && r.date === editTarget.value!.date && r.course === editTarget.value!.course)
    if (idx >= 0) {
      rows.value[idx] = { ...rows.value[idx], ...form.value }
    }
  } else {
    rows.value.unshift({ ...form.value })
  }
  showModal.value = false
}

function clearFilters() {
  search.value = ''
  filterDate.value = ''
  filterStatus.value = ''
  filterCourse.value = ''
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 0; }
.page-header { margin-bottom: 24px; display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.page-title { font-size: 1.3rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
.page-desc { font-size: 0.875rem; color: #6b7280; margin: 0; }
.filter-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); }
.input { width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; font-family: inherit; color: #111827; background: #fff; outline: none; transition: border-color 0.15s; }
.input:focus { border-color: #1d4ed8; }
.input:disabled { background: #f9fafb; color: #9ca3af; }
.search { padding-left: 34px; }
.sel { width: auto; min-width: 140px; flex: none; }
.summary-row { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.summary-badge { display: inline-flex; align-items: center; gap: 7px; padding: 6px 14px; border-radius: 999px; font-size: 0.8rem; font-weight: 500; }
.summary-badge .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.summary-badge.present { background: #f0fdf4; color: #15803d; }
.summary-badge.present .dot { background: #22c55e; }
.summary-badge.absent { background: #fef2f2; color: #b91c1c; }
.summary-badge.absent .dot { background: #ef4444; }
.summary-badge.sick { background: #fff7ed; color: #c2410c; }
.summary-badge.sick .dot { background: #f97316; }
.summary-badge.late { background: #fefce8; color: #a16207; }
.summary-badge.late .dot { background: #eab308; }
.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 7px; padding: 7px 14px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: background 0.12s; white-space: nowrap; }
.btn-primary { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
.btn-primary:hover { background: #1e40af; }
.btn-clear { background: #fff; color: #6b7280; border-color: #e5e7eb; }
.btn-clear:hover { background: #f9fafb; }
.btn-sm { padding: 5px 10px; font-size: 0.8rem; }
.btn-edit { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.btn-edit:hover { background: #dbeafe; }
.action-btns { display: flex; gap: 6px; justify-content: flex-end; flex-wrap: nowrap; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 5px; font-size: 0.875rem; font-weight: 500; color: #374151; }
.field-full { grid-column: 1 / -1; }
.req { color: #ef4444; }
</style>
