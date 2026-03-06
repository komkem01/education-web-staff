<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :rows="5" :cols="6" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">ผลการเรียน</h2>
          <p class="page-desc">บันทึกและตรวจสอบผลการเรียนในวิชาที่คุณรับผิดชอบ</p>
        </div>
        <button type="button" class="btn btn-primary" @click="openAdd">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          บันทึกคะแนน
        </button>
      </div>

      <div class="filter-row">
        <div class="search-wrap">
          <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9ca3af" stroke-width="1.4"/><path d="M10 10l3 3" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/></svg>
          <input v-model="search" class="input search" type="text" placeholder="ค้นหาชื่อนักเรียน..." autocomplete="off" />
        </div>
        <select v-model="filterCourse" class="input sel">
          <option value="">ทุกวิชา</option>
          <option>คณิตศาสตร์พื้นฐาน ม.3</option>
          <option>แคลคูลัส ม.6</option>
          <option>คณิตศาสตร์ ม.2/1</option>
        </select>
        <select v-model="filterGrade" class="input sel">
          <option value="">ทุกเกรด</option>
          <option value="fail">ติด 0/ร/มส</option>
          <option value="pass">ผ่าน</option>
        </select>
        <button v-if="search || filterCourse || filterGrade" type="button" class="btn btn-clear" @click="clearFilters">ล้างตัวกรอง</button>
      </div>

      <StaffDataTable title="บันทึกผลการเรียน" :columns="cols" :rows="filteredRows">
        <template #cell-grade="{ value }">
          <span :class="value === '0' ? 'grade-fail' : 'grade-ok'">{{ value }}</span>
        </template>
        <template #rowActions="{ row }">
          <div class="action-btns">
            <button type="button" class="btn btn-sm btn-edit" @click="openEdit(row as unknown as GradeRow)">แก้ไขคะแนน</button>
          </div>
        </template>
      </StaffDataTable>

      <!-- Add / Edit Modal -->
      <StaffAppModal
        v-model="showModal"
        :title="editTarget ? 'แก้ไขคะแนน' : 'บันทึกคะแนน'"
        size="md"
        confirm-label="บันทึก"
        @confirm="saveRow"
      >
        <div class="form-grid">
          <label class="field">
            <span>เลขประจำตัวนักเรียน <span class="req">*</span></span>
            <input v-model="form.studentId" class="input" type="text" placeholder="66100001" :disabled="!!editTarget" />
          </label>
          <label class="field">
            <span>ชื่อ-นามสกุล <span class="req">*</span></span>
            <input v-model="form.studentName" class="input" type="text" placeholder="ชื่อนักเรียน" :disabled="!!editTarget" />
          </label>
          <label class="field">
            <span>วิชา</span>
            <select v-model="form.course" class="input">
              <option>คณิตศาสตร์พื้นฐาน ม.3</option>
              <option>แคลคูลัส ม.6</option>
              <option>คณิตศาสตร์ ม.2/1</option>
            </select>
          </label>
          <label class="field">
            <span>ชั้น/ห้อง</span>
            <input v-model="form.class" class="input" type="text" placeholder="ม.3/1" />
          </label>
          <label class="field">
            <span>คะแนนกลางภาค (50 คะแนน)</span>
            <input v-model.number="form.midterm" class="input" type="number" min="0" max="50" placeholder="0–50" />
          </label>
          <label class="field">
            <span>คะแนนปลายภาค (50 คะแนน)</span>
            <input v-model.number="form.final" class="input" type="number" min="0" max="50" placeholder="0–50" />
          </label>
        </div>
        <div class="score-preview" v-if="form.midterm !== null && form.final !== null">
          <span>คะแนนรวม: <strong>{{ form.midterm + form.final }}</strong></span>
          <span>เกรด: <strong :class="getGradePreview(form.midterm + form.final) === '0' ? 'grade-fail' : 'grade-ok'">{{ getGradePreview(form.midterm + form.final) }}</strong></span>
        </div>
      </StaffAppModal>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGradesData, getGrade, type GradeRow } from '~/composables/useGradesData'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()
const { rows } = useGradesData()

const search = ref('')
const filterCourse = ref('')
const filterGrade = ref('')
const showModal = ref(false)
const editTarget = ref<GradeRow | null>(null)
const form = ref({ studentId: '', studentName: '', class: '', course: 'คณิตศาสตร์พื้นฐาน ม.3', midterm: 0, final: 0 })

const cols = [
  { key: 'studentId', label: 'เลขประจำตัว' },
  { key: 'studentName', label: 'นักเรียน' },
  { key: 'class', label: 'ชั้น/ห้อง' },
  { key: 'course', label: 'วิชา' },
  { key: 'midterm', label: 'กลางภาค' },
  { key: 'final', label: 'ปลายภาค' },
  { key: 'total', label: 'รวม' },
  { key: 'grade', label: 'เกรด' },
]

const filteredRows = computed(() =>
  rows.value.filter((r: GradeRow) => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || r.studentName.toLowerCase().includes(q) || r.studentId.includes(q)
    const matchCourse = !filterCourse.value || r.course === filterCourse.value
    const matchGrade = !filterGrade.value || (filterGrade.value === 'fail' ? r.grade === '0' : r.grade !== '0')
    return matchSearch && matchCourse && matchGrade
  })
)

function getGradePreview(total: number) {
  return getGrade(total)
}

function openAdd() {
  editTarget.value = null
  form.value = { studentId: '', studentName: '', class: '', course: 'คณิตศาสตร์พื้นฐาน ม.3', midterm: 0, final: 0 }
  showModal.value = true
}

function openEdit(row: GradeRow) {
  editTarget.value = row
  form.value = { studentId: row.studentId, studentName: row.studentName, class: row.class, course: row.course, midterm: row.midterm, final: row.final }
  showModal.value = true
}

function saveRow() {
  const total = form.value.midterm + form.value.final
  if (editTarget.value) {
    const idx = rows.value.findIndex(r => r.studentId === editTarget.value!.studentId && r.course === editTarget.value!.course)
    if (idx >= 0) {
      rows.value[idx] = { ...rows.value[idx], midterm: form.value.midterm, final: form.value.final, total, grade: getGrade(total) }
    }
  } else {
    rows.value.push({
      studentId: form.value.studentId,
      studentName: form.value.studentName,
      class: form.value.class,
      course: form.value.course,
      midterm: form.value.midterm,
      final: form.value.final,
      total,
      grade: getGrade(total),
    })
  }
  showModal.value = false
}

function clearFilters() {
  search.value = ''
  filterCourse.value = ''
  filterGrade.value = ''
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 0; }
.page-header { margin-bottom: 24px; display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.page-title { font-size: 1.3rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
.page-desc { font-size: 0.875rem; color: #6b7280; margin: 0; }
.filter-row { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); }
.input { width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; font-family: inherit; color: #111827; background: #fff; outline: none; transition: border-color 0.15s; }
.input:focus { border-color: #1d4ed8; }
.input:disabled { background: #f9fafb; color: #9ca3af; }
.search { padding-left: 34px; }
.sel { width: auto; min-width: 160px; flex: none; }
.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 7px; padding: 7px 14px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: background 0.12s; white-space: nowrap; }
.btn-primary { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
.btn-primary:hover { background: #1e40af; }
.btn-clear { background: #fff; color: #6b7280; border-color: #e5e7eb; }
.btn-clear:hover { background: #f9fafb; }
.btn-sm { padding: 5px 10px; font-size: 0.8rem; }
.btn-edit { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.btn-edit:hover { background: #dbeafe; }
.action-btns { display: flex; gap: 6px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 5px; font-size: 0.875rem; font-weight: 500; color: #374151; }
.req { color: #ef4444; }
.score-preview { margin-top: 12px; padding: 10px 14px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0; display: flex; gap: 24px; font-size: 0.875rem; color: #374151; }
.score-preview strong { font-weight: 700; color: #111827; }
.grade-fail { color: #dc2626; font-weight: 700; }
.grade-ok { color: #16a34a; font-weight: 600; }
</style>
