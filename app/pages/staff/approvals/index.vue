<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :rows="4" :cols="6" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">คำขออนุมัติ</h2>
          <p class="page-desc">รายการคำขอจากครูและบุคคลากรที่รอการพิจารณา</p>
        </div>
      </div>

      <!-- Summary -->
      <div class="summary-row">
        <div v-for="s in summaryStats" :key="s.key" :class="`stat-card stat-${s.key}`">
          <span class="stat-num">{{ s.count }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>

      <div class="filter-row">
        <div class="search-wrap">
          <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9ca3af" stroke-width="1.4"/><path d="M10 10l3 3" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/></svg>
          <input v-model="search" class="input search" type="text" placeholder="ค้นหาประเภท หรือ ผู้ส่งคำขอ..." autocomplete="off" />
        </div>
        <select v-model="filterStatus" class="input sel">
          <option value="">ทุกสถานะ</option>
          <option>รอดำเนินการ</option>
          <option>อนุมัติแล้ว</option>
          <option>ปฏิเสธ</option>
          <option>ต้องการข้อมูลเพิ่มเติม</option>
        </select>
        <select v-model="filterPriority" class="input sel">
          <option value="">ทุกระดับความเร่งด่วน</option>
          <option>ด่วนมาก</option>
          <option>ด่วน</option>
          <option>ปกติ</option>
        </select>
        <button v-if="search || filterStatus || filterPriority" type="button" class="btn btn-clear" @click="clearFilters">ล้างตัวกรอง</button>
      </div>

      <StaffDataTable title="รายการคำขอที่ได้รับ" :columns="cols" :rows="filteredRows">
        <template #cell-status="{ value }">
          <StaffStatusBadge
            :label="value as string"
            :variant="value === 'อนุมัติแล้ว' ? 'approved' : value === 'รอดำเนินการ' ? 'pending' : value === 'ปฏิเสธ' ? 'rejected' : 'default'"
          />
        </template>
        <template #cell-priority="{ value }">
          <span :class="`priority-badge priority-${value === 'ด่วนมาก' ? 'urgent' : value === 'ด่วน' ? 'high' : 'normal'}`">{{ value }}</span>
        </template>
        <template #rowActions="{ row }">
          <div class="action-btns">
            <button type="button" class="btn btn-sm btn-detail" @click="navigateTo('/staff/approvals/' + (row as unknown as ApprovalInboxRow).id)">รายละเอียด</button>
            <template v-if="(row as unknown as ApprovalInboxRow).status === 'รอดำเนินการ'">
              <button type="button" class="btn btn-sm btn-approve" @click="openApprove(row as unknown as ApprovalInboxRow)">อนุมัติ</button>
              <button type="button" class="btn btn-sm btn-reject" @click="openReject(row as unknown as ApprovalInboxRow)">ปฏิเสธ</button>
            </template>
          </div>
        </template>
      </StaffDataTable>

      <!-- Detail Modal -->
      <StaffAppModal v-model="showDetail" title="รายละเอียดคำขอ" size="md">
        <template #footer>
          <button type="button" class="btn btn-secondary" @click="showDetail = false">ปิด</button>
          <template v-if="detailRow?.status === 'รอดำเนินการ'">
            <button type="button" class="btn btn-reject-footer" @click="switchToReject">ปฏิเสธ</button>
            <button type="button" class="btn btn-approve-footer" @click="switchToApprove">อนุมัติ</button>
          </template>
        </template>
        <div class="detail-body" v-if="detailRow">
          <div class="detail-row"><span class="detail-label">ประเภทคำขอ</span><span class="detail-value">{{ detailRow.type }}</span></div>
          <div class="detail-row"><span class="detail-label">ผู้ส่งคำขอ</span><span class="detail-value">{{ detailRow.requesterName }}</span></div>
          <div class="detail-row"><span class="detail-label">บทบาท</span><span class="detail-value">{{ detailRow.requesterRole }}</span></div>
          <div class="detail-row"><span class="detail-label">ความเร่งด่วน</span>
            <span :class="`priority-badge priority-${detailRow.priority === 'ด่วนมาก' ? 'urgent' : detailRow.priority === 'ด่วน' ? 'high' : 'normal'}`">{{ detailRow.priority }}</span>
          </div>
          <div class="detail-row"><span class="detail-label">วันที่ส่ง</span><span class="detail-value">{{ detailRow.submittedAt }}</span></div>
          <div class="detail-section">
            <span class="detail-label">รายละเอียด</span>
            <p class="detail-text">{{ detailRow.description }}</p>
          </div>
          <div v-if="detailRow.attachments.length" class="detail-section">
            <span class="detail-label">เอกสารแนบ</span>
            <ul class="attach-list">
              <li v-for="a in detailRow.attachments" :key="a" class="attach-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 1h6l3 3v9H3V1z" stroke="#6b7280" stroke-width="1.3"/><path d="M9 1v3h3" stroke="#6b7280" stroke-width="1.3"/></svg>
                {{ a }}
              </li>
            </ul>
          </div>
          <div v-if="detailRow.resolvedAt" class="detail-row"><span class="detail-label">วันที่ดำเนินการ</span><span class="detail-value">{{ detailRow.resolvedAt }}</span></div>
          <div v-if="detailRow.resolvedBy" class="detail-row"><span class="detail-label">ดำเนินการโดย</span><span class="detail-value">{{ detailRow.resolvedBy }}</span></div>
          <div v-if="detailRow.remark" class="detail-remark">
            <span class="detail-label">หมายเหตุ</span>
            <p>{{ detailRow.remark }}</p>
          </div>
          <div class="detail-row">
            <span class="detail-label">สถานะ</span>
            <StaffStatusBadge :label="detailRow.status" :variant="detailRow.status === 'อนุมัติแล้ว' ? 'approved' : detailRow.status === 'รอดำเนินการ' ? 'pending' : detailRow.status === 'ปฏิเสธ' ? 'rejected' : 'default'" />
          </div>
        </div>
      </StaffAppModal>

      <!-- Approve Modal -->
      <StaffAppModal v-model="showApprove" title="อนุมัติคำขอ" size="sm">
        <template #footer>
          <button type="button" class="btn btn-secondary" @click="showApprove = false">ยกเลิก</button>
          <button type="button" class="btn btn-approve-footer" @click="doApprove">ยืนยันการอนุมัติ</button>
        </template>
        <div class="action-form">
          <p class="action-desc">อนุมัติคำขอ: <strong>{{ actionTarget?.type }}</strong><br/>จาก: {{ actionTarget?.requesterName }}</p>
          <label class="form-label">หมายเหตุ (ถ้ามี)</label>
          <textarea v-model="actionRemark" class="input textarea" rows="3" placeholder="ระบุหมายเหตุหรือเงื่อนไข..." />
        </div>
      </StaffAppModal>

      <!-- Reject Modal -->
      <StaffAppModal v-model="showReject" title="ปฏิเสธคำขอ" size="sm">
        <template #footer>
          <button type="button" class="btn btn-secondary" @click="showReject = false">ยกเลิก</button>
          <button type="button" class="btn btn-danger" @click="doReject">ยืนยันการปฏิเสธ</button>
        </template>
        <div class="action-form">
          <p class="action-desc">ปฏิเสธคำขอ: <strong>{{ actionTarget?.type }}</strong><br/>จาก: {{ actionTarget?.requesterName }}</p>
          <label class="form-label">เหตุผลในการปฏิเสธ <span class="req">*</span></label>
          <textarea v-model="actionRemark" class="input textarea" rows="3" placeholder="ระบุเหตุผลในการปฏิเสธ..." />
        </div>
      </StaffAppModal>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApprovalsInboxData, type ApprovalInboxRow } from '~/composables/useApprovalsInboxData'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()
const { rows } = useApprovalsInboxData()

const search = ref('')
const filterStatus = ref('')
const filterPriority = ref('')
const showDetail = ref(false)
const showApprove = ref(false)
const showReject = ref(false)
const detailRow = ref<ApprovalInboxRow | null>(null)
const actionTarget = ref<ApprovalInboxRow | null>(null)
const actionRemark = ref('')

const resolvedBy = 'นางสาวสมใจ รักงาน'

const cols = [
  { key: 'submittedAt', label: 'วันที่ส่ง' },
  { key: 'type', label: 'ประเภทคำขอ' },
  { key: 'requesterName', label: 'ผู้ส่ง' },
  { key: 'priority', label: 'ความเร่งด่วน' },
  { key: 'status', label: 'สถานะ' },
]

const filteredRows = computed(() =>
  rows.value.filter(r => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || r.type.toLowerCase().includes(q) || r.requesterName.toLowerCase().includes(q)
    const matchStatus = !filterStatus.value || r.status === filterStatus.value
    const matchPriority = !filterPriority.value || r.priority === filterPriority.value
    return matchSearch && matchStatus && matchPriority
  })
)

const summaryStats = computed(() => [
  { key: 'pending', label: 'รอดำเนินการ', count: rows.value.filter(r => r.status === 'รอดำเนินการ').length },
  { key: 'approved', label: 'อนุมัติแล้ว', count: rows.value.filter(r => r.status === 'อนุมัติแล้ว').length },
  { key: 'rejected', label: 'ปฏิเสธ', count: rows.value.filter(r => r.status === 'ปฏิเสธ').length },
  { key: 'info', label: 'ต้องการข้อมูลเพิ่ม', count: rows.value.filter(r => r.status === 'ต้องการข้อมูลเพิ่มเติม').length },
])

function openDetail(row: ApprovalInboxRow) { detailRow.value = row; showDetail.value = true }

function openApprove(row: ApprovalInboxRow) {
  actionTarget.value = row
  actionRemark.value = ''
  showApprove.value = true
}

function openReject(row: ApprovalInboxRow) {
  actionTarget.value = row
  actionRemark.value = ''
  showReject.value = true
}

function switchToApprove() {
  if (detailRow.value) { showDetail.value = false; openApprove(detailRow.value) }
}

function switchToReject() {
  if (detailRow.value) { showDetail.value = false; openReject(detailRow.value) }
}

function doApprove() {
  if (!actionTarget.value) return
  const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
  const idx = rows.value.findIndex(r => r.id === actionTarget.value!.id)
  if (idx !== -1) {
    rows.value[idx] = { ...rows.value[idx], status: 'อนุมัติแล้ว', resolvedAt: today, resolvedBy, remark: actionRemark.value }
  }
  showApprove.value = false
}

function doReject() {
  if (!actionTarget.value) return
  const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
  const idx = rows.value.findIndex(r => r.id === actionTarget.value!.id)
  if (idx !== -1) {
    rows.value[idx] = { ...rows.value[idx], status: 'ปฏิเสธ', resolvedAt: today, resolvedBy, remark: actionRemark.value }
  }
  showReject.value = false
}

function clearFilters() { search.value = ''; filterStatus.value = ''; filterPriority.value = '' }
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 0; }
.page-header { margin-bottom: 24px; display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.page-title { font-size: 1.3rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
.page-desc { font-size: 0.875rem; color: #6b7280; margin: 0; }

.summary-row { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.stat-card { flex: 1; min-width: 110px; border-radius: 10px; padding: 14px 18px; display: flex; flex-direction: column; gap: 2px; }
.stat-num { font-size: 1.5rem; font-weight: 700; }
.stat-label { font-size: 0.78rem; font-weight: 500; }
.stat-pending { background: #fefce8; color: #a16207; }
.stat-pending .stat-num { color: #eab308; }
.stat-approved { background: #f0fdf4; color: #15803d; }
.stat-approved .stat-num { color: #22c55e; }
.stat-rejected { background: #fef2f2; color: #b91c1c; }
.stat-rejected .stat-num { color: #ef4444; }
.stat-info { background: #eff6ff; color: #1d4ed8; }
.stat-info .stat-num { color: #3b82f6; }

.filter-row { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); }

.input { width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; font-family: inherit; color: #111827; background: #fff; outline: none; transition: border-color 0.15s; box-sizing: border-box; }
.input:focus { border-color: #1d4ed8; }
.search { padding-left: 34px; }
.sel { width: auto; min-width: 150px; flex: none; }
.textarea { resize: vertical; min-height: 80px; }

.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 7px; padding: 7px 14px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: background 0.12s; white-space: nowrap; }
.btn-secondary { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-secondary:hover { background: #f9fafb; }
.btn-clear { background: #fff; color: #6b7280; border-color: #e5e7eb; }
.btn-clear:hover { background: #f9fafb; }
.btn-danger { background: #dc2626; color: #fff; border-color: #dc2626; }
.btn-danger:hover { background: #b91c1c; }
.btn-sm { padding: 5px 10px; font-size: 0.8rem; }
.btn-detail { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-detail:hover { background: #f9fafb; }
.btn-approve { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
.btn-approve:hover { background: #dcfce7; }
.btn-approve-footer { background: #16a34a; color: #fff; border-color: #16a34a; }
.btn-approve-footer:hover { background: #15803d; }
.btn-reject { background: #fff5f5; color: #dc2626; border-color: #fecaca; }
.btn-reject:hover { background: #fee2e2; }
.btn-reject-footer { background: #fff; color: #dc2626; border-color: #fecaca; }
.btn-reject-footer:hover { background: #fee2e2; }

.action-btns { display: flex; gap: 6px; justify-content: flex-end; flex-wrap: nowrap; }

.priority-badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
.priority-urgent { background: #fef2f2; color: #dc2626; }
.priority-high { background: #fefce8; color: #d97706; }
.priority-normal { background: #f0fdf4; color: #16a34a; }

.detail-body { display: flex; flex-direction: column; gap: 12px; }
.detail-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.detail-label { font-size: 0.8rem; color: #9ca3af; font-weight: 600; min-width: 130px; }
.detail-value { font-size: 0.875rem; color: #111827; font-weight: 500; }
.detail-section { display: flex; flex-direction: column; gap: 6px; }
.detail-text { font-size: 0.875rem; color: #374151; margin: 0; line-height: 1.6; background: #f9fafb; padding: 10px; border-radius: 8px; }
.detail-remark { background: #fffbeb; border-radius: 8px; padding: 10px 14px; }
.detail-remark p { margin: 4px 0 0; font-size: 0.875rem; color: #374151; }
.attach-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.attach-item { display: flex; align-items: center; gap: 6px; font-size: 0.83rem; color: #374151; background: #f9fafb; padding: 6px 10px; border-radius: 6px; }

.action-form { display: flex; flex-direction: column; gap: 12px; }
.action-desc { margin: 0; font-size: 0.875rem; color: #374151; line-height: 1.6; background: #f9fafb; padding: 10px; border-radius: 8px; }
.form-label { font-size: 0.8rem; font-weight: 600; color: #374151; }
.req { color: #ef4444; }
</style>
