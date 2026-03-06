<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :rows="5" :cols="6" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">จัดการผู้ปกครอง</h2>
          <p class="page-desc">ข้อมูลผู้ปกครองและความเชื่อมโยงกับนักเรียน</p>
        </div>
        <button type="button" class="btn btn-primary" @click="openAdd">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          เพิ่มผู้ปกครอง
        </button>
      </div>

      <div class="filter-row">
        <div class="search-wrap">
          <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9ca3af" stroke-width="1.4"/><path d="M10 10l3 3" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/></svg>
          <input v-model="search" class="input search" type="text" placeholder="ค้นหาชื่อผู้ปกครอง หรือ ชื่อนักเรียน..." autocomplete="off" />
        </div>
        <select v-model="filterRelation" class="input sel">
          <option value="">ความสัมพันธ์ทั้งหมด</option>
          <option>บิดา</option>
          <option>มารดา</option>
          <option>ผู้ปกครอง</option>
        </select>
        <button v-if="search || filterRelation" type="button" class="btn btn-clear" @click="clearFilters">ล้างตัวกรอง</button>
      </div>

      <StaffDataTable title="รายชื่อผู้ปกครอง" :columns="cols" :rows="filteredRows">
        <template #cell-status="{ value }">
          <StaffStatusBadge
            :label="value as string"
            :variant="value === 'ใช้งาน' ? 'approved' : 'default'"
          />
        </template>
        <template #rowActions="{ row }">
          <div class="action-btns">
            <button type="button" class="btn btn-sm btn-detail" @click="navigateTo('/staff/parents/' + (row as unknown as ParentRow).id)">รายละเอียด</button>
            <button type="button" class="btn btn-sm btn-edit" @click="openEdit(row as unknown as ParentRow)">แก้ไข</button>
            <button type="button" class="btn btn-sm btn-delete" @click="confirmDelete(row as unknown as ParentRow)">ลบ</button>
          </div>
        </template>
      </StaffDataTable>

      <!-- Detail Modal -->
      <StaffAppModal v-model="showDetail" title="ข้อมูลผู้ปกครอง" size="md">
        <template #footer>
          <button type="button" class="btn btn-secondary" @click="showDetail = false">ปิด</button>
          <button type="button" class="btn btn-edit-footer" @click="switchToEdit">แก้ไขข้อมูล</button>
        </template>
        <div class="detail-body" v-if="detailRow">
          <div class="detail-row"><span class="detail-label">รหัส</span><span class="id-badge">{{ detailRow.id }}</span></div>
          <div class="detail-row"><span class="detail-label">ชื่อ-นามสกุล</span><span class="detail-value">{{ detailRow.prefix }}{{ detailRow.firstName }} {{ detailRow.lastName }}</span></div>
          <div class="detail-row"><span class="detail-label">ความสัมพันธ์</span><span class="detail-value">{{ detailRow.relation }}</span></div>
          <div class="detail-row"><span class="detail-label">โทรศัพท์</span><span class="detail-value">{{ detailRow.phone }}</span></div>
          <div class="detail-row"><span class="detail-label">อีเมล</span><span class="detail-value">{{ detailRow.email || '-' }}</span></div>
          <div class="detail-row"><span class="detail-label">Line ID</span><span class="detail-value">{{ detailRow.lineId || '-' }}</span></div>
          <div class="detail-row"><span class="detail-label">นักเรียนในปกครอง</span><span class="detail-value">{{ detailRow.studentName }}</span></div>
          <div class="detail-row"><span class="detail-label">ห้อง</span><span class="detail-value">{{ detailRow.studentClass }}</span></div>
          <div class="detail-row"><span class="detail-label">ที่อยู่</span><span class="detail-value addr">{{ detailRow.address || '-' }}</span></div>
          <div class="detail-row">
            <span class="detail-label">สถานะ</span>
            <StaffStatusBadge :label="detailRow.status" :variant="detailRow.status === 'ใช้งาน' ? 'approved' : 'default'" />
          </div>
        </div>
      </StaffAppModal>

      <!-- Add/Edit Modal -->
      <StaffAppModal v-model="showForm" :title="editRow ? 'แก้ไขข้อมูลผู้ปกครอง' : 'เพิ่มผู้ปกครองใหม่'" size="md">
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
              <label class="form-label">ความสัมพันธ์</label>
              <select v-model="form.relation" class="input">
                <option>บิดา</option>
                <option>มารดา</option>
                <option>ผู้ปกครอง</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">โทรศัพท์</label>
              <input v-model="form.phone" class="input" type="tel" placeholder="08x-xxx-xxxx" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">อีเมล</label>
              <input v-model="form.email" class="input" type="email" placeholder="email@example.com" />
            </div>
            <div class="form-group">
              <label class="form-label">Line ID</label>
              <input v-model="form.lineId" class="input" type="text" placeholder="Line ID (ถ้ามี)" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group flex-2">
              <label class="form-label">ชื่อนักเรียนในปกครอง</label>
              <input v-model="form.studentName" class="input" type="text" placeholder="ชื่อ-นามสกุล นักเรียน" />
            </div>
            <div class="form-group">
              <label class="form-label">รหัสนักเรียน</label>
              <input v-model="form.studentId" class="input" type="text" placeholder="66100xxx" />
            </div>
            <div class="form-group">
              <label class="form-label">ห้องเรียน</label>
              <input v-model="form.studentClass" class="input" type="text" placeholder="ม.1/1" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">ที่อยู่</label>
              <input v-model="form.address" class="input" type="text" placeholder="ที่อยู่ (ถ้ามี)" />
            </div>
            <div class="form-group">
              <label class="form-label">สถานะ</label>
              <select v-model="form.status" class="input">
                <option>ใช้งาน</option>
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
        <p class="confirm-text">ต้องการลบข้อมูลผู้ปกครอง <strong>{{ deleteTarget?.prefix }}{{ deleteTarget?.firstName }} {{ deleteTarget?.lastName }}</strong> ใช่หรือไม่?</p>
      </StaffAppModal>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useParentsData, type ParentRow } from '~/composables/useParentsData'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()
const { rows, addRow, updateRow, deleteRow } = useParentsData()

const search = ref('')
const filterRelation = ref('')
const showDetail = ref(false)
const showForm = ref(false)
const showDeleteConfirm = ref(false)
const detailRow = ref<ParentRow | null>(null)
const editRow = ref<ParentRow | null>(null)
const deleteTarget = ref<ParentRow | null>(null)

const defaultForm = () => ({
  prefix: 'นาย',
  firstName: '',
  lastName: '',
  relation: 'บิดา',
  phone: '',
  email: '',
  lineId: '',
  studentName: '',
  studentId: '',
  studentClass: '',
  address: '',
  status: 'ใช้งาน' as ParentRow['status'],
})
const form = reactive(defaultForm())

const cols = [
  { key: 'id', label: 'รหัส' },
  { key: 'firstName', label: 'ชื่อ' },
  { key: 'lastName', label: 'นามสกุล' },
  { key: 'relation', label: 'ความสัมพันธ์' },
  { key: 'studentName', label: 'นักเรียนในปกครอง' },
  { key: 'studentClass', label: 'ห้อง' },
  { key: 'phone', label: 'โทรศัพท์' },
  { key: 'status', label: 'สถานะ' },
]

const filteredRows = computed(() =>
  rows.value.filter(r => {
    const q = search.value.toLowerCase()
    const fullName = `${r.firstName} ${r.lastName}`.toLowerCase()
    const matchSearch = !q || fullName.includes(q) || r.studentName.toLowerCase().includes(q)
    const matchRelation = !filterRelation.value || r.relation === filterRelation.value
    return matchSearch && matchRelation
  })
)

function openDetail(row: ParentRow) { detailRow.value = row; showDetail.value = true }

function openAdd() {
  editRow.value = null
  Object.assign(form, defaultForm())
  showForm.value = true
}

function openEdit(row: ParentRow) {
  editRow.value = row
  Object.assign(form, {
    prefix: row.prefix, firstName: row.firstName, lastName: row.lastName,
    relation: row.relation, phone: row.phone, email: row.email,
    lineId: row.lineId, studentName: row.studentName, studentId: row.studentId,
    studentClass: row.studentClass, address: row.address, status: row.status,
  })
  showForm.value = true
}

function switchToEdit() {
  if (detailRow.value) { showDetail.value = false; openEdit(detailRow.value) }
}

function saveForm() {
  if (editRow.value) {
    updateRow(editRow.value.id, { ...form })
  } else {
    addRow({ id: `P${Date.now()}`, ...form })
  }
  showForm.value = false
}

function confirmDelete(row: ParentRow) { deleteTarget.value = row; showDeleteConfirm.value = true }

function doDelete() {
  if (deleteTarget.value) {
    deleteRow(deleteTarget.value.id)
    showDeleteConfirm.value = false
    deleteTarget.value = null
  }
}

function clearFilters() { search.value = ''; filterRelation.value = '' }
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

.filter-row { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); }

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
  box-sizing: border-box;
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
.btn-delete { background: #fff5f5; color: #dc2626; border-color: #fecaca; }
.btn-delete:hover { background: #fee2e2; }

.action-btns { display: flex; gap: 6px; }

.detail-body { display: flex; flex-direction: column; gap: 12px; }
.detail-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.detail-label { font-size: 0.83rem; color: #9ca3af; font-weight: 500; min-width: 140px; }
.detail-value { font-size: 0.875rem; color: #111827; font-weight: 500; }
.detail-value.addr { font-size: 0.85rem; text-align: right; }

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
.form-group { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 130px; }
.form-group.flex-2 { flex: 2; }
.form-label { font-size: 0.8rem; font-weight: 600; color: #374151; }
.confirm-text { font-size: 0.9rem; color: #374151; margin: 0; line-height: 1.6; }
</style>
