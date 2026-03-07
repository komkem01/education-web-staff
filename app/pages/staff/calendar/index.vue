<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :rows="4" :cols="4" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">ปฏิทินกิจกรรม</h2>
          <p class="page-desc">ตารางกิจกรรมและกำหนดการสำคัญของโรงเรียน</p>
        </div>
        <div class="view-toggle">
          <button :class="['vbtn', viewMode === 'list' ? 'active' : '']" @click="viewMode = 'list'">รายการ</button>
          <button :class="['vbtn', viewMode === 'calendar' ? 'active' : '']" @click="viewMode = 'calendar'">ปฏิทิน</button>
        </div>
      </div>

      <div class="filter-row">
        <div class="search-wrap">
          <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9ca3af" stroke-width="1.4"/><path d="M10 10l3 3" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/></svg>
          <input v-model="search" class="input search" type="text" placeholder="ค้นหากิจกรรม..." autocomplete="off" />
        </div>
        <select v-model="filterType" class="input sel">
          <option value="">ทุกประเภท</option>
          <option>สอบ</option>
          <option>วันหยุด</option>
          <option>กิจกรรม</option>
          <option>วิชาการ</option>
        </select>
        <select v-model="filterMonth" class="input sel">
          <option value="">ทุกเดือน</option>
          <option value="01">มกราคม</option>
          <option value="02">กุมภาพันธ์</option>
          <option value="03">มีนาคม</option>
          <option value="04">เมษายน</option>
          <option value="05">พฤษภาคม</option>
          <option value="06">มิถุนายน</option>
          <option value="07">กรกฎาคม</option>
          <option value="08">สิงหาคม</option>
          <option value="09">กันยายน</option>
          <option value="10">ตุลาคม</option>
          <option value="11">พฤศจิกายน</option>
          <option value="12">ธันวาคม</option>
        </select>
        <button v-if="search || filterType || filterMonth" type="button" class="btn btn-clear" @click="clearFilters">ล้างตัวกรอง</button>
      </div>

      <!-- List view -->
      <div v-if="viewMode === 'list'">
        <StaffDataTable title="กิจกรรมทั้งหมด" :columns="cols" :rows="filteredEvents">
          <template #cell-type="{ value }">
            <span :class="`ev-badge ev-${(value as string).toLowerCase()}`">{{ value }}</span>
          </template>
        </StaffDataTable>
      </div>

      <!-- Calendar view -->
      <div v-else class="cal-section">
        <div class="cal-month-nav">
          <button type="button" class="btn btn-sm btn-nav" @click="prevMonth">&#8592;</button>
          <span class="cal-month-label">{{ monthLabel }}</span>
          <button type="button" class="btn btn-sm btn-nav" @click="nextMonth">&#8594;</button>
        </div>
        <div class="cal-grid">
          <div v-for="d in dayHeaders" :key="d" class="cal-day-header">{{ d }}</div>
          <div v-for="cell in calCells" :key="cell.key" :class="['cal-cell', cell.isToday ? 'today' : '', !cell.inMonth ? 'out-month' : '']">
            <span class="cal-date-num">{{ cell.day }}</span>
            <div v-for="ev in cell.events" :key="ev.title" :class="`cal-ev ev-dot-${ev.type.toLowerCase()}`">{{ ev.title }}</div>
          </div>
        </div>

        <!-- Legend -->
        <div class="legend">
          <span v-for="t in eventTypes" :key="t" :class="`leg-item leg-${t.toLowerCase()}`">
            <span class="leg-dot" />{{ t }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalendarData, type CalendarEvent } from '~/composables/useCalendarData'
import { useAnnouncementsData } from '~/composables/useAnnouncementsData'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()
const { events } = useCalendarData()
const { rows: announcementRows } = useAnnouncementsData()

const search = ref('')
const filterType = ref('')
const filterMonth = ref('')
const viewMode = ref<'list' | 'calendar'>('list')
const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth()) // 0-based

const dayHeaders = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
const eventTypes = ['สอบ', 'วันหยุด', 'กิจกรรม', 'วิชาการ']

const cols = [
  { key: 'date', label: 'วันที่' },
  { key: 'title', label: 'กิจกรรม' },
  { key: 'type', label: 'ประเภท' },
  { key: 'location', label: 'สถานที่' },
  { key: 'description', label: 'รายละเอียด' },
]

function toIsoDate(input: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input
  const m = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return input
  const day = m[1]
  const month = m[2]
  const rawYear = Number(m[3])
  const year = rawYear > 2400 ? rawYear - 543 : rawYear
  return `${year}-${month}-${day}`
}

function mapAnnouncementType(category: string): string {
  if (category === 'วิชาการ') return 'วิชาการ'
  if (category === 'สอบ') return 'สอบ'
  if (category === 'วันหยุด') return 'วันหยุด'
  return 'กิจกรรม'
}

const mergedEvents = computed<CalendarEvent[]>(() => {
  const base = events.value.map((e) => ({ ...e, date: toIsoDate(e.date), endDate: e.endDate ? toIsoDate(e.endDate) : undefined }))
  const fromAnnouncements = announcementRows.value
    .filter(a => a.status === 'เผยแพร่แล้ว')
    .map<CalendarEvent>((a) => ({
      id: `ANN-${a.id}`,
      title: a.title,
      date: toIsoDate(a.date),
      type: mapAnnouncementType(a.category),
      description: `ประกาศโดย ${a.author}`,
    }))
  return [...base, ...fromAnnouncements]
})

const filteredEvents = computed(() =>
  mergedEvents.value.filter((e: CalendarEvent) => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || e.title.toLowerCase().includes(q)
    const matchType = !filterType.value || e.type === filterType.value
    const matchMonth = !filterMonth.value || e.date.slice(5, 7) === filterMonth.value
    return matchSearch && matchType && matchMonth
  })
)

const monthLabel = computed(() => {
  const d = new Date(currentYear.value, currentMonth.value, 1)
  return d.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })
})

const calCells = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = firstDay.getDay()
  const cells = []
  for (let i = 0; i < startOffset; i++) {
    cells.push({ key: `pre-${i}`, day: '', inMonth: false, isToday: false, events: [] })
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const isTodayFlag = year === today.getFullYear() && month === today.getMonth() && d === today.getDate()
    const dayEvents = mergedEvents.value.filter(e => e.date === iso)
    cells.push({ key: iso, day: d, inMonth: true, isToday: isTodayFlag, events: dayEvents })
  }
  const remaining = 7 - (cells.length % 7)
  if (remaining < 7) {
    for (let i = 0; i < remaining; i++) cells.push({ key: `post-${i}`, day: '', inMonth: false, isToday: false, events: [] })
  }
  return cells
})

function prevMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
}
function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
}
function clearFilters() { search.value = ''; filterType.value = ''; filterMonth.value = '' }
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
.sel { width: auto; min-width: 130px; flex: none; }
.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 7px; padding: 7px 14px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: background 0.12s; white-space: nowrap; }
.btn-clear { background: #fff; color: #6b7280; border-color: #e5e7eb; }
.btn-clear:hover { background: #f9fafb; }
.btn-sm { padding: 5px 10px; font-size: 0.8rem; }
.btn-nav { background: #f3f4f6; color: #374151; border-color: #e5e7eb; font-size: 1rem; }
.btn-nav:hover { background: #e5e7eb; }
.view-toggle { display: flex; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
.vbtn { padding: 7px 16px; font-size: 0.875rem; font-weight: 500; border: none; background: #fff; color: #6b7280; cursor: pointer; font-family: inherit; transition: background 0.12s; }
.vbtn.active { background: #1d4ed8; color: #fff; }
.ev-badge { border-radius: 999px; padding: 2px 10px; font-size: 0.75rem; font-weight: 600; }
.ev-สอบ { background: #fef2f2; color: #b91c1c; }
.ev-วันหยุด { background: #f0fdf4; color: #15803d; }
.ev-กิจกรรม { background: #fef9c3; color: #854d0e; }
.ev-วิชาการ { background: #eff6ff; color: #1d4ed8; }
.cal-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
.cal-month-nav { display: flex; align-items: center; gap: 12px; justify-content: center; margin-bottom: 16px; }
.cal-month-label { font-size: 1rem; font-weight: 600; color: #111827; min-width: 160px; text-align: center; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.cal-day-header { padding: 8px 4px; text-align: center; font-size: 0.75rem; font-weight: 600; color: #6b7280; }
.cal-cell { min-height: 88px; padding: 6px; border: 1px solid #f3f4f6; border-radius: 6px; background: #fff; }
.cal-cell.today { background: #eff6ff; border-color: #bfdbfe; }
.cal-cell.out-month { background: #f9fafb; }
.cal-date-num { font-size: 0.8rem; font-weight: 600; color: #374151; display: block; margin-bottom: 3px; }
.cal-cell.today .cal-date-num { color: #1d4ed8; }
.cal-ev { font-size: 0.68rem; border-radius: 4px; padding: 2px 5px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
.ev-dot-สอบ { background: #fef2f2; color: #b91c1c; }
.ev-dot-วันหยุด { background: #f0fdf4; color: #15803d; }
.ev-dot-กิจกรรม { background: #fef9c3; color: #854d0e; }
.ev-dot-วิชาการ { background: #eff6ff; color: #1d4ed8; }
.legend { display: flex; gap: 14px; margin-top: 16px; flex-wrap: wrap; }
.leg-item { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #374151; }
.leg-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
.leg-item.leg-สอบ .leg-dot { background: #fca5a5; }
.leg-item.leg-วันหยุด .leg-dot { background: #86efac; }
.leg-item.leg-กิจกรรม .leg-dot { background: #fde047; }
.leg-item.leg-วิชาการ .leg-dot { background: #93c5fd; }
</style>
