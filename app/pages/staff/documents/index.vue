<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :rows="5" :cols="6" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">จัดการเอกสาร</h2>
          <p class="page-desc">บริหารจัดการคำขอเอกสารและคลังแบบฟอร์ม</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button :class="['tab', activeTab === 'requests' && 'tab--active']" @click="activeTab = 'requests'">
          คำขอเอกสาร
          <span v-if="pendingCount" class="tab-badge">{{ pendingCount }}</span>
        </button>
        <button :class="['tab', activeTab === 'templates' && 'tab--active']" @click="activeTab = 'templates'">
          คลังแบบฟอร์ม
        </button>
      </div>

      <!-- Requests Tab -->
      <div v-if="activeTab === 'requests'">
        <div class="filter-row">
          <div class="search-wrap">
            <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9ca3af" stroke-width="1.4"/><path d="M10 10l3 3" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/></svg>
            <input v-model="reqSearch" class="input search" type="text" placeholder="ค้นหาประเภทเอกสาร หรือ ผู้ขอ..." autocomplete="off" />
          </div>
          <select v-model="reqFilterStatus" class="input sel">
            <option value="">ทุกสถานะ</option>
            <option>ร้องขอ</option>
            <option>กำลังดำเนินการ</option>
            <option>เสร็จสิ้น</option>
            <option>ยกเลิก</option>
          </select>
          <select v-model="reqFilterCategory" class="input sel">
            <option value="">ทุกหมวดหมู่</option>
            <option>เอกสารราชการ</option>
            <option>ใบรับรอง</option>
            <option>แบบฟอร์ม</option>
          </select>
          <button v-if="reqSearch || reqFilterStatus || reqFilterCategory" type="button" class="btn btn-clear" @click="clearReqFilters">ล้างตัวกรอง</button>
        </div>

        <StaffDataTable title="รายการคำขอเอกสาร" :columns="reqCols" :rows="filteredRequests">
          <template #cell-status="{ value }">
            <StaffStatusBadge
              :label="value as string"
              :variant="value === 'เสร็จสิ้น' ? 'approved' : value === 'ร้องขอ' || value === 'กำลังดำเนินการ' ? 'pending' : 'default'"
            />
          </template>
          <template #rowActions="{ row }">
            <div class="action-btns">
              <button type="button" class="btn btn-sm btn-detail" @click="navigateTo('/staff/documents/' + (row as unknown as DocumentRequest).id)">รายละเอียด</button>
              <button
                v-if="(row as unknown as DocumentRequest).status === 'ร้องขอ'"
                type="button" class="btn btn-sm btn-process"
                @click="processRequest(row as unknown as DocumentRequest)"
              >รับเรื่อง</button>
              <button
                v-if="(row as unknown as DocumentRequest).status === 'กำลังดำเนินการ'"
                type="button" class="btn btn-sm btn-complete"
                @click="completeRequest(row as unknown as DocumentRequest)"
              >เสร็จสิ้น</button>
            </div>
          </template>
        </StaffDataTable>

        <!-- Request Detail Modal -->
        <StaffAppModal v-model="showReqDetail" title="รายละเอียดคำขอเอกสาร" size="md">
          <template #footer>
            <button type="button" class="btn btn-secondary" @click="showReqDetail = false">ปิด</button>
            <button v-if="reqDetailRow?.status === 'ร้องขอ'" type="button" class="btn btn-process" @click="processRequest(reqDetailRow!)">รับเรื่อง</button>
            <button v-if="reqDetailRow?.status === 'กำลังดำเนินการ'" type="button" class="btn btn-complete" @click="completeRequest(reqDetailRow!)">เสร็จสิ้น</button>
          </template>
          <div v-if="reqDetailRow" class="detail-body">
            <div class="detail-row"><span class="dl">รหัสคำขอ</span><span class="id-badge">{{ reqDetailRow.id }}</span></div>
            <div class="detail-row"><span class="dl">ประเภทเอกสาร</span><span class="dv">{{ reqDetailRow.docType }}</span></div>
            <div class="detail-row"><span class="dl">หมวดหมู่</span><span class="dv">{{ reqDetailRow.category }}</span></div>
            <div class="detail-row"><span class="dl">ผู้ขอ</span><span class="dv">{{ reqDetailRow.requesterName }}</span></div>
            <div class="detail-row"><span class="dl">บทบาท</span><span class="dv">{{ reqDetailRow.requesterRole }}</span></div>
            <div class="detail-row"><span class="dl">วัตถุประสงค์</span><span class="dv">{{ reqDetailRow.purpose }}</span></div>
            <div class="detail-row"><span class="dl">จำนวนชุด</span><span class="dv">{{ reqDetailRow.copies }} ชุด</span></div>
            <div class="detail-row"><span class="dl">วันที่ขอ</span><span class="dv">{{ reqDetailRow.requestedAt }}</span></div>
            <div v-if="reqDetailRow.completedAt" class="detail-row"><span class="dl">วันที่เสร็จ</span><span class="dv">{{ reqDetailRow.completedAt }}</span></div>
            <div v-if="reqDetailRow.handledBy" class="detail-row"><span class="dl">ผู้ดำเนินการ</span><span class="dv">{{ reqDetailRow.handledBy }}</span></div>
            <div v-if="reqDetailRow.note" class="detail-note">
              <span class="dl">หมายเหตุ</span>
              <p>{{ reqDetailRow.note }}</p>
            </div>
            <div class="detail-row">
              <span class="dl">สถานะ</span>
              <StaffStatusBadge :label="reqDetailRow.status" :variant="reqDetailRow.status === 'เสร็จสิ้น' ? 'approved' : reqDetailRow.status === 'ยกเลิก' ? 'default' : 'pending'" />
            </div>
          </div>
        </StaffAppModal>
      </div>

      <!-- Templates Tab -->
      <div v-if="activeTab === 'templates'">
        <div class="filter-row">
          <div class="search-wrap">
            <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9ca3af" stroke-width="1.4"/><path d="M10 10l3 3" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/></svg>
            <input v-model="tplSearch" class="input search" type="text" placeholder="ค้นหาแบบฟอร์ม..." autocomplete="off" />
          </div>
          <button type="button" class="btn btn-primary" @click="showAddTemplate = true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            เพิ่มแบบฟอร์ม
          </button>
        </div>

        <div class="template-grid">
          <div v-for="tpl in filteredTemplates" :key="tpl.id" class="template-card">
            <div class="tpl-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="2" width="16" height="22" rx="2" fill="#dbeafe" stroke="#93c5fd" stroke-width="1.5"/><path d="M8 9h8M8 13h8M8 17h5" stroke="#3b82f6" stroke-width="1.3" stroke-linecap="round"/><rect x="16" y="14" width="8" height="10" rx="2" fill="#fef3c7" stroke="#fcd34d" stroke-width="1.3"/><path d="M18 19h4M18 21h2" stroke="#d97706" stroke-width="1.1" stroke-linecap="round"/></svg>
            </div>
            <div class="tpl-info">
              <div class="tpl-name">{{ tpl.name }}</div>
              <div class="tpl-category">{{ tpl.category }}</div>
              <div class="tpl-desc">{{ tpl.description }}</div>
              <div class="tpl-meta">อัปเดต {{ tpl.lastUpdated }} · ดาวน์โหลด {{ tpl.downloadCount }} ครั้ง</div>
            </div>
            <div class="tpl-actions">
              <button type="button" class="btn btn-sm btn-download">ดาวน์โหลด</button>
            </div>
          </div>
        </div>

        <!-- Add Template Modal -->
        <StaffAppModal v-model="showAddTemplate" title="เพิ่มแบบฟอร์มใหม่" size="sm">
          <template #footer>
            <button type="button" class="btn btn-secondary" @click="showAddTemplate = false">ยกเลิก</button>
            <button type="button" class="btn btn-primary" @click="saveTemplate">บันทึก</button>
          </template>
          <div class="form-body">
            <div class="form-group">
              <label class="form-label">ชื่อแบบฟอร์ม</label>
              <input v-model="newTpl.name" class="input" type="text" placeholder="ชื่อแบบฟอร์ม" />
            </div>
            <div class="form-group">
              <label class="form-label">หมวดหมู่</label>
              <select v-model="newTpl.category" class="input">
                <option>เอกสารราชการ</option>
                <option>ใบรับรอง</option>
                <option>แบบฟอร์ม</option>
                <option>คู่มือ</option>
                <option>เอกสารประกาศ</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">คำอธิบาย</label>
              <input v-model="newTpl.description" class="input" type="text" placeholder="คำอธิบายสั้น" />
            </div>
          </div>
        </StaffAppModal>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useDocumentsData, type DocumentRequest, type DocumentTemplate } from '~/composables/useDocumentsData'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()
const { requests, templates } = useDocumentsData()

const activeTab = ref<'requests' | 'templates'>('requests')

// Requests
const reqSearch = ref('')
const reqFilterStatus = ref('')
const reqFilterCategory = ref('')
const showReqDetail = ref(false)
const reqDetailRow = ref<DocumentRequest | null>(null)

const handledBy = 'นางสาวสมใจ รักงาน'

const reqCols = [
  { key: 'id', label: 'รหัส' },
  { key: 'docType', label: 'ประเภทเอกสาร' },
  { key: 'requesterName', label: 'ผู้ขอ' },
  { key: 'requesterRole', label: 'บทบาท' },
  { key: 'copies', label: 'จำนวนชุด' },
  { key: 'requestedAt', label: 'วันที่ขอ' },
  { key: 'status', label: 'สถานะ' },
]

const filteredRequests = computed(() =>
  requests.value.filter(r => {
    const q = reqSearch.value.toLowerCase()
    const matchSearch = !q || r.docType.toLowerCase().includes(q) || r.requesterName.toLowerCase().includes(q)
    const matchStatus = !reqFilterStatus.value || r.status === reqFilterStatus.value
    const matchCat = !reqFilterCategory.value || r.category === reqFilterCategory.value
    return matchSearch && matchStatus && matchCat
  })
)

const pendingCount = computed(() =>
  requests.value.filter(r => r.status === 'ร้องขอ' || r.status === 'กำลังดำเนินการ').length
)

function openReqDetail(row: DocumentRequest) { reqDetailRow.value = row; showReqDetail.value = true }

function processRequest(row: DocumentRequest) {
  const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
  const idx = requests.value.findIndex(r => r.id === row.id)
  if (idx !== -1) requests.value[idx] = { ...requests.value[idx], status: 'กำลังดำเนินการ', handledBy }
  showReqDetail.value = false
}

function completeRequest(row: DocumentRequest) {
  const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
  const idx = requests.value.findIndex(r => r.id === row.id)
  if (idx !== -1) requests.value[idx] = { ...requests.value[idx], status: 'เสร็จสิ้น', completedAt: today, handledBy }
  showReqDetail.value = false
}

function clearReqFilters() { reqSearch.value = ''; reqFilterStatus.value = ''; reqFilterCategory.value = '' }

// Templates
const tplSearch = ref('')
const showAddTemplate = ref(false)
const newTpl = reactive({ name: '', category: 'แบบฟอร์ม' as DocumentTemplate['category'], description: '' })

const filteredTemplates = computed(() => {
  const q = tplSearch.value.toLowerCase()
  return !q ? templates.value : templates.value.filter(t => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
})

function saveTemplate() {
  const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
  templates.value.push({ id: `TPL-${Date.now()}`, ...newTpl, lastUpdated: today, downloadCount: 0 })
  showAddTemplate.value = false
  Object.assign(newTpl, { name: '', category: 'แบบฟอร์ม' as DocumentTemplate['category'], description: '' })
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 0; }
.page-header { margin-bottom: 20px; display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.page-title { font-size: 1.3rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
.page-desc { font-size: 0.875rem; color: #6b7280; margin: 0; }

.tabs { display: flex; gap: 4px; border-bottom: 2px solid #e5e7eb; margin-bottom: 20px; }
.tab { background: none; border: none; padding: 10px 18px; font-size: 0.9rem; font-weight: 500; color: #6b7280; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; font-family: inherit; display: flex; align-items: center; gap: 7px; transition: color 0.15s; }
.tab:hover { color: #374151; }
.tab--active { color: #1d4ed8; border-bottom-color: #1d4ed8; }
.tab-badge { background: #dc2626; color: #fff; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; padding: 1px 6px; }

.filter-row { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); }

.input { width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; font-family: inherit; color: #111827; background: #fff; outline: none; transition: border-color 0.15s; box-sizing: border-box; }
.input:focus { border-color: #1d4ed8; }
.search { padding-left: 34px; }
.sel { width: auto; min-width: 150px; flex: none; }

.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 7px; padding: 7px 14px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: background 0.12s; white-space: nowrap; }
.btn-primary { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
.btn-primary:hover { background: #1e40af; }
.btn-secondary { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-secondary:hover { background: #f9fafb; }
.btn-clear { background: #fff; color: #6b7280; border-color: #e5e7eb; }
.btn-clear:hover { background: #f9fafb; }
.btn-sm { padding: 5px 10px; font-size: 0.8rem; }
.btn-detail { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-detail:hover { background: #f9fafb; }
.btn-process { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.btn-process:hover { background: #dbeafe; }
.btn-complete { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
.btn-complete:hover { background: #dcfce7; }
.btn-download { background: #f5f3ff; color: #7c3aed; border-color: #ddd6fe; }
.btn-download:hover { background: #ede9fe; }

.action-btns { display: flex; gap: 6px; justify-content: flex-end; flex-wrap: nowrap; }

.detail-body { display: flex; flex-direction: column; gap: 12px; }
.detail-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.dl { font-size: 0.8rem; color: #9ca3af; font-weight: 500; min-width: 130px; }
.dv { font-size: 0.875rem; color: #111827; font-weight: 500; }
.detail-note { display: flex; flex-direction: column; gap: 4px; background: #fffbeb; border-radius: 8px; padding: 10px 12px; }
.detail-note p { margin: 0; font-size: 0.875rem; color: #374151; }
.id-badge { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; padding: 2px 8px; font-size: 0.8rem; font-family: monospace; color: #374151; }

.template-grid { display: flex; flex-direction: column; gap: 10px; }
.template-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; display: flex; align-items: flex-start; gap: 14px; transition: box-shadow 0.15s; }
.template-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.tpl-icon { flex-shrink: 0; padding-top: 2px; }
.tpl-info { flex: 1; }
.tpl-name { font-size: 0.925rem; font-weight: 600; color: #111827; margin-bottom: 2px; }
.tpl-category { font-size: 0.75rem; color: #6b7280; background: #f3f4f6; display: inline-block; padding: 1px 7px; border-radius: 9999px; margin-bottom: 4px; }
.tpl-desc { font-size: 0.83rem; color: #374151; margin-bottom: 6px; }
.tpl-meta { font-size: 0.75rem; color: #9ca3af; }
.tpl-actions { flex-shrink: 0; }

.form-body { display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 0.8rem; font-weight: 600; color: #374151; }
</style>
