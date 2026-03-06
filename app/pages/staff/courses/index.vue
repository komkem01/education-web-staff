<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :rows="5" :cols="6" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">รายวิชา</h2>
          <p class="page-desc">รายวิชาที่เปิดสอนในภาคเรียนนี้</p>
        </div>
      </div>

      <div class="filter-row">
        <div class="search-wrap">
          <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9ca3af" stroke-width="1.4"/><path d="M10 10l3 3" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/></svg>
          <input v-model="search" class="input search" type="text" placeholder="ค้นหาชื่อวิชาหรือครูผู้สอน..." autocomplete="off" />
        </div>
        <select v-model="filterSubject" class="input sel">
          <option value="">กลุ่มสาระทั้งหมด</option>
          <option>ภาษาไทย</option><option>คณิตศาสตร์</option><option>วิทยาศาสตร์</option>
          <option>สังคมศึกษา</option><option>ภาษาต่างประเทศ</option><option>ศิลปะ</option><option>พลศึกษา</option>
        </select>
        <button v-if="search || filterSubject" type="button" class="btn btn-clear" @click="clearFilters">ล้างตัวกรอง</button>
      </div>

      <StaffDataTable title="รายวิชาทั้งหมด" :columns="cols" :rows="filteredRows">
        <template #rowActions="{ row }">
          <div class="action-btns">
            <button type="button" class="btn btn-sm btn-detail" @click="openDetail(row as unknown as CourseRow)">รายละเอียด</button>
          </div>
        </template>
      </StaffDataTable>

      <StaffAppModal v-model="showDetail" title="รายละเอียดวิชา" size="sm">
        <template #footer>
          <button type="button" class="btn btn-primary" @click="showDetail = false">ปิด</button>
        </template>
        <div class="detail-body" v-if="detailRow">
          <div class="detail-row"><span class="detail-label">รหัสวิชา</span><span class="id-badge">{{ detailRow.id }}</span></div>
          <div class="detail-row"><span class="detail-label">ชื่อวิชา</span><span class="detail-value">{{ detailRow.name }}</span></div>
          <div class="detail-row"><span class="detail-label">กลุ่มสาระ</span><span class="detail-value">{{ detailRow.subject }}</span></div>
          <div class="detail-row"><span class="detail-label">ครูผู้สอน</span><span class="detail-value">{{ detailRow.teacher }}</span></div>
          <div class="detail-row"><span class="detail-label">หน่วยกิต</span><span class="detail-value">{{ detailRow.credits }}</span></div>
          <div class="detail-row"><span class="detail-label">จำนวนนักเรียน</span><span class="detail-value">{{ detailRow.students }} คน</span></div>
          <div class="detail-row"><span class="detail-label">ภาคเรียน</span><span class="detail-value">{{ detailRow.semester }}</span></div>
        </div>
      </StaffAppModal>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCoursesData, type CourseRow } from '~/composables/useCoursesData'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()
const { rows } = useCoursesData()

const search = ref('')
const filterSubject = ref('')
const showDetail = ref(false)
const detailRow = ref<CourseRow | null>(null)

const cols = [
  { key: 'id', label: 'รหัส' },
  { key: 'name', label: 'ชื่อวิชา' },
  { key: 'subject', label: 'กลุ่มสาระ' },
  { key: 'teacher', label: 'ครูผู้สอน' },
  { key: 'credits', label: 'หน่วยกิต' },
  { key: 'students', label: 'นักเรียน' },
]

const filteredRows = computed(() =>
  rows.value.filter((r: CourseRow) => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.teacher.toLowerCase().includes(q)
    const matchSubject = !filterSubject.value || r.subject === filterSubject.value
    return matchSearch && matchSubject
  })
)

function openDetail(row: CourseRow) {
  detailRow.value = row
  showDetail.value = true
}

function clearFilters() {
  search.value = ''
  filterSubject.value = ''
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 0; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 1.3rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
.page-desc { font-size: 0.875rem; color: #6b7280; margin: 0; }
.filter-row { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); }
.input { width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; font-family: inherit; color: #111827; background: #fff; outline: none; transition: border-color 0.15s; }
.input:focus { border-color: #1d4ed8; }
.search { padding-left: 34px; }
.sel { width: auto; min-width: 160px; flex: none; }
.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 7px; padding: 7px 14px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: background 0.12s; white-space: nowrap; }
.btn-clear { background: #fff; color: #6b7280; border-color: #e5e7eb; }
.btn-clear:hover { background: #f9fafb; }
.btn-sm { padding: 5px 10px; font-size: 0.8rem; }
.btn-detail { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-detail:hover { background: #f9fafb; }
.btn-primary { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
.btn-primary:hover { background: #1e40af; }
.action-btns { display: flex; gap: 6px; }
.detail-body { display: flex; flex-direction: column; gap: 14px; }
.detail-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.detail-label { font-size: 0.83rem; color: #9ca3af; font-weight: 500; min-width: 110px; }
.detail-value { font-size: 0.875rem; color: #111827; font-weight: 500; }
.id-badge { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; padding: 2px 8px; font-size: 0.8rem; font-family: monospace; color: #374151; }
</style>
