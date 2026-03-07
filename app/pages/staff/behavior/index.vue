<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :rows="4" :cols="5" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">พฤติกรรมนักเรียน</h2>
          <p class="page-desc">บันทึกคะแนนความประพฤตินักเรียน แก้ไขได้เฉพาะรายการที่คุณบันทึก</p>
        </div>
        <button type="button" class="btn btn-primary" @click="openAdd">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          บันทึกพฤติกรรม
        </button>
      </div>

      <div class="filter-row">
        <div class="search-wrap">
          <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9ca3af" stroke-width="1.4"/><path d="M10 10l3 3" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/></svg>
          <input v-model="search" class="input search" type="text" placeholder="ค้นหาชื่อนักเรียน..." autocomplete="off" />
        </div>
        <select v-model="filterType" class="input sel">
          <option value="">ทุกประเภท</option>
          <option>ตัดคะแนน</option>
          <option>เพิ่มคะแนน</option>
        </select>
        <label class="toggle-label">
          <input v-model="showMine" type="checkbox" class="toggle-input" />
          <span class="toggle-track"><span class="toggle-thumb" /></span>
          <span>เฉพาะของฉัน</span>
        </label>
        <button v-if="search || filterType" type="button" class="btn btn-clear" @click="clearFilters">ล้างตัวกรอง</button>
      </div>

      <StaffDataTable title="รายการพฤติกรรม" :columns="cols" :rows="filteredRows">
        <template #cell-type="{ value }">
          <span :class="value === 'ตัดคะแนน' ? 'type-neg' : 'type-pos'">{{ value }}</span>
        </template>
        <template #cell-points="{ value, row }">
          <span :class="(row as unknown as BehaviorRow).type === 'ตัดคะแนน' ? 'pts-neg' : 'pts-pos'">
            {{ (row as unknown as BehaviorRow).type === 'ตัดคะแนน' ? '-' : '+' }}{{ value }}
          </span>
        </template>
        <template #rowActions="{ row }">
          <div class="action-btns">
            <template v-if="(row as unknown as BehaviorRow).recordedBy === ME">
              <button type="button" class="btn btn-sm btn-edit" @click="openEdit(row as unknown as BehaviorRow)">แก้ไข</button>
              <button type="button" class="btn btn-sm btn-delete" @click="openDelete(row as unknown as BehaviorRow)">ลบ</button>
            </template>
            <span v-else class="mine-note">{{ (row as unknown as BehaviorRow).recordedBy }}</span>
          </div>
        </template>
      </StaffDataTable>

      <!-- Add / Edit -->
      <StaffAppModal
        v-model="showModal"
        :title="editTarget ? 'แก้ไขรายการพฤติกรรม' : 'บันทึกพฤติกรรมนักเรียน'"
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
            <span>ชั้น/ห้อง</span>
            <input v-model="form.class" class="input" type="text" placeholder="ม.3/1" :disabled="!!editTarget" />
          </label>
          <label class="field">
            <span>วันที่</span>
            <input v-model="form.date" class="input" type="date" />
          </label>
          <label class="field">
            <span>ประเภท <span class="req">*</span></span>
            <select v-model="form.type" class="input">
              <option>ตัดคะแนน</option>
              <option>เพิ่มคะแนน</option>
            </select>
          </label>
          <label class="field">
            <span>คะแนน <span class="req">*</span></span>
            <input v-model.number="form.points" class="input" type="number" min="1" max="100" placeholder="1–100" />
          </label>
          <label class="field field-full">
            <span>เหตุผล / รายละเอียด <span class="req">*</span></span>
            <input v-model="form.note" class="input" type="text" placeholder="ระบุเหตุผล..." />
          </label>
        </div>
      </StaffAppModal>

      <!-- Confirm Delete -->
      <StaffAppConfirmModal
        v-model="showDeleteConfirm"
        title="ลบรายการพฤติกรรม"
        :message="`ต้องการลบรายการพฤติกรรมของ ${deleteTarget?.studentName} ใช่หรือไม่?`"
        confirm-label="ลบ"
        confirm-variant="danger"
        @confirm="doDelete"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBehaviorData, type BehaviorRow } from '~/composables/useBehaviorData'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()
const { rows } = useBehaviorData()

const ME = 'ครูสมหมาย ใจดี'

const search = ref('')
const filterType = ref('')
const showMine = ref(false)
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const editTarget = ref<BehaviorRow | null>(null)
const deleteTarget = ref<BehaviorRow | null>(null)
const form = ref({ studentId: '', studentName: '', class: '', date: '', type: 'ตัดคะแนน', points: 5, note: '' })

const cols = [
  { key: 'date', label: 'วันที่' },
  { key: 'studentId', label: 'เลขประจำตัว' },
  { key: 'studentName', label: 'นักเรียน' },
  { key: 'class', label: 'ชั้น/ห้อง' },
  { key: 'type', label: 'ประเภท' },
  { key: 'points', label: 'คะแนน' },
  { key: 'note', label: 'เหตุผล' },
  { key: 'recordedBy', label: 'บันทึกโดย' },
]

const filteredRows = computed(() =>
  rows.value.filter((r: BehaviorRow) => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || r.studentName.toLowerCase().includes(q) || r.studentId.includes(q)
    const matchType = !filterType.value || r.type === filterType.value
    const matchMine = !showMine.value || r.recordedBy === ME
    return matchSearch && matchType && matchMine
  })
)

function openAdd() {
  editTarget.value = null
  const today = new Date().toISOString().split('T')[0]
  form.value = { studentId: '', studentName: '', class: '', date: today, type: 'ตัดคะแนน', points: 5, note: '' }
  showModal.value = true
}
function openEdit(row: BehaviorRow) {
  editTarget.value = row
  form.value = { studentId: row.studentId, studentName: row.studentName, class: row.class, date: row.date, type: row.type, points: row.points, note: row.note }
  showModal.value = true
}
function openDelete(row: BehaviorRow) { deleteTarget.value = row; showDeleteConfirm.value = true }

function saveRow() {
  if (editTarget.value) {
    const idx = rows.value.indexOf(editTarget.value)
    if (idx >= 0) rows.value[idx] = { ...rows.value[idx], type: form.value.type, points: form.value.points, note: form.value.note, date: form.value.date }
  } else {
    rows.value.unshift({ id: `B${Date.now()}`, ...form.value, recordedBy: ME })
  }
  showModal.value = false
}
function doDelete() {
  if (!deleteTarget.value) return
  const idx = rows.value.indexOf(deleteTarget.value)
  if (idx >= 0) rows.value.splice(idx, 1)
  showDeleteConfirm.value = false
}
function clearFilters() { search.value = ''; filterType.value = '' }
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
.sel { width: auto; min-width: 130px; flex: none; }
.toggle-label { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.875rem; color: #374151; white-space: nowrap; }
.toggle-input { display: none; }
.toggle-track { width: 34px; height: 18px; border-radius: 999px; background: #d1d5db; position: relative; transition: background 0.15s; flex-shrink: 0; }
.toggle-input:checked ~ .toggle-track { background: #1d4ed8; }
.toggle-thumb { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: left 0.15s; }
.toggle-input:checked ~ .toggle-track .toggle-thumb { left: 18px; }
.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 7px; padding: 7px 14px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: background 0.12s; white-space: nowrap; }
.btn-primary { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
.btn-primary:hover { background: #1e40af; }
.btn-clear { background: #fff; color: #6b7280; border-color: #e5e7eb; }
.btn-clear:hover { background: #f9fafb; }
.btn-sm { padding: 5px 10px; font-size: 0.8rem; }
.btn-edit { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.btn-edit:hover { background: #dbeafe; }
.btn-delete { background: #fff5f5; color: #dc2626; border-color: #fecaca; }
.btn-delete:hover { background: #fee2e2; }
.action-btns { display: flex; gap: 6px; align-items: center; justify-content: flex-end; flex-wrap: nowrap; }
.mine-note { font-size: 0.75rem; color: #9ca3af; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 5px; font-size: 0.875rem; font-weight: 500; color: #374151; }
.field-full { grid-column: 1 / -1; }
.req { color: #ef4444; }
.type-neg { color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; border-radius: 999px; padding: 2px 8px; font-size: 0.75rem; font-weight: 600; }
.type-pos { color: #16a34a; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 999px; padding: 2px 8px; font-size: 0.75rem; font-weight: 600; }
.pts-neg { color: #dc2626; font-weight: 700; }
.pts-pos { color: #16a34a; font-weight: 700; }
</style>
