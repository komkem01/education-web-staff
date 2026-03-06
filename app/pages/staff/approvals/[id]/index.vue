<template>
  <div class="page">
    <div class="back-row">
      <button type="button" class="btn-back" @click="navigateTo('/staff/approvals')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        กลับรายการคำขอ
      </button>
    </div>

    <div v-if="!req" class="not-found">
      <p>ไม่พบคำขอ {{ id }}</p>
      <button type="button" class="btn btn-secondary" @click="navigateTo('/staff/approvals')">กลับ</button>
    </div>

    <template v-else>
      <!-- Request Header -->
      <div class="req-card">
        <div class="req-header-content">
          <div>
            <div class="req-meta">
              <span class="id-badge">{{ req.id }}</span>
              <span :class="priorityClass(req.priority)">{{ req.priority }}</span>
            </div>
            <h2 class="req-title">{{ req.type }}</h2>
            <p class="req-from">ยื่นโดย: <strong>{{ req.requesterName }}</strong> · {{ req.requesterRole }} · {{ req.submittedAt }}</p>
          </div>
          <StaffStatusBadge
            :label="req.status"
            :variant="req.status === 'อนุมัติแล้ว' ? 'approved' : req.status === 'รอดำเนินการ' ? 'pending' : req.status === 'ปฏิเสธ' ? 'rejected' : 'default'"
          />
        </div>

        <!-- Action Buttons -->
        <div v-if="req.status === 'รอดำเนินการ'" class="action-bar">
          <button type="button" class="btn btn-reject" @click="handleReject">ปฏิเสธ</button>
          <button type="button" class="btn btn-info" @click="handleNeedInfo">ขอข้อมูลเพิ่มเติม</button>
          <button type="button" class="btn btn-approve" @click="handleApprove">อนุมัติ</button>
        </div>
        <div v-else-if="req.resolvedAt" class="resolved-info">
          ดำเนินการเมื่อ {{ req.resolvedAt }} โดย {{ req.resolvedBy || 'ระบบ' }}
        </div>
      </div>

      <!-- Detail Sections -->
      <div class="sections">
        <!-- Request Details -->
        <div class="section-card wide">
          <h3 class="section-title">รายละเอียดคำขอ</h3>
          <p class="desc-text">{{ req.description }}</p>
          <div v-if="req.attachments.length" class="attachments">
            <span class="att-label">ไฟล์แนบ:</span>
            <span v-for="att in req.attachments" :key="att" class="att-chip">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M7 1H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V5L7 1z" stroke="#6b7280" stroke-width="1.2" fill="none"/><path d="M7 1v4h4" stroke="#6b7280" stroke-width="1.2"/></svg>
              {{ att }}
            </span>
          </div>
        </div>

        <!-- Status Info -->
        <div class="section-card">
          <h3 class="section-title">ข้อมูลสถานะ</h3>
          <div class="field"><span class="fl">สถานะ</span>
            <StaffStatusBadge :label="req.status" :variant="req.status === 'อนุมัติแล้ว' ? 'approved' : req.status === 'รอดำเนินการ' ? 'pending' : req.status === 'ปฏิเสธ' ? 'rejected' : 'default'" />
          </div>
          <div class="field"><span class="fl">ความสำคัญ</span><span :class="priorityClass(req.priority)">{{ req.priority }}</span></div>
          <div class="field"><span class="fl">วันที่ยื่น</span><span class="fv">{{ req.submittedAt }}</span></div>
          <div v-if="req.resolvedAt" class="field"><span class="fl">วันที่ดำเนินการ</span><span class="fv">{{ req.resolvedAt }}</span></div>
          <div v-if="req.resolvedBy" class="field"><span class="fl">ดำเนินการโดย</span><span class="fv">{{ req.resolvedBy }}</span></div>
        </div>
      </div>

      <!-- Remark / Note -->
      <div v-if="req.remark" class="remark-card">
        <h3 class="section-title">หมายเหตุจากบุคลากร</h3>
        <p class="remark-text">{{ req.remark }}</p>
      </div>

      <!-- Remark Input when acting -->
      <div v-if="showRemarkInput" class="remark-input-section">
        <label class="form-label">หมายเหตุ (ไม่บังคับ)</label>
        <textarea v-model="remarkText" class="input textarea" rows="3" placeholder="ระบุเหตุผลหรือหมายเหตุ..." />
        <div class="remark-actions">
          <button type="button" class="btn btn-cancel" @click="showRemarkInput = false; pendingAction = ''">ยกเลิก</button>
          <button type="button" class="btn btn-confirm" @click="confirmAction">ยืนยัน{{ pendingAction === 'approve' ? 'อนุมัติ' : pendingAction === 'reject' ? 'ปฏิเสธ' : 'ขอข้อมูลเพิ่มเติม' }}</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApprovalsInboxData, type ApprovalInboxRow } from '~/composables/useApprovalsInboxData'

definePageMeta({ layout: 'staff' })

const route = useRoute()
const id = route.params.id as string
const { rows } = useApprovalsInboxData()

const req = computed(() => rows.value.find(r => r.id === id))

const showRemarkInput = ref(false)
const pendingAction = ref<'approve' | 'reject' | 'info' | ''>('')
const remarkText = ref('')
const resolvedBy = 'นางสาวสมใจ รักงาน'

function priorityClass(p: string) {
  return p === 'ด่วนมาก' ? 'priority-critical' : p === 'ด่วน' ? 'priority-high' : 'priority-normal'
}

function handleApprove() { pendingAction.value = 'approve'; showRemarkInput.value = true }
function handleReject() { pendingAction.value = 'reject'; showRemarkInput.value = true }
function handleNeedInfo() { pendingAction.value = 'info'; showRemarkInput.value = true }

function confirmAction() {
  const idx = rows.value.findIndex(r => r.id === id)
  if (idx === -1) return
  const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
  const update: Partial<ApprovalInboxRow> = {
    status: pendingAction.value === 'approve' ? 'อนุมัติแล้ว' : pendingAction.value === 'reject' ? 'ปฏิเสธ' : 'ต้องการข้อมูลเพิ่มเติม',
    resolvedAt: today,
    resolvedBy,
    remark: remarkText.value,
  }
  rows.value[idx] = { ...rows.value[idx], ...update }
  showRemarkInput.value = false
  pendingAction.value = ''
  remarkText.value = ''
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }
.back-row { display: flex; }
.btn-back { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: #1d4ed8; font-size: 0.875rem; font-weight: 500; cursor: pointer; padding: 6px 0; font-family: inherit; }
.btn-back:hover { text-decoration: underline; }
.not-found { text-align: center; padding: 60px 0; color: #6b7280; }

.req-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.req-header-content { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; }
.req-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.id-badge { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 5px; padding: 2px 8px; font-size: 0.75rem; font-family: monospace; color: #374151; }
.req-title { font-size: 1.2rem; font-weight: 700; color: #111827; margin: 0 0 6px; }
.req-from { font-size: 0.875rem; color: #6b7280; margin: 0; }

.priority-critical { background: #fef2f2; color: #dc2626; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; }
.priority-high { background: #fff7ed; color: #ea580c; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; }
.priority-normal { background: #f3f4f6; color: #6b7280; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }

.action-bar { display: flex; gap: 10px; flex-wrap: wrap; padding-top: 8px; border-top: 1px solid #f3f4f6; }
.resolved-info { font-size: 0.8rem; color: #6b7280; padding-top: 8px; border-top: 1px solid #f3f4f6; }

.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 8px; padding: 9px 18px; font-size: 0.875rem; font-weight: 600; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: background 0.12s; }
.btn-approve { background: #16a34a; color: #fff; }
.btn-approve:hover { background: #15803d; }
.btn-reject { background: #fff; color: #dc2626; border-color: #fecaca; }
.btn-reject:hover { background: #fef2f2; }
.btn-info { background: #fff; color: #1d4ed8; border-color: #bfdbfe; }
.btn-info:hover { background: #eff6ff; }
.btn-secondary { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-secondary:hover { background: #f9fafb; }
.btn-cancel { background: #fff; color: #6b7280; border-color: #e5e7eb; }
.btn-cancel:hover { background: #f9fafb; }
.btn-confirm { background: #1d4ed8; color: #fff; }
.btn-confirm:hover { background: #1e40af; }

.sections { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.section-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; }
.section-card.wide { grid-column: 1 / -1; }
.section-title { font-size: 0.875rem; font-weight: 700; color: #111827; margin: 0 0 14px; padding-bottom: 10px; border-bottom: 1px solid #f3f4f6; }
.desc-text { font-size: 0.9rem; color: #374151; line-height: 1.6; margin: 0 0 12px; }
.attachments { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.att-label { font-size: 0.8rem; color: #9ca3af; }
.att-chip { display: inline-flex; align-items: center; gap: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; padding: 3px 9px; font-size: 0.8rem; color: #374151; }
.field { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid #f9fafb; }
.field:last-child { border-bottom: none; }
.fl { font-size: 0.8rem; color: #9ca3af; min-width: 120px; }
.fv { font-size: 0.875rem; color: #111827; font-weight: 500; text-align: right; }

.remark-card { background: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; padding: 16px 20px; }
.remark-text { margin: 8px 0 0; font-size: 0.875rem; color: #374151; line-height: 1.5; }

.remark-input-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
.form-label { font-size: 0.8rem; font-weight: 600; color: #374151; }
.input { width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; font-family: inherit; color: #111827; background: #fff; outline: none; box-sizing: border-box; }
.input:focus { border-color: #1d4ed8; }
.textarea { resize: vertical; }
.remark-actions { display: flex; justify-content: flex-end; gap: 10px; }
</style>
