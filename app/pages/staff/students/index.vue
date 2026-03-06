<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :rows="5" :cols="7" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">จัดการนักเรียน</h2>
          <p class="page-desc">จัดการข้อมูลนักเรียน อนุมัติการลงทะเบียน</p>
        </div>
        <button type="button" class="btn btn-primary" @click="openAdd">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          เพิ่มนักเรียนใหม่
        </button>
      </div>

      <div class="filter-row">
        <div class="search-wrap">
          <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9ca3af" stroke-width="1.4"/><path d="M10 10l3 3" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/></svg>
          <input v-model="search" class="input search" type="text" placeholder="ค้นหาชื่อ หรือ เลขประจำตัว..." autocomplete="off" />
        </div>
        <select v-model="filterClass" class="input sel">
          <option value="">ทุกระดับชั้น</option>
          <option>ม.1</option><option>ม.2</option><option>ม.3</option>
          <option>ม.4</option><option>ม.5</option><option>ม.6</option>
        </select>
        <select v-model="filterStatus" class="input sel">
          <option value="">ทุกสถานะ</option>
          <option>ปกติ</option><option>รออนุมัติ</option><option>ย้ายออก</option>
        </select>
        <button v-if="search || filterClass || filterStatus" type="button" class="btn btn-clear" @click="clearFilters">ล้างตัวกรอง</button>
      </div>

      <StaffDataTable title="รายชื่อนักเรียน" :columns="cols" :rows="filteredRows">
        <template #cell-status="{ value }">
          <StaffStatusBadge
            :label="value as string"
            :variant="value === 'ปกติ' ? 'approved' : value === 'รออนุมัติ' ? 'pending' : 'default'"
          />
        </template>
        <template #cell-discipline="{ value }">
          <span :class="Number(value) < 70 ? 'discipline-low' : 'discipline-ok'">{{ value }}</span>
        </template>
        <template #rowActions="{ row }">
          <div class="action-btns">
            <button type="button" class="btn btn-sm btn-detail" @click="navigateTo('/staff/students/' + (row as unknown as StudentRow).id)">รายละเอียด</button>
            <button type="button" class="btn btn-sm btn-edit" @click="openEdit(row as unknown as StudentRow)">แก้ไข</button>
            <button v-if="(row as unknown as StudentRow).status === 'รออนุมัติ'" type="button" class="btn btn-sm btn-approve" @click="approveStudent(row as unknown as StudentRow)">อนุมัติ</button>
            <button type="button" class="btn btn-sm btn-delete" @click="confirmDelete(row as unknown as StudentRow)">ลบ</button>
          </div>
        </template>
      </StaffDataTable>

      <!-- Detail Modal -->
      <StaffAppModal v-model="showDetail" title="ข้อมูลนักเรียน" size="md">
        <template #footer>
          <button type="button" class="btn btn-secondary" @click="showDetail = false">ปิด</button>
          <button type="button" class="btn btn-edit-footer" @click="switchToEdit">แก้ไขข้อมูล</button>
        </template>
        <div class="detail-body" v-if="detailRow">
          <div class="detail-row"><span class="detail-label">เลขประจำตัว</span><span class="id-badge">{{ detailRow.id }}</span></div>
          <div class="detail-row"><span class="detail-label">ชื่อ-นามสกุล</span><span class="detail-value">{{ detailRow.name }}</span></div>
          <div class="detail-row"><span class="detail-label">ชั้น/ห้อง</span><span class="detail-value">{{ detailRow.class }}</span></div>
          <div class="detail-row"><span class="detail-label">ครูที่ปรึกษา</span><span class="detail-value">{{ detailRow.advisor }}</span></div>
          <div class="detail-row"><span class="detail-label">GPA</span><span class="detail-value">{{ detailRow.gpa }}</span></div>
          <div class="detail-row"><span class="detail-label">คะแนนประพฤติ</span><span :class="detailRow.discipline < 70 ? 'discipline-low' : 'discipline-ok'">{{ detailRow.discipline }}</span></div>
          <div class="detail-row">
            <span class="detail-label">สถานะ</span>
            <StaffStatusBadge :label="detailRow.status" :variant="detailRow.status === 'ปกติ' ? 'approved' : detailRow.status === 'รออนุมัติ' ? 'pending' : 'default'" />
          </div>
        </div>
      </StaffAppModal>

      <!-- Add/Edit Modal -->
      <StaffAppModal v-model="showForm" :title="editRow ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มนักเรียนใหม่'" size="md">
        <template #footer>
          <button type="button" class="btn btn-secondary" @click="showForm = false">ยกเลิก</button>
          <button type="button" class="btn btn-primary" @click="saveForm">บันทึก</button>
        </template>
        <div class="form-body">
          <div class="form-row">
            <div class="form-group flex-2">
              <label class="form-label">ชื่อ-นามสกุล</label>
              <input v-model="form.name" class="input" type="text" placeholder="เด็กชาย/หญิงชื่อจริง นามสกุล" />
            </div>
            <div class="form-group">
              <label class="form-label">ชั้น/ห้อง</label>
              <input v-model="form.class" class="input" type="text" placeholder="ม.1/1" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group flex-2">
              <label class="form-label">ครูที่ปรึกษา</label>
              <input v-model="form.advisor" class="input" type="text" placeholder="ชื่อครูที่ปรึกษา" />
            </div>
            <div class="form-group">
              <label class="form-label">GPA</label>
              <input v-model="form.gpa" class="input" type="text" placeholder="3.50" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">คะแนนประพฤติ</label>
              <input v-model.number="form.discipline" class="input" type="number" min="0" max="100" placeholder="100" />
            </div>
            <div class="form-group">
              <label class="form-label">สถานะ</label>
              <select v-model="form.status" class="input">
                <option>ปกติ</option>
                <option>รออนุมัติ</option>
                <option>ย้ายออก</option>
              </select>
            </div>
          </div>
        </div>
      </StaffAppModal>

      <!-- Delete Confirm -->
      <StaffAppModal v-model="showDeleteConfirm" title="ยืนยันการลบ" size="sm">
        <template #footer>
          <button type="button" class="btn btn-secondary" @click="showDeleteConfirm = false">ยกเลิก</button>
          <button type="button" class="btn btn-danger" @click="doDelete">ลบ</button>
        </template>
        <p class="confirm-text">ต้องการลบข้อมูลนักเรียน <strong>{{ deleteTarget?.name }}</strong> ใช่หรือไม่?</p>
      </StaffAppModal>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useStudentsData, type StudentRow } from '~/composables/useStudentsData'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()
const { rows, addRow, updateRow, deleteRow } = useStudentsData()

const search = ref('')
const filterClass = ref('')
const filterStatus = ref('')
const showDetail = ref(false)
const showForm = ref(false)
const showDeleteConfirm = ref(false)
const detailRow = ref<StudentRow | null>(null)
const editRow = ref<StudentRow | null>(null)
const deleteTarget = ref<StudentRow | null>(null)

const defaultForm = () => ({ name: '', class: '', advisor: '', gpa: '0.00', discipline: 100, status: 'รออนุมัติ' })
const form = reactive(defaultForm())

const cols = [
  { key: 'id', label: 'เลขประจำตัว' },
  { key: 'name', label: 'ชื่อ-นามสกุล' },
  { key: 'class', label: 'ชั้น/ห้อง' },
  { key: 'advisor', label: 'ครูที่ปรึกษา' },
  { key: 'gpa', label: 'GPA' },
  { key: 'discipline', label: 'คะแนนประพฤติ' },
  { key: 'status', label: 'สถานะ' },
]

const filteredRows = computed(() =>
  rows.value.filter((r: StudentRow) => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.id.includes(q)
    const matchClass = !filterClass.value || r.class.startsWith(filterClass.value)
    const matchStatus = !filterStatus.value || r.status === filterStatus.value
    return matchSearch && matchClass && matchStatus
  })
)

function openDetail(row: StudentRow) { detailRow.value = row; showDetail.value = true }

function openAdd() {
  editRow.value = null
  Object.assign(form, defaultForm())
  showForm.value = true
}

function openEdit(row: StudentRow) {
  editRow.value = row
  Object.assign(form, { name: row.name, class: row.class, advisor: row.advisor, gpa: row.gpa, discipline: row.discipline, status: row.status })
  showForm.value = true
}

function switchToEdit() {
  if (detailRow.value) { showDetail.value = false; openEdit(detailRow.value) }
}

function saveForm() {
  if (editRow.value) {
    updateRow(editRow.value.id, { ...form })
  } else {
    addRow({ id: `67${Date.now().toString().slice(-6)}`, ...form })
  }
  showForm.value = false
}

function confirmDelete(row: StudentRow) { deleteTarget.value = row; showDeleteConfirm.value = true }

function doDelete() {
  if (deleteTarget.value) {
    deleteRow(deleteTarget.value.id)
    showDeleteConfirm.value = false
    deleteTarget.value = null
  }
}

function approveStudent(row: StudentRow) {
  updateRow(row.id, { status: 'ปกติ' })
}

function clearFilters() { search.value = ''; filterClass.value = ''; filterStatus.value = '' }
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
.search { padding-left: 34px; }
.sel { width: auto; min-width: 140px; flex: none; }
.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 7px; padding: 7px 14px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: background 0.12s; white-space: nowrap; }
.btn-clear { background: #fff; color: #6b7280; border-color: #e5e7eb; }
.btn-clear:hover { background: #f9fafb; }
.btn-sm { padding: 5px 10px; font-size: 0.8rem; }
.btn-detail { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-detail:hover { background: #f9fafb; }
.btn-primary { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
.btn-primary:hover { background: #1e40af; }
.btn-secondary { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-secondary:hover { background: #f9fafb; }
.action-btns { display: flex; gap: 6px; }
.detail-body { display: flex; flex-direction: column; gap: 14px; }
.detail-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.detail-label { font-size: 0.83rem; color: #9ca3af; font-weight: 500; min-width: 130px; }
.detail-value { font-size: 0.875rem; color: #111827; font-weight: 500; }
.id-badge { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; padding: 2px 8px; font-size: 0.8rem; font-family: monospace; color: #374151; }
.discipline-low { color: #dc2626; font-weight: 600; }
.discipline-ok { color: #16a34a; font-weight: 500; }
</style>
