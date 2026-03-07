<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :rows="5" :cols="5" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">ห้องเรียน</h2>
          <p class="page-desc">ข้อมูลห้องเรียนทั้งหมด (ดูข้อมูลได้เท่านั้น)</p>
        </div>
      </div>

      <div class="filter-row">
        <div class="search-wrap">
          <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9ca3af" stroke-width="1.4"/><path d="M10 10l3 3" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/></svg>
          <input v-model="search" class="input search" list="classroom-search-list" type="text" placeholder="ค้นหาชื่อห้องหรือครูที่ปรึกษา..." autocomplete="off" />
          <datalist id="classroom-search-list">
            <option v-for="r in filteredRows" :key="r.id" :value="r.name" />
            <option v-for="r in filteredRows" :key="r.id + '-advisor'" :value="r.advisor" />
          </datalist>
        </div>
        <select v-model="filterLevel" class="input sel">
          <option value="">ทุกระดับชั้น</option>
          <option>ม.1</option><option>ม.2</option><option>ม.3</option>
          <option>ม.4</option><option>ม.5</option><option>ม.6</option>
        </select>
        <button v-if="search || filterLevel" type="button" class="btn btn-clear" @click="clearFilters">ล้างตัวกรอง</button>
      </div>

      <StaffDataTable title="รายการห้องเรียน" :columns="cols" :rows="filteredRows">
        <template #rowActions="{ row }">
          <div class="action-btns">
            <button type="button" class="btn btn-sm btn-detail" @click="navigateTo('/staff/classrooms/' + (row as unknown as ClassroomRow).id)">รายละเอียด</button>
          </div>
        </template>
      </StaffDataTable>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useClassroomsData, type ClassroomRow } from '~/composables/useClassroomsData'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()
const { rows } = useClassroomsData()

const search = ref('')
const filterLevel = ref('')

const cols = [
  { key: 'name', label: 'ห้อง' },
  { key: 'level', label: 'ระดับชั้น' },
  { key: 'advisor', label: 'ครูที่ปรึกษา' },
  { key: 'room', label: 'ห้องเรียน' },
  { key: 'students', label: 'จำนวนนักเรียน' },
]

const filteredRows = computed(() =>
  rows.value.filter((r: ClassroomRow) => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.advisor.toLowerCase().includes(q)
    const matchLevel = !filterLevel.value || r.level === filterLevel.value
    return matchSearch && matchLevel
  })
)

function clearFilters() {
  search.value = ''
  filterLevel.value = ''
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
.sel { width: auto; min-width: 140px; flex: none; }
.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 7px; padding: 7px 14px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: background 0.12s; white-space: nowrap; }
.btn-clear { background: #fff; color: #6b7280; border-color: #e5e7eb; }
.btn-clear:hover { background: #f9fafb; }
.btn-sm { padding: 5px 10px; font-size: 0.8rem; }
.btn-detail { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-detail:hover { background: #f9fafb; }
.btn-primary { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
.btn-primary:hover { background: #1e40af; }
.action-btns { display: flex; gap: 6px; justify-content: flex-end; flex-wrap: nowrap; }
</style>
