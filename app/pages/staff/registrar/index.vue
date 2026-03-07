<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :rows="5" :cols="6" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">งานทะเบียน</h2>
          <p class="page-desc">จัดการการลงทะเบียนนักเรียนใหม่และการย้ายเรียน</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button :class="['tab', activeTab === 'reg' && 'tab--active']" @click="activeTab = 'reg'">
          ลงทะเบียนนักเรียนใหม่
          <span v-if="pendingRegCount" class="tab-badge">{{ pendingRegCount }}</span>
        </button>
        <button :class="['tab', activeTab === 'transfer' && 'tab--active']" @click="activeTab = 'transfer'">
          ย้ายเรียน
          <span v-if="pendingTransferCount" class="tab-badge">{{ pendingTransferCount }}</span>
        </button>
      </div>

      <!-- Registrations Tab -->
      <div v-if="activeTab === 'reg'">
        <div class="filter-row">
          <div class="search-wrap">
            <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9ca3af" stroke-width="1.4"/><path d="M10 10l3 3" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/></svg>
            <input v-model="regSearch" class="input search" type="text" placeholder="ค้นหาชื่อนักเรียน..." autocomplete="off" />
          </div>
          <select v-model="regFilterStatus" class="input sel">
            <option value="">ทุกสถานะ</option>
            <option>รอตรวจสอบ</option>
            <option>ลงทะเบียนแล้ว</option>
            <option>ปฏิเสธ</option>
          </select>
          <select v-model="regFilterClass" class="input sel">
            <option value="">ทุกห้อง</option>
            <option>ม.1/1</option>
            <option>ม.1/2</option>
            <option>ม.1/3</option>
            <option>ม.4/1</option>
            <option>ม.4/2</option>
          </select>
          <button v-if="regSearch || regFilterStatus || regFilterClass" type="button" class="btn btn-clear" @click="clearRegFilters">ล้างตัวกรอง</button>
        </div>

        <StaffDataTable title="รายการลงทะเบียนนักเรียนใหม่" :columns="regCols" :rows="filteredRegs">
          <template #cell-status="{ value }">
            <StaffStatusBadge
              :label="value as string"
              :variant="value === 'ลงทะเบียนแล้ว' ? 'approved' : value === 'รอตรวจสอบ' ? 'pending' : 'default'"
            />
          </template>
          <template #rowActions="{ row }">
            <div class="action-btns">
              <button type="button" class="btn btn-sm btn-detail" @click="navigateTo('/staff/registrar/' + (row as unknown as RegistrationRow).id)">รายละเอียด</button>
              <template v-if="(row as unknown as RegistrationRow).status === 'รอตรวจสอบ'">
                <button type="button" class="btn btn-sm btn-approve" @click="requestRegAction(row as unknown as RegistrationRow, 'approve')">อนุมัติ</button>
                <button type="button" class="btn btn-sm btn-reject" @click="requestRegAction(row as unknown as RegistrationRow, 'reject')">ปฏิเสธ</button>
              </template>
            </div>
          </template>
        </StaffDataTable>

        <!-- Reg Detail Modal -->
        <StaffAppModal v-model="showRegDetail" title="รายละเอียดการลงทะเบียน" size="md">
          <template #footer>
            <button type="button" class="btn btn-secondary" @click="showRegDetail = false">ปิด</button>
            <template v-if="regDetailRow?.status === 'รอตรวจสอบ'">
              <button type="button" class="btn btn-reject-footer" @click="requestRegAction(regDetailRow!, 'reject')">ปฏิเสธ</button>
              <button type="button" class="btn btn-approve-footer" @click="requestRegAction(regDetailRow!, 'approve')">อนุมัติลงทะเบียน</button>
            </template>
          </template>
          <div v-if="regDetailRow" class="detail-body">
            <div class="detail-row"><span class="dl">รหัส</span><span class="id-badge">{{ regDetailRow.id }}</span></div>
            <div class="detail-row"><span class="dl">ชื่อ-นามสกุล</span><span class="dv">{{ regDetailRow.prefix }}{{ regDetailRow.studentName }}</span></div>
            <div class="detail-row"><span class="dl">วันเกิด</span><span class="dv">{{ regDetailRow.dob }}</span></div>
            <div class="detail-row"><span class="dl">เลขบัตรประชาชน</span><span class="dv">{{ regDetailRow.nationalId }}</span></div>
            <div class="detail-row"><span class="dl">ห้องที่ขอเข้า</span><span class="dv">{{ regDetailRow.targetClass }}</span></div>
            <div class="detail-row"><span class="dl">ผู้ปกครอง</span><span class="dv">{{ regDetailRow.parentName }}</span></div>
            <div class="detail-row"><span class="dl">โทรผู้ปกครอง</span><span class="dv">{{ regDetailRow.parentPhone }}</span></div>
            <div class="detail-row"><span class="dl">ลงทะเบียนโดย</span><span class="dv">{{ regDetailRow.registeredBy }} ({{ regDetailRow.registeredByRole }})</span></div>
            <div class="detail-row"><span class="dl">วันที่ยื่น</span><span class="dv">{{ regDetailRow.submittedAt }}</span></div>
            <div v-if="regDetailRow.processedAt" class="detail-row"><span class="dl">วันที่ดำเนินการ</span><span class="dv">{{ regDetailRow.processedAt }}</span></div>
            <div v-if="regDetailRow.note" class="detail-note">
              <span class="dl">หมายเหตุ</span><p>{{ regDetailRow.note }}</p>
            </div>
            <div class="detail-row">
              <span class="dl">สถานะ</span>
              <StaffStatusBadge :label="regDetailRow.status" :variant="regDetailRow.status === 'ลงทะเบียนแล้ว' ? 'approved' : regDetailRow.status === 'รอตรวจสอบ' ? 'pending' : 'default'" />
            </div>
          </div>
        </StaffAppModal>

        <!-- Confirm Reg Action Modal -->
        <StaffAppModal v-model="showRegConfirm" :title="regConfirmType === 'approve' ? 'ยืนยันการอนุมัติ' : 'ยืนยันการปฏิเสธ'" size="sm">
          <template #footer>
            <button type="button" class="btn btn-secondary" @click="showRegConfirm = false">ยกเลิก</button>
            <button
              type="button"
              class="btn"
              :class="regConfirmType === 'approve' ? 'btn-approve-footer' : 'btn-reject-footer'"
              @click="confirmRegAction"
            >{{ regConfirmType === 'approve' ? 'ยืนยันอนุมัติ' : 'ยืนยันปฏิเสธ' }}</button>
          </template>
          <p class="confirm-text" v-if="regConfirmTarget">
            {{ regConfirmType === 'approve' ? 'ยืนยันอนุมัติการลงทะเบียนของ' : 'ยืนยันปฏิเสธการลงทะเบียนของ' }}
            <strong>{{ regConfirmTarget.prefix }}{{ regConfirmTarget.studentName }}</strong>
            ใช่หรือไม่?
          </p>
        </StaffAppModal>
      </div>

      <!-- Transfers Tab -->
      <div v-if="activeTab === 'transfer'">
        <div class="filter-row">
          <div class="search-wrap">
            <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9ca3af" stroke-width="1.4"/><path d="M10 10l3 3" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/></svg>
            <input v-model="txSearch" class="input search" type="text" placeholder="ค้นหาชื่อนักเรียน หรือ โรงเรียน..." autocomplete="off" />
          </div>
          <select v-model="txFilterType" class="input sel">
            <option value="">ทุกประเภท</option>
            <option>ย้ายเข้า</option>
            <option>ย้ายออก</option>
          </select>
          <select v-model="txFilterStatus" class="input sel">
            <option value="">ทุกสถานะ</option>
            <option>รอดำเนินการ</option>
            <option>เสร็จสิ้น</option>
            <option>ยกเลิก</option>
          </select>
          <button v-if="txSearch || txFilterType || txFilterStatus" type="button" class="btn btn-clear" @click="clearTxFilters">ล้างตัวกรอง</button>
        </div>

        <StaffDataTable title="รายการย้ายเรียน" :columns="txCols" :rows="filteredTransfers">
          <template #cell-transferType="{ value }">
            <span :class="value === 'ย้ายเข้า' ? 'type-in' : 'type-out'">{{ value }}</span>
          </template>
          <template #cell-status="{ value }">
            <StaffStatusBadge
              :label="value as string"
              :variant="value === 'เสร็จสิ้น' ? 'approved' : value === 'รอดำเนินการ' ? 'pending' : 'default'"
            />
          </template>
          <template #rowActions="{ row }">
            <div class="action-btns">
              <button type="button" class="btn btn-sm btn-detail" @click="navigateTo('/staff/registrar/' + (row as unknown as TransferRow).id)">รายละเอียด</button>
              <button
                v-if="(row as unknown as TransferRow).status === 'รอดำเนินการ'"
                type="button" class="btn btn-sm btn-approve"
                @click="requestTransferComplete(row as unknown as TransferRow)"
              >ดำเนินการเสร็จ</button>
            </div>
          </template>
        </StaffDataTable>

        <!-- Transfer Detail Modal -->
        <StaffAppModal v-model="showTxDetail" title="รายละเอียดการย้ายเรียน" size="md">
          <template #footer>
            <button type="button" class="btn btn-secondary" @click="showTxDetail = false">ปิด</button>
            <button v-if="txDetailRow?.status === 'รอดำเนินการ'" type="button" class="btn btn-approve-footer" @click="requestTransferComplete(txDetailRow!)">ดำเนินการเสร็จ</button>
          </template>
          <div v-if="txDetailRow" class="detail-body">
            <div class="detail-row"><span class="dl">รหัส</span><span class="id-badge">{{ txDetailRow.id }}</span></div>
            <div class="detail-row"><span class="dl">ชื่อนักเรียน</span><span class="dv">{{ txDetailRow.studentName }}</span></div>
            <div class="detail-row"><span class="dl">ห้องปัจจุบัน</span><span class="dv">{{ txDetailRow.currentClass }}</span></div>
            <div class="detail-row">
              <span class="dl">ประเภท</span>
              <span :class="txDetailRow.transferType === 'ย้ายเข้า' ? 'type-in' : 'type-out'">{{ txDetailRow.transferType }}</span>
            </div>
            <div class="detail-row"><span class="dl">{{ txDetailRow.transferType === 'ย้ายออก' ? 'โรงเรียนปลายทาง' : 'โรงเรียนต้นทาง' }}</span><span class="dv">{{ txDetailRow.targetSchool }}</span></div>
            <div class="detail-row"><span class="dl">เหตุผล</span><span class="dv">{{ txDetailRow.reason }}</span></div>
            <div class="detail-row"><span class="dl">วันที่ขอ</span><span class="dv">{{ txDetailRow.requestedAt }}</span></div>
            <div v-if="txDetailRow.completedAt" class="detail-row"><span class="dl">วันที่เสร็จ</span><span class="dv">{{ txDetailRow.completedAt }}</span></div>
            <div v-if="txDetailRow.handledBy" class="detail-row"><span class="dl">ดำเนินการโดย</span><span class="dv">{{ txDetailRow.handledBy }}</span></div>
            <div class="detail-row">
              <span class="dl">สถานะ</span>
              <StaffStatusBadge :label="txDetailRow.status" :variant="txDetailRow.status === 'เสร็จสิ้น' ? 'approved' : txDetailRow.status === 'รอดำเนินการ' ? 'pending' : 'default'" />
            </div>
          </div>
        </StaffAppModal>

        <!-- Confirm Transfer Action Modal -->
        <StaffAppModal v-model="showTxConfirm" title="ยืนยันดำเนินการย้ายเรียน" size="sm">
          <template #footer>
            <button type="button" class="btn btn-secondary" @click="showTxConfirm = false">ยกเลิก</button>
            <button type="button" class="btn btn-approve-footer" @click="confirmTransferComplete">ยืนยันดำเนินการเสร็จ</button>
          </template>
          <p class="confirm-text" v-if="txConfirmTarget">
            ยืนยันว่ารายการย้ายเรียนของ <strong>{{ txConfirmTarget.studentName }}</strong>
            ดำเนินการเสร็จสิ้นแล้วใช่หรือไม่?
          </p>
        </StaffAppModal>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRegistrarData, type RegistrationRow, type TransferRow } from '~/composables/useRegistrarData'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()
const { registrations, transfers } = useRegistrarData()

const activeTab = ref<'reg' | 'transfer'>('reg')
const handledBy = 'นางสาวสมใจ รักงาน'

// --- Registrations ---
const regSearch = ref('')
const regFilterStatus = ref('')
const regFilterClass = ref('')
const showRegDetail = ref(false)
const regDetailRow = ref<RegistrationRow | null>(null)
const showRegConfirm = ref(false)
const regConfirmType = ref<'approve' | 'reject'>('approve')
const regConfirmTarget = ref<RegistrationRow | null>(null)

const regCols = [
  { key: 'id', label: 'รหัส' },
  { key: 'studentName', label: 'ชื่อนักเรียน' },
  { key: 'targetClass', label: 'ห้องที่ขอ' },
  { key: 'parentName', label: 'ผู้ปกครอง' },
  { key: 'submittedAt', label: 'วันที่ยื่น' },
  { key: 'status', label: 'สถานะ' },
]

const filteredRegs = computed(() =>
  registrations.value.filter(r => {
    const q = regSearch.value.toLowerCase()
    const matchSearch = !q || r.studentName.toLowerCase().includes(q)
    const matchStatus = !regFilterStatus.value || r.status === regFilterStatus.value
    const matchClass = !regFilterClass.value || r.targetClass === regFilterClass.value
    return matchSearch && matchStatus && matchClass
  })
)

const pendingRegCount = computed(() => registrations.value.filter(r => r.status === 'รอตรวจสอบ').length)

function openRegDetail(row: RegistrationRow) { regDetailRow.value = row; showRegDetail.value = true }

function requestRegAction(row: RegistrationRow, type: 'approve' | 'reject') {
  regConfirmTarget.value = row
  regConfirmType.value = type
  showRegConfirm.value = true
}

function approveReg(row: RegistrationRow) {
  const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
  const idx = registrations.value.findIndex(r => r.id === row.id)
  if (idx !== -1) registrations.value[idx] = { ...registrations.value[idx], status: 'ลงทะเบียนแล้ว', processedAt: today }
  showRegDetail.value = false
}

function rejectReg(row: RegistrationRow) {
  const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
  const idx = registrations.value.findIndex(r => r.id === row.id)
  if (idx !== -1) registrations.value[idx] = { ...registrations.value[idx], status: 'ปฏิเสธ', processedAt: today }
  showRegDetail.value = false
}

function confirmRegAction() {
  if (!regConfirmTarget.value) return
  if (regConfirmType.value === 'approve') approveReg(regConfirmTarget.value)
  else rejectReg(regConfirmTarget.value)
  showRegConfirm.value = false
  regConfirmTarget.value = null
}

function clearRegFilters() { regSearch.value = ''; regFilterStatus.value = ''; regFilterClass.value = '' }

// --- Transfers ---
const txSearch = ref('')
const txFilterType = ref('')
const txFilterStatus = ref('')
const showTxDetail = ref(false)
const txDetailRow = ref<TransferRow | null>(null)
const showTxConfirm = ref(false)
const txConfirmTarget = ref<TransferRow | null>(null)

const txCols = [
  { key: 'id', label: 'รหัส' },
  { key: 'studentName', label: 'ชื่อนักเรียน' },
  { key: 'currentClass', label: 'ห้องปัจจุบัน' },
  { key: 'transferType', label: 'ประเภท' },
  { key: 'targetSchool', label: 'โรงเรียน' },
  { key: 'requestedAt', label: 'วันที่ขอ' },
  { key: 'status', label: 'สถานะ' },
]

const filteredTransfers = computed(() =>
  transfers.value.filter(r => {
    const q = txSearch.value.toLowerCase()
    const matchSearch = !q || r.studentName.toLowerCase().includes(q) || r.targetSchool.toLowerCase().includes(q)
    const matchType = !txFilterType.value || r.transferType === txFilterType.value
    const matchStatus = !txFilterStatus.value || r.status === txFilterStatus.value
    return matchSearch && matchType && matchStatus
  })
)

const pendingTransferCount = computed(() => transfers.value.filter(r => r.status === 'รอดำเนินการ').length)

function openTxDetail(row: TransferRow) { txDetailRow.value = row; showTxDetail.value = true }

function requestTransferComplete(row: TransferRow) {
  txConfirmTarget.value = row
  showTxConfirm.value = true
}

function completeTransfer(row: TransferRow) {
  const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
  const idx = transfers.value.findIndex(r => r.id === row.id)
  if (idx !== -1) transfers.value[idx] = { ...transfers.value[idx], status: 'เสร็จสิ้น', completedAt: today, handledBy }
  showTxDetail.value = false
}

function confirmTransferComplete() {
  if (!txConfirmTarget.value) return
  completeTransfer(txConfirmTarget.value)
  showTxConfirm.value = false
  txConfirmTarget.value = null
}

function clearTxFilters() { txSearch.value = ''; txFilterType.value = ''; txFilterStatus.value = '' }
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
.sel { width: auto; min-width: 140px; flex: none; }

.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 7px; padding: 7px 14px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: background 0.12s; white-space: nowrap; }
.btn-secondary { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-secondary:hover { background: #f9fafb; }
.btn-clear { background: #fff; color: #6b7280; border-color: #e5e7eb; }
.btn-clear:hover { background: #f9fafb; }
.btn-sm { padding: 5px 10px; font-size: 0.8rem; }
.btn-detail { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-detail:hover { background: #f9fafb; }
.btn-approve { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
.btn-approve:hover { background: #dcfce7; }
.btn-approve-footer { background: #16a34a; color: #fff; border-color: #16a34a; }
.btn-approve-footer:hover { background: #15803d; }
.btn-reject { background: #fff5f5; color: #dc2626; border-color: #fecaca; }
.btn-reject:hover { background: #fee2e2; }
.btn-reject-footer { background: #dc2626; color: #fff; border-color: #dc2626; }
.btn-reject-footer:hover { background: #b91c1c; }

.action-btns { display: flex; gap: 6px; justify-content: flex-end; flex-wrap: nowrap; }

.type-in { background: #f0fdf4; color: #16a34a; padding: 2px 8px; border-radius: 9999px; font-size: 0.78rem; font-weight: 600; }
.type-out { background: #fef2f2; color: #dc2626; padding: 2px 8px; border-radius: 9999px; font-size: 0.78rem; font-weight: 600; }

.detail-body { display: flex; flex-direction: column; gap: 12px; }
.detail-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.dl { font-size: 0.8rem; color: #9ca3af; font-weight: 500; min-width: 140px; }
.dv { font-size: 0.875rem; color: #111827; font-weight: 500; }
.detail-note { display: flex; flex-direction: column; gap: 4px; background: #fffbeb; border-radius: 8px; padding: 10px 12px; }
.detail-note p { margin: 0; font-size: 0.875rem; color: #374151; }
.id-badge { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; padding: 2px 8px; font-size: 0.8rem; font-family: monospace; color: #374151; }
</style>
