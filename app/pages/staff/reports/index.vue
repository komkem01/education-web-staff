<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :rows="3" :cols="4" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">รายงาน</h2>
          <p class="page-desc">ดาวน์โหลดและส่งออกรายงานต่างๆ ที่เกี่ยวข้องกับการสอนของคุณ</p>
        </div>
      </div>

      <!-- Report category cards -->
      <div class="report-grid">
        <div v-for="cat in categories" :key="cat.key" class="cat-card">
          <div :class="`cat-icon-wrap ci-${cat.key}`">
            <component :is="'svg'" v-bind="cat.icon.attrs" v-html="cat.icon.inner" />
          </div>
          <div class="cat-info">
            <h3 class="cat-title">{{ cat.title }}</h3>
            <p class="cat-desc">{{ cat.desc }}</p>
          </div>
          <div class="report-list">
            <div v-for="r in cat.reports" :key="r.name" class="report-item">
              <div class="report-item-info">
                <span class="report-name">{{ r.name }}</span>
                <span class="report-sub">{{ r.sub }}</span>
              </div>
              <div class="report-actions">
                <select v-if="r.hasFilter" v-model="r.selectedFilter" class="input sel-sm">
                  <option v-for="opt in r.filterOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
                <button type="button" class="btn btn-export" @click="mockExport(r.name, 'xlsx')">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v8M3 6l3.5 3.5L10 6M1 11h11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Excel
                </button>
                <button type="button" class="btn btn-export-pdf" @click="mockExport(r.name, 'pdf')">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v8M3 6l3.5 3.5L10 6M1 11h11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent exports -->
      <div class="recent-section">
        <h3 class="section-title">ส่งออกล่าสุด</h3>
        <div v-if="recentExports.length === 0" class="empty-recent">
          <span>ยังไม่มีประวัติการส่งออก</span>
        </div>
        <div v-else class="recent-list">
          <div v-for="ex in recentExports" :key="ex.id" class="recent-item">
            <div :class="`file-icon fi-${ex.format}`">{{ ex.format.toUpperCase() }}</div>
            <div class="recent-info">
              <span class="recent-name">{{ ex.name }}</span>
              <span class="recent-time">{{ ex.time }}</span>
            </div>
            <span class="recent-status">เสร็จสิ้น</span>
          </div>
        </div>
      </div>

      <!-- Toast notification -->
      <Teleport to="body">
        <Transition name="toast">
          <div v-if="toastMsg" class="toast">{{ toastMsg }}</div>
        </Transition>
      </Teleport>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()
const toastMsg = ref('')
const recentExports = ref<{ id: number; name: string; format: string; time: string }[]>([])
let exportIdCounter = 1

const categories = reactive([
  {
    key: 'grade',
    title: 'รายงานผลการเรียน',
    desc: 'สรุปและรายละเอียดผลการเรียนรายวิชา',
    icon: {
      attrs: { width: '22', height: '22', viewBox: '0 0 22 22', fill: 'none' },
      inner: '<rect x="3" y="2" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 7h8M7 11h8M7 15h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    },
    reports: [
      { name: 'สรุปผลการเรียนรายวิชา', sub: 'คะแนนกลางภาค-ปลายภาค รายนักเรียน', hasFilter: true, filterOptions: ['คณิตศาสตร์พื้นฐาน ม.3', 'แคลคูลัส ม.6', 'คณิตศาสตร์ ม.2/1'], selectedFilter: 'คณิตศาสตร์พื้นฐาน ม.3' },
      { name: 'รายชื่อนักเรียนติด 0/ร/มส', sub: 'นักเรียนที่มีผลการเรียนไม่ผ่าน', hasFilter: false, filterOptions: [], selectedFilter: '' },
    ],
  },
  {
    key: 'attendance',
    title: 'รายงานการเข้าเรียน',
    desc: 'สถิติการเข้าเรียนและการขาดเรียน',
    icon: {
      attrs: { width: '22', height: '22', viewBox: '0 0 22 22', fill: 'none' },
      inner: '<rect x="3" y="4" width="16" height="15" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M15 2v4M7 2v4M3 9h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    },
    reports: [
      { name: 'สถิติการเข้าเรียนรายวิชา', sub: 'จำแนกตามสถานะ มาเรียน/ขาด/ลา/สาย', hasFilter: true, filterOptions: ['คณิตศาสตร์พื้นฐาน ม.3', 'แคลคูลัส ม.6', 'คณิตศาสตร์ ม.2/1'], selectedFilter: 'คณิตศาสตร์พื้นฐาน ม.3' },
      { name: 'นักเรียนขาดเรียนบ่อย', sub: 'นักเรียนที่ขาดเรียนเกิน 3 ครั้ง', hasFilter: false, filterOptions: [], selectedFilter: '' },
    ],
  },
  {
    key: 'behavior',
    title: 'รายงานพฤติกรรม',
    desc: 'สรุปคะแนนความประพฤตินักเรียน',
    icon: {
      attrs: { width: '22', height: '22', viewBox: '0 0 22 22', fill: 'none' },
      inner: '<circle cx="11" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M4 20c0-3.866 3.134-7 7-7h0c3.866 0 7 3.134 7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    },
    reports: [
      { name: 'สรุปพฤติกรรมรายห้องเรียน', sub: 'ตัดคะแนน/เพิ่มคะแนน รายบุคคล', hasFilter: false, filterOptions: [], selectedFilter: '' },
      { name: 'รายการบันทึกของฉัน', sub: 'พฤติกรรมที่คุณบันทึกไว้ทั้งหมด', hasFilter: false, filterOptions: [], selectedFilter: '' },
    ],
  },
])

function mockExport(reportName: string, format: string) {
  const now = new Date()
  const time = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  recentExports.value.unshift({ id: exportIdCounter++, name: `${reportName}.${format}`, format, time })
  if (recentExports.value.length > 5) recentExports.value.pop()
  toastMsg.value = `กำลังส่งออก "${reportName}" เป็น ${format.toUpperCase()}...`
  setTimeout(() => { toastMsg.value = '' }, 3000)
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 0; }
.page-header { margin-bottom: 28px; }
.page-title { font-size: 1.3rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
.page-desc { font-size: 0.875rem; color: #6b7280; margin: 0; }
.report-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px; margin-bottom: 28px; }
.cat-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.cat-icon-wrap { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ci-grade { background: #eff6ff; color: #1d4ed8; }
.ci-attendance { background: #f0fdf4; color: #16a34a; }
.ci-behavior { background: #fff7ed; color: #c2410c; }
.cat-info {}
.cat-title { font-size: 0.95rem; font-weight: 700; color: #111827; margin: 0 0 2px; }
.cat-desc { font-size: 0.8rem; color: #6b7280; margin: 0; }
.report-list { display: flex; flex-direction: column; gap: 10px; }
.report-item { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 12px; background: #f9fafb; border-radius: 8px; flex-wrap: wrap; }
.report-item-info { display: flex; flex-direction: column; gap: 2px; }
.report-name { font-size: 0.875rem; font-weight: 600; color: #111827; }
.report-sub { font-size: 0.75rem; color: #6b7280; }
.report-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.input { padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 7px; font-size: 0.8rem; font-family: inherit; color: #111827; background: #fff; outline: none; }
.sel-sm { width: auto; min-width: 140px; }
.btn { display: inline-flex; align-items: center; gap: 5px; border-radius: 7px; padding: 6px 12px; font-size: 0.8rem; font-weight: 500; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: background 0.12s; }
.btn-export { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.btn-export:hover { background: #dbeafe; }
.btn-export-pdf { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
.btn-export-pdf:hover { background: #fee2e2; }
.recent-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
.section-title { font-size: 0.95rem; font-weight: 700; color: #111827; margin: 0 0 14px; }
.empty-recent { text-align: center; padding: 20px 0; color: #9ca3af; font-size: 0.875rem; }
.recent-list { display: flex; flex-direction: column; gap: 8px; }
.recent-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: #f9fafb; border-radius: 8px; }
.file-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; flex-shrink: 0; }
.fi-xlsx { background: #dcfce7; color: #166534; }
.fi-pdf { background: #fee2e2; color: #991b1b; }
.recent-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.recent-name { font-size: 0.875rem; font-weight: 600; color: #111827; }
.recent-time { font-size: 0.75rem; color: #6b7280; }
.recent-status { font-size: 0.75rem; font-weight: 600; color: #16a34a; background: #dcfce7; padding: 2px 8px; border-radius: 999px; flex-shrink: 0; }
.toast { position: fixed; bottom: 28px; right: 28px; background: #1e293b; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 0.875rem; box-shadow: 0 4px 24px rgba(0,0,0,.18); z-index: 9999; }
.toast-enter-active, .toast-leave-active { transition: opacity 0.25s, transform 0.25s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(10px); }
</style>
