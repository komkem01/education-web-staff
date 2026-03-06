<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :rows="6" :cols="6" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">ตารางสอน</h2>
          <p class="page-desc">ตารางสอนประจำสัปดาห์ของคุณ</p>
        </div>
      </div>

      <div class="timetable-wrapper">
        <div class="timetable-scroll">
          <table class="timetable">
            <thead>
              <tr>
                <th class="th-period">คาบ / เวลา</th>
                <th>จันทร์</th>
                <th>อังคาร</th>
                <th>พุธ</th>
                <th>พฤหัสบดี</th>
                <th>ศุกร์</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.period">
                <td class="td-period">
                  <div class="period-num">คาบ {{ row.period }}</div>
                  <div class="period-time">{{ row.time }}</div>
                </td>
                <td :class="getCellClass(row.monday)">
                  <span class="course-text">{{ row.monday }}</span>
                </td>
                <td :class="getCellClass(row.tuesday)">
                  <span class="course-text">{{ row.tuesday }}</span>
                </td>
                <td :class="getCellClass(row.wednesday)">
                  <span class="course-text">{{ row.wednesday }}</span>
                </td>
                <td :class="getCellClass(row.thursday)">
                  <span class="course-text">{{ row.thursday }}</span>
                </td>
                <td :class="getCellClass(row.friday)">
                  <span class="course-text">{{ row.friday }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="legend">
        <div class="legend-item">
          <span class="legend-dot dot-class" />
          <span>วิชาที่สอน</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot dot-advisory" />
          <span>ชั่วโมงที่ปรึกษา</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot dot-empty" />
          <span>ว่าง</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useTimetableData } from '~/composables/useTimetableData'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()
const { rows } = useTimetableData()

function getCellClass(value: string) {
  if (!value || value === '-') return 'td-empty'
  if (value.includes('ที่ปรึกษา')) return 'td-advisory'
  return 'td-class'
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 0; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 1.3rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
.page-desc { font-size: 0.875rem; color: #6b7280; margin: 0; }

.timetable-wrapper {
  background: #fff;
  border: 1px solid #f1f3f4;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,.04);
  margin-bottom: 16px;
}

.timetable-scroll {
  overflow-x: auto;
}

.timetable {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

th {
  padding: 12px 16px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 0.04em;
  background: #fafafa;
  border-bottom: 1px solid #f1f3f4;
  white-space: nowrap;
}

.th-period {
  text-align: left;
  min-width: 110px;
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid #f9fafb;
  border-right: 1px solid #f9fafb;
  text-align: center;
  vertical-align: middle;
  min-width: 120px;
}

td:last-child { border-right: none; }

tr:last-child td { border-bottom: none; }

.td-period {
  text-align: left;
  background: #fafafa;
  border-right: 1px solid #f1f3f4 !important;
}

.period-num {
  font-size: 0.78rem;
  font-weight: 600;
  color: #374151;
}

.period-time {
  font-size: 0.72rem;
  color: #9ca3af;
  margin-top: 2px;
}

.td-empty {
  background: #fafafa;
}

.td-class {
  background: #eff6ff;
}

.td-advisory {
  background: #fef9c3;
}

.course-text {
  font-size: 0.82rem;
  color: #374151;
  font-weight: 500;
  line-height: 1.4;
}

.td-class .course-text { color: #1e40af; }
.td-advisory .course-text { color: #92400e; }
.td-empty .course-text { color: #d1d5db; }

.legend {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.83rem;
  color: #6b7280;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.dot-class { background: #eff6ff; border: 1px solid #bfdbfe; }
.dot-advisory { background: #fef9c3; border: 1px solid #fde68a; }
.dot-empty { background: #fafafa; border: 1px solid #e5e7eb; }
</style>
