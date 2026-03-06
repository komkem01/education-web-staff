<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :show-cards="true" :rows="4" :cols="5" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">ยินดีต้อนรับ นางสาวสมใจ รักงาน</h2>
          <p class="page-desc">เจ้าหน้าที่บุคลากร · โรงเรียนตัวอย่างวิทยา · ปีการศึกษา 2568</p>
        </div>
      </div>

      <!-- Metric Cards -->
      <div class="grid-4 section-gap">
        <StaffMetricCard icon="📋" label="คำขอรออนุมัติ" :value="String(pendingApprovals)" sub="คำขอจากครูและบุคลากร" :trend="1" accent="#1d4ed8" />
        <StaffMetricCard icon="👤" label="ลงทะเบียนนักเรียนใหม่" :value="String(newRegistrations)" sub="รอตรวจสอบ" :trend="1" accent="#16a34a" />
        <StaffMetricCard icon="📄" label="คำขอเอกสารรอดำเนินการ" :value="String(pendingDocs)" sub="เอกสารราชการ" :trend="0" accent="#f59e0b" />
        <StaffMetricCard icon="🧑‍🏫" label="ครูทั้งหมด" :value="String(totalTeachers)" :sub="`อนุมัติแล้ว ${approvedTeachers} คน`" :trend="0" accent="#8b5cf6" />
      </div>

      <!-- Mid stats + Quick Links -->
      <div class="grid-3 section-gap">
        <!-- Student summary -->
        <div class="stat-card">
          <div class="stat-label">ภาพรวมนักเรียน</div>
          <div class="stat-row"><span>นักเรียนทั้งหมด</span><strong>{{ totalStudents }}</strong></div>
          <div class="stat-row"><span>สถานะปกติ</span><strong>{{ normalStudents }}</strong></div>
          <div class="stat-row"><span>รออนุมัติ</span><strong>{{ pendingStudents }}</strong></div>
          <NuxtLink to="/staff/students" class="stat-link">จัดการนักเรียน →</NuxtLink>
        </div>

        <!-- Registrar summary -->
        <div class="stat-card">
          <div class="stat-label">งานทะเบียน</div>
          <div class="stat-row"><span>ลงทะเบียนใหม่ทั้งหมด</span><strong>{{ totalRegistrations }}</strong></div>
          <div class="stat-row"><span>รอตรวจสอบ</span><strong>{{ pendingRegistrations }}</strong></div>
          <div class="stat-row"><span>ย้ายเรียนรอดำเนินการ</span><strong>{{ pendingTransfers }}</strong></div>
          <NuxtLink to="/staff/registrar" class="stat-link">ไปหน้างานทะเบียน →</NuxtLink>
        </div>

        <!-- Announcements summary -->
        <div class="stat-card">
          <div class="stat-label">ประกาศ</div>
          <div class="stat-row"><span>ประกาศทั้งหมด</span><strong>{{ totalAnnouncements }}</strong></div>
          <div class="stat-row"><span>เผยแพร่แล้ว</span><strong>{{ publishedAnnouncements }}</strong></div>
          <div class="stat-row"><span>ฉบับร่าง</span><strong>{{ draftAnnouncements }}</strong></div>
          <NuxtLink to="/staff/announcements" class="stat-link">จัดการประกาศ →</NuxtLink>
        </div>
      </div>

      <!-- Recent pending approvals -->
      <div class="section-gap">
        <div class="table-header-row">
          <h3 class="section-title">คำขอรออนุมัติล่าสุด</h3>
          <NuxtLink to="/staff/approvals" class="btn-ghost-sm">ดูทั้งหมด →</NuxtLink>
        </div>
        <div class="approvals-list">
          <div v-if="recentPending.length === 0" class="empty-state">ไม่มีคำขอรออนุมัติ 🎉</div>
          <div v-for="req in recentPending" :key="req.id" class="approval-row">
            <div class="approval-info">
              <div class="approval-type">{{ req.type }}</div>
              <div class="approval-meta">{{ req.requesterName }} · {{ req.submittedAt }}</div>
            </div>
            <div class="approval-right">
              <span :class="priorityClass(req.priority)">{{ req.priority }}</span>
              <NuxtLink :to="'/staff/approvals/' + req.id" class="btn-view-sm">ดูรายละเอียด</NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div>
        <h3 class="section-title" style="margin-bottom:14px">ทางลัด</h3>
        <div class="quick-links">
          <NuxtLink to="/staff/teachers" class="quick-link">
            <span class="ql-icon">👩‍🏫</span>
            <span class="ql-label">จัดการครู</span>
          </NuxtLink>
          <NuxtLink to="/staff/students" class="quick-link">
            <span class="ql-icon">🎓</span>
            <span class="ql-label">จัดการนักเรียน</span>
          </NuxtLink>
          <NuxtLink to="/staff/parents" class="quick-link">
            <span class="ql-icon">👪</span>
            <span class="ql-label">จัดการผู้ปกครอง</span>
          </NuxtLink>
          <NuxtLink to="/staff/approvals" class="quick-link">
            <span class="ql-icon">✅</span>
            <span class="ql-label">อนุมัติคำขอ</span>
          </NuxtLink>
          <NuxtLink to="/staff/documents" class="quick-link">
            <span class="ql-icon">📄</span>
            <span class="ql-label">เอกสาร</span>
          </NuxtLink>
          <NuxtLink to="/staff/registrar" class="quick-link">
            <span class="ql-icon">📝</span>
            <span class="ql-label">งานทะเบียน</span>
          </NuxtLink>
          <NuxtLink to="/staff/announcements" class="quick-link">
            <span class="ql-icon">📢</span>
            <span class="ql-label">ประกาศ</span>
          </NuxtLink>
          <NuxtLink to="/staff/reports" class="quick-link">
            <span class="ql-icon">📊</span>
            <span class="ql-label">รายงาน</span>
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTeachersData } from '~/composables/useTeachersData'
import { useStudentsData } from '~/composables/useStudentsData'
import { useApprovalsInboxData } from '~/composables/useApprovalsInboxData'
import { useDocumentsData } from '~/composables/useDocumentsData'
import { useRegistrarData } from '~/composables/useRegistrarData'
import { useAnnouncementsData } from '~/composables/useAnnouncementsData'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()

const { rows: teacherRows } = useTeachersData()
const { rows: studentRows } = useStudentsData()
const { rows: approvalRows } = useApprovalsInboxData()
const { requests: docRequests } = useDocumentsData()
const { registrations, transfers } = useRegistrarData()
const { rows: announcementRows } = useAnnouncementsData()

const totalTeachers = computed(() => teacherRows.value.length)
const approvedTeachers = computed(() => teacherRows.value.filter(t => t.status === 'อนุมัติแล้ว').length)
const totalStudents = computed(() => studentRows.value.length)
const normalStudents = computed(() => studentRows.value.filter(s => s.status === 'ปกติ').length)
const pendingStudents = computed(() => studentRows.value.filter(s => s.status === 'รออนุมัติ').length)
const pendingApprovals = computed(() => approvalRows.value.filter(r => r.status === 'รอดำเนินการ').length)
const pendingDocs = computed(() => docRequests.value.filter(r => r.status === 'ร้องขอ' || r.status === 'กำลังดำเนินการ').length)
const newRegistrations = computed(() => registrations.value.filter(r => r.status === 'รอตรวจสอบ').length)
const totalRegistrations = computed(() => registrations.value.length)
const pendingRegistrations = computed(() => registrations.value.filter(r => r.status === 'รอตรวจสอบ').length)
const pendingTransfers = computed(() => transfers.value.filter(r => r.status === 'รอดำเนินการ').length)
const totalAnnouncements = computed(() => announcementRows.value.length)
const publishedAnnouncements = computed(() => announcementRows.value.filter(a => a.status === 'เผยแพร่แล้ว').length)
const draftAnnouncements = computed(() => announcementRows.value.filter(a => a.status === 'ฉบับร่าง').length)

const recentPending = computed(() =>
  approvalRows.value.filter(r => r.status === 'รอดำเนินการ').slice(0, 5)
)

function priorityClass(p: string) {
  return p === 'ด่วนมาก' ? 'priority-critical' : p === 'ด่วน' ? 'priority-high' : 'priority-normal'
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 0; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 1.3rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
.page-desc { font-size: 0.875rem; color: #6b7280; margin: 0; }
.section-gap { margin-bottom: 24px; }

.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 1100px) { .grid-4 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 700px) { .grid-4, .grid-3 { grid-template-columns: 1fr; } }

.stat-card { background: #fff; border: 1px solid #f1f3f4; border-radius: 12px; padding: 18px 20px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 1px 3px rgba(0,0,0,.04); }
.stat-label { font-size: 0.82rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.04em; }
.stat-row { display: flex; align-items: center; justify-content: space-between; font-size: 0.875rem; color: #374151; }
.stat-row strong { font-weight: 700; color: #111827; }
.stat-link { font-size: 0.8rem; color: #1d4ed8; font-weight: 500; margin-top: 4px; text-decoration: none; }
.stat-link:hover { color: #1e40af; }

.table-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.section-title { font-size: 0.97rem; font-weight: 600; color: #111827; }

.btn-ghost-sm { display: inline-flex; align-items: center; border-radius: 7px; padding: 6px 12px; font-size: 0.82rem; font-weight: 500; cursor: pointer; border: 1px solid #d1d5db; background: #fff; color: #374151; text-decoration: none; transition: background 0.12s; font-family: inherit; }
.btn-ghost-sm:hover { background: #f9fafb; }

.approvals-list { display: flex; flex-direction: column; gap: 0; background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
.empty-state { padding: 32px; text-align: center; color: #9ca3af; font-size: 0.875rem; }
.approval-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; gap: 12px; border-bottom: 1px solid #f3f4f6; transition: background 0.1s; }
.approval-row:last-child { border-bottom: none; }
.approval-row:hover { background: #f9fafb; }
.approval-info { flex: 1; min-width: 0; }
.approval-type { font-size: 0.875rem; font-weight: 600; color: #111827; }
.approval-meta { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; }
.approval-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.btn-view-sm { font-size: 0.78rem; color: #1d4ed8; text-decoration: none; border: 1px solid #bfdbfe; border-radius: 6px; padding: 3px 10px; background: #eff6ff; font-weight: 500; white-space: nowrap; }
.btn-view-sm:hover { background: #dbeafe; }

.priority-critical { background: #fef2f2; color: #dc2626; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; white-space: nowrap; }
.priority-high { background: #fff7ed; color: #ea580c; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; white-space: nowrap; }
.priority-normal { background: #f3f4f6; color: #6b7280; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; }

.quick-links { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; }
.quick-link { display: flex; flex-direction: column; align-items: center; gap: 8px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px 12px; text-decoration: none; transition: box-shadow 0.12s, border-color 0.12s; }
.quick-link:hover { box-shadow: 0 2px 8px rgba(29,78,216,.12); border-color: #bfdbfe; }
.ql-icon { font-size: 1.6rem; }
.ql-label { font-size: 0.8rem; font-weight: 600; color: #374151; text-align: center; line-height: 1.3; }
</style>
