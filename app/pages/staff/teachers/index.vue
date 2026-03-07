<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :rows="5" :cols="7" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">รายชื่อครู</h2>
          <p class="page-desc">ครูที่ได้รับการอนุมัติทั้งหมดในระบบ</p>
        </div>
        <button type="button" class="btn btn-primary" @click="openAdd">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          เพิ่มครูใหม่
        </button>
      </div>

      <div class="filter-row">
        <div class="search-wrap">
          <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9ca3af" stroke-width="1.4"/><path d="M10 10l3 3" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/></svg>
          <input
            v-model="search"
            class="input search"
            list="teacher-search-list"
            type="text"
            placeholder="ค้นหาชื่อ หรือ รหัสครู..."
            autocomplete="off"
          />
          <datalist id="teacher-search-list">
            <option v-for="r in filteredRows" :key="r.id" :value="`${r.firstName} ${r.lastName}`" />
            <option v-for="r in filteredRows" :key="r.id + '-id'" :value="r.id" />
          </datalist>
        </div>
        <select v-model="filterSubject" class="input sel">
          <option value="">กลุ่มสาระทั้งหมด</option>
          <option>ภาษาไทย</option>
          <option>คณิตศาสตร์</option>
          <option>วิทยาศาสตร์</option>
          <option>สังคมศึกษา</option>
          <option>ภาษาต่างประเทศ</option>
          <option>ศิลปะ</option>
          <option>พลศึกษา</option>
        </select>
        <button v-if="search || filterSubject" type="button" class="btn btn-clear" @click="clearFilters">ล้างตัวกรอง</button>
      </div>

      <StaffDataTable title="รายชื่อครูที่ได้รับการอนุมัติ" :columns="cols" :rows="filteredRows">
        <template #rowActions="{ row }">
          <div class="action-btns">
            <button type="button" class="btn btn-sm btn-detail" @click="navigateTo('/staff/teachers/' + (row as unknown as TeacherRow).id)">รายละเอียด</button>
            <button type="button" class="btn btn-sm btn-edit" @click="openEdit(row as unknown as TeacherRow)">แก้ไข</button>
            <button type="button" class="btn btn-sm btn-delete" @click="confirmDelete(row as unknown as TeacherRow)">ลบ</button>
          </div>
        </template>
      </StaffDataTable>

      <!-- Detail Modal -->
      <StaffAppModal v-model="showDetail" title="ข้อมูลครู" size="md">
        <template #footer>
          <button type="button" class="btn btn-secondary" @click="showDetail = false">ปิด</button>
          <button type="button" class="btn btn-edit-footer" @click="switchToEdit">แก้ไขข้อมูล</button>
        </template>
        <div class="detail-body" v-if="detailRow">
          <div class="detail-row"><span class="detail-label">รหัสครู</span><span class="detail-value"><span class="id-badge">{{ detailRow.id }}</span></span></div>
          <div class="detail-row"><span class="detail-label">คำนำหน้า</span><span class="detail-value">{{ detailRow.prefix }}</span></div>
          <div class="detail-row"><span class="detail-label">ชื่อ</span><span class="detail-value">{{ detailRow.firstName }}</span></div>
          <div class="detail-row"><span class="detail-label">นามสกุล</span><span class="detail-value">{{ detailRow.lastName }}</span></div>
          <div class="detail-row"><span class="detail-label">อีเมล</span><span class="detail-value">{{ detailRow.email }}</span></div>
          <div class="detail-row"><span class="detail-label">โทรศัพท์</span><span class="detail-value">{{ detailRow.phone }}</span></div>
          <div class="detail-row"><span class="detail-label">กลุ่มสาระ</span><span class="detail-value">{{ detailRow.subjectGroup }}</span></div>
          <div class="detail-row"><span class="detail-label">ตำแหน่ง</span><span class="detail-value">{{ detailRow.position }}</span></div>
          <div class="detail-row"><span class="detail-label">ครูที่ปรึกษาห้อง</span><span class="detail-value">{{ detailRow.advisorClass || '-' }}</span></div>
          <div class="detail-row"><span class="detail-label">จำนวนวิชาที่สอน</span><span class="detail-value">{{ detailRow.courses }} วิชา</span></div>
          <div class="detail-row"><span class="detail-label">วันที่เริ่มงาน</span><span class="detail-value">{{ detailRow.joinDate }}</span></div>
          <div class="detail-row">
            <span class="detail-label">สถานะ</span>
            <StaffStatusBadge :label="detailRow.status" :variant="detailRow.status === 'อนุมัติแล้ว' ? 'approved' : detailRow.status === 'รออนุมัติ' ? 'pending' : 'default'" />
          </div>
        </div>
      </StaffAppModal>

      <!-- Add/Edit Modal -->
      <StaffAppModal v-model="showForm" :title="editRow ? 'แก้ไขข้อมูลครู' : 'เพิ่มครูใหม่'" size="md">
        <template #footer>
          <button type="button" class="btn btn-secondary" @click="showForm = false">ยกเลิก</button>
          <button type="button" class="btn btn-primary" @click="saveForm">บันทึก</button>
        </template>
        <div class="form-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">คำนำหน้า</label>
              <select v-model="form.prefix" class="input">
                <option>นาย</option>
                <option>นาง</option>
                <option>นางสาว</option>
              </select>
            </div>
            <div class="form-group flex-2">
              <label class="form-label">ชื่อ</label>
              <input v-model="form.firstName" class="input" type="text" placeholder="ชื่อจริง" />
            </div>
            <div class="form-group flex-2">
              <label class="form-label">นามสกุล</label>
              <input v-model="form.lastName" class="input" type="text" placeholder="นามสกุล" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">อีเมล</label>
              <input v-model="form.email" class="input" type="email" placeholder="email@school.ac.th" />
            </div>
            <div class="form-group">
              <label class="form-label">โทรศัพท์</label>
              <input v-model="form.phone" class="input" type="tel" placeholder="08x-xxx-xxxx" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">กลุ่มสาระ</label>
              <select v-model="form.subjectGroup" class="input">
                <option>ภาษาไทย</option>
                <option>คณิตศาสตร์</option>
                <option>วิทยาศาสตร์</option>
                <option>สังคมศึกษา</option>
                <option>ภาษาต่างประเทศ</option>
                <option>ศิลปะ</option>
                <option>พลศึกษา</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">ตำแหน่ง</label>
              <input v-model="form.position" class="input" type="text" placeholder="ครูชำนาญการ" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">ครูที่ปรึกษาห้อง</label>
              <input v-model="form.advisorClass" class="input" type="text" placeholder="ม.1/1 (ถ้ามี)" />
            </div>
            <div class="form-group">
              <label class="form-label">วันที่เริ่มงาน</label>
              <input v-model="form.joinDate" class="input" type="text" placeholder="1 พ.ค. 2567" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">สถานะ</label>
              <select v-model="form.status" class="input">
                <option>อนุมัติแล้ว</option>
                <option>รออนุมัติ</option>
                <option>ระงับ</option>
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
        <p class="confirm-text">คุณต้องการลบข้อมูลครู <strong>{{ deleteTarget?.prefix }}{{ deleteTarget?.firstName }} {{ deleteTarget?.lastName }}</strong> ใช่หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้</p>
      </StaffAppModal>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useTeachersData, type TeacherRow } from '~/composables/useTeachersData'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()
const { rows, addRow, updateRow, deleteRow } = useTeachersData()

const search = ref('')
const filterSubject = ref('')
const showDetail = ref(false)
const showForm = ref(false)
const showDeleteConfirm = ref(false)
const detailRow = ref<TeacherRow | null>(null)
const editRow = ref<TeacherRow | null>(null)
const deleteTarget = ref<TeacherRow | null>(null)

const defaultForm = () => ({
  prefix: 'นาย',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subjectGroup: 'ภาษาไทย',
  position: '',
  advisorClass: '',
  courses: 0,
  joinDate: '',
  status: 'รออนุมัติ' as TeacherRow['status'],
})
const form = reactive(defaultForm())

const cols = [
  { key: 'id', label: 'รหัส' },
  { key: 'firstName', label: 'ชื่อ' },
  { key: 'lastName', label: 'นามสกุล' },
  { key: 'subjectGroup', label: 'กลุ่มสาระ' },
  { key: 'position', label: 'ตำแหน่ง' },
  { key: 'advisorClass', label: 'ที่ปรึกษา' },
]

const filteredRows = computed(() =>
  rows.value.filter(r => {
    if (r.status !== 'อนุมัติแล้ว') return false
    const q = search.value.toLowerCase()
    const fullName = `${r.firstName} ${r.lastName}`.toLowerCase()
    const matchSearch = !q || fullName.includes(q) || r.id.toLowerCase().includes(q)
    const matchSubject = !filterSubject.value || r.subjectGroup === filterSubject.value
    return matchSearch && matchSubject
  })
)

function openDetail(row: TeacherRow) {
  detailRow.value = row
  showDetail.value = true
}

function openAdd() {
  editRow.value = null
  Object.assign(form, defaultForm())
  showForm.value = true
}

function openEdit(row: TeacherRow) {
  editRow.value = row
  Object.assign(form, {
    prefix: row.prefix,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    subjectGroup: row.subjectGroup,
    position: row.position,
    advisorClass: row.advisorClass,
    courses: row.courses,
    joinDate: row.joinDate,
    status: row.status,
  })
  showForm.value = true
}

function switchToEdit() {
  if (detailRow.value) {
    showDetail.value = false
    openEdit(detailRow.value)
  }
}

function saveForm() {
  if (editRow.value) {
    updateRow(editRow.value.id, { ...form })
  } else {
    addRow({ id: `T${Date.now()}`, ...form })
  }
  showForm.value = false
}

function confirmDelete(row: TeacherRow) {
  deleteTarget.value = row
  showDeleteConfirm.value = true
}

function doDelete() {
  if (deleteTarget.value) {
    deleteRow(deleteTarget.value.id)
    showDeleteConfirm.value = false
    deleteTarget.value = null
  }
}

function clearFilters() {
  search.value = ''
  filterSubject.value = ''
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 0; }

.page-header {
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.page-title { font-size: 1.3rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
.page-desc { font-size: 0.875rem; color: #6b7280; margin: 0; }

.filter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-wrap {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  color: #111827;
  background: #fff;
  outline: none;
  transition: border-color 0.15s;
}

.input:focus { border-color: #1d4ed8; }

.search { padding-left: 34px; }

.sel { width: auto; min-width: 160px; flex: none; }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 7px;
  padding: 7px 14px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  font-family: inherit;
  transition: background 0.12s;
  white-space: nowrap;
}

.btn-primary { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
.btn-primary:hover { background: #1e40af; }
.btn-secondary { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-secondary:hover { background: #f9fafb; }
.btn-clear { background: #fff; color: #6b7280; border-color: #e5e7eb; }
.btn-clear:hover { background: #f9fafb; }
.btn-danger { background: #dc2626; color: #fff; border-color: #dc2626; }
.btn-danger:hover { background: #b91c1c; }

.btn-sm { padding: 5px 10px; font-size: 0.8rem; }
.btn-detail { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-detail:hover { background: #f9fafb; }
.btn-edit { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.btn-edit:hover { background: #dbeafe; }
.btn-edit-footer { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.btn-edit-footer:hover { background: #dbeafe; }
.btn-approve { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
.btn-approve:hover { background: #dcfce7; }
.btn-delete { background: #fff5f5; color: #dc2626; border-color: #fecaca; }
.btn-delete:hover { background: #fee2e2; }

.action-btns { display: flex; gap: 6px; justify-content: flex-end; flex-wrap: nowrap; }

.detail-body { display: flex; flex-direction: column; gap: 14px; }
.detail-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.detail-label { font-size: 0.83rem; color: #9ca3af; font-weight: 500; min-width: 140px; }
.detail-value { font-size: 0.875rem; color: #111827; font-weight: 500; }

.id-badge {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 0.8rem;
  font-family: monospace;
  color: #374151;
}

.form-body { display: flex; flex-direction: column; gap: 16px; }
.form-row { display: flex; gap: 12px; flex-wrap: wrap; }
.form-group { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 140px; }
.form-group.flex-2 { flex: 2; }
.form-label { font-size: 0.8rem; font-weight: 600; color: #374151; }
.confirm-text { font-size: 0.9rem; color: #374151; margin: 0; line-height: 1.6; }
</style>
