<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :rows="4" :cols="5" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">ประกาศโรงเรียน</h2>
          <p class="page-desc">สร้างและจัดการประกาศของคุณ สามารถแก้ไขได้เฉพาะประกาศที่คุณสร้างเท่านั้น</p>
        </div>
        <button type="button" class="btn btn-primary" @click="openAdd">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          สร้างประกาศ
        </button>
      </div>

      <div class="filter-row">
        <div class="search-wrap">
          <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9ca3af" stroke-width="1.4"/><path d="M10 10l3 3" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/></svg>
          <input v-model="search" class="input search" type="text" placeholder="ค้นหาประกาศ..." autocomplete="off" />
        </div>
        <select v-model="filterStatus" class="input sel">
          <option value="">ทุกสถานะ</option>
          <option>เผยแพร่แล้ว</option>
          <option>ฉบับร่าง</option>
        </select>
        <label class="toggle-label">
          <input v-model="showOwn" type="checkbox" class="toggle-input" />
          <span class="toggle-track"><span class="toggle-thumb" /></span>
          <span>เฉพาะประกาศของฉัน</span>
        </label>
        <button v-if="search || filterStatus" type="button" class="btn btn-clear" @click="clearFilters">ล้างตัวกรอง</button>
      </div>

      <StaffDataTable title="รายการประกาศ" :columns="cols" :rows="filteredRows">
        <template #cell-status="{ value }">
          <StaffStatusBadge :label="value as string" :variant="value === 'เผยแพร่แล้ว' ? 'approved' : 'default'" />
        </template>
        <template #cell-isOwn="{ value }">
          <span v-if="value" class="own-badge">ของคุณ</span>
        </template>
        <template #rowActions="{ row }">
          <div class="action-btns">
            <button type="button" class="btn btn-sm btn-view" @click="navigateTo('/staff/announcements/' + (row as unknown as AnnouncementRow).id)">ดู</button>
            <template v-if="(row as unknown as AnnouncementRow).isOwn">
              <button type="button" class="btn btn-sm btn-edit" @click="openEdit(row as unknown as AnnouncementRow)">แก้ไข</button>
              <button type="button" class="btn btn-sm btn-delete" @click="openDelete(row as unknown as AnnouncementRow)">ลบ</button>
            </template>
          </div>
        </template>
      </StaffDataTable>

      <!-- Add / Edit Modal -->
      <StaffAppModal
        v-model="showModal"
        :title="editTarget ? 'แก้ไขประกาศ' : 'สร้างประกาศใหม่'"
        size="lg"
        confirm-label="บันทึก"
        @confirm="saveRow"
      >
        <div class="form-col">
          <label class="field">
            <span>หัวข้อประกาศ <span class="req">*</span></span>
            <input v-model="form.title" class="input" type="text" placeholder="กรอกหัวข้อประกาศ" />
          </label>
          <label class="field">
            <span>หมวดหมู่</span>
            <select v-model="form.category" class="input">
              <option>วิชาการ</option>
              <option>ทั่วไป</option>
              <option>ประชุม</option>
              <option>กิจกรรม</option>
            </select>
          </label>
          <div class="form-row2">
            <label class="field">
              <span>ผู้เขียน</span>
              <input v-model="form.author" class="input" type="text" placeholder="ชื่อผู้เขียน" />
            </label>
            <label class="field">
              <span>สถานะ</span>
              <select v-model="form.status" class="input">
                <option>ฉบับร่าง</option>
                <option>เผยแพร่แล้ว</option>
              </select>
            </label>
          </div>
        </div>
      </StaffAppModal>

      <!-- Confirm Delete -->
      <StaffAppConfirmModal
        v-model="showDeleteConfirm"
        title="ลบประกาศ"
        :message="`ต้องการลบประกาศ &quot;${deleteTarget?.title}&quot; ใช่หรือไม่?`"
        confirm-label="ลบ"
        confirm-variant="danger"
        @confirm="doDelete"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAnnouncementsData, type AnnouncementRow } from '~/composables/useAnnouncementsData'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()
const { rows } = useAnnouncementsData()

const search = ref('')
const filterStatus = ref('')
const showOwn = ref(false)
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const editTarget = ref<AnnouncementRow | null>(null)
const deleteTarget = ref<AnnouncementRow | null>(null)
const form = ref({ title: '', category: 'ทั่วไป', author: 'ครูสมหมาย ใจดี', status: 'ฉบับร่าง' })

const cols = [
  { key: 'date', label: 'วันที่' },
  { key: 'title', label: 'หัวข้อ' },
  { key: 'category', label: 'หมวดหมู่' },
  { key: 'author', label: 'ผู้สร้าง' },
  { key: 'status', label: 'สถานะ' },
  { key: 'isOwn', label: '' },
]

const filteredRows = computed(() =>
  rows.value.filter((r: AnnouncementRow) => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.author.toLowerCase().includes(q)
    const matchStatus = !filterStatus.value || r.status === filterStatus.value
    const matchOwn = !showOwn.value || r.isOwn
    return matchSearch && matchStatus && matchOwn
  })
)

function openAdd() { editTarget.value = null; form.value = { title: '', category: 'ทั่วไป', author: 'ครูสมหมาย ใจดี', status: 'ฉบับร่าง' }; showModal.value = true }
function openEdit(row: AnnouncementRow) { editTarget.value = row; form.value = { title: row.title, category: row.category, author: row.author, status: row.status }; showModal.value = true }
function openDelete(row: AnnouncementRow) { deleteTarget.value = row; showDeleteConfirm.value = true }

function saveRow() {
  const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
  if (editTarget.value) {
    const idx = rows.value.findIndex(r => r.id === editTarget.value!.id)
    if (idx >= 0) rows.value[idx] = { ...rows.value[idx], ...form.value }
  } else {
    const nextId = `A${String(rows.value.length + 1).padStart(3, '0')}`
    rows.value.unshift({ id: nextId, ...form.value, date: today, isOwn: true })
  }
  showModal.value = false
}

function doDelete() {
  if (!deleteTarget.value) return
  const idx = rows.value.findIndex(r => r === deleteTarget.value)
  if (idx >= 0) rows.value.splice(idx, 1)
  showDeleteConfirm.value = false
}

function clearFilters() { search.value = ''; filterStatus.value = '' }
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
.sel { width: auto; min-width: 150px; flex: none; }
.textarea { resize: vertical; min-height: 80px; }
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
.btn-view { background: #f9fafb; color: #374151; border-color: #e5e7eb; }
.btn-view:hover { background: #f3f4f6; }
.btn-edit { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.btn-edit:hover { background: #dbeafe; }
.btn-delete { background: #fff5f5; color: #dc2626; border-color: #fecaca; }
.btn-delete:hover { background: #fee2e2; }
.action-btns { display: flex; gap: 6px; justify-content: flex-end; flex-wrap: nowrap; }
.own-badge { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 999px; padding: 2px 8px; font-size: 0.75rem; font-weight: 600; }
.form-col { display: flex; flex-direction: column; gap: 14px; }
.form-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 5px; font-size: 0.875rem; font-weight: 500; color: #374151; }
.req { color: #ef4444; }
.detail-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
.detail-date, .detail-author { font-size: 0.8rem; color: #6b7280; }
.detail-content { font-size: 0.9rem; color: #374151; line-height: 1.6; margin: 0 0 14px; }
.detail-target { font-size: 0.875rem; color: #374151; display: flex; gap: 6px; }
.label { font-weight: 600; }
</style>
