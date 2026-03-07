<template>
  <div class="page">
    <div v-if="!classroom" class="not-found">
      <button type="button" class="btn btn-back" @click="navigateTo('/staff/classrooms')">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 2L3 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        กลับ
      </button>
      <p>ไม่พบข้อมูลห้องเรียนรหัส {{ id }}</p>
    </div>

    <template v-else>
      <div class="page-header">
        <div class="header-left">
          <button type="button" class="btn btn-back" @click="navigateTo('/staff/classrooms')">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 2L3 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            กลับ
          </button>
          <div>
            <h2 class="page-title">{{ classroom.name }}</h2>
            <p class="page-desc">{{ classroom.level }} · รหัส {{ classroom.id }}</p>
          </div>
        </div>
      </div>

      <div class="tab-bar">
        <button type="button" class="tab-btn" :class="{ 'tab-btn--active': activeTab === 'general' }" @click="activeTab = 'general'">ข้อมูลห้องเรียน</button>
        <button type="button" class="tab-btn" :class="{ 'tab-btn--active': activeTab === 'summary' }" @click="activeTab = 'summary'">สรุปภาพรวม</button>
      </div>

      <div v-show="activeTab === 'general'" class="detail-card">
        <p class="section-title">ข้อมูลหลัก</p>
        <div class="detail-grid">
          <div class="detail-item"><span class="detail-label">รหัสห้องเรียน</span><span class="detail-value mono">{{ classroom.id }}</span></div>
          <div class="detail-item"><span class="detail-label">ชื่อห้อง</span><span class="detail-value">{{ classroom.name }}</span></div>
          <div class="detail-item"><span class="detail-label">ระดับชั้น</span><span class="detail-value">{{ classroom.level }}</span></div>
          <div class="detail-item"><span class="detail-label">ห้องเรียน</span><span class="detail-value">อาคาร {{ classroom.room }}</span></div>
          <div class="detail-item"><span class="detail-label">ครูที่ปรึกษา</span><span class="detail-value">{{ classroom.advisor }}</span></div>
          <div class="detail-item"><span class="detail-label">จำนวนนักเรียน</span><span class="detail-value">{{ classroom.students }} คน</span></div>
        </div>
      </div>

      <div v-show="activeTab === 'summary'" class="detail-card">
        <p class="section-title">สรุปข้อมูล</p>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label">จำนวนผู้เรียนรวม</span>
            <span class="summary-value">{{ classroom.students }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">ห้องเรียน</span>
            <span class="summary-value">{{ classroom.room }}</span>
          </div>
          <div class="summary-item full-width">
            <span class="summary-label">ครูที่ปรึกษา</span>
            <span class="summary-value">{{ classroom.advisor }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClassroomsData } from '~/composables/useClassroomsData'

definePageMeta({ layout: 'staff' })

const route = useRoute()
const id = route.params.id as string
const { rows } = useClassroomsData()

const classroom = computed(() => rows.value.find(r => r.id === id))
const activeTab = ref<'general' | 'summary'>('general')
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }

.not-found { text-align: center; padding: 60px 0; color: #6b7280; display: flex; flex-direction: column; align-items: center; gap: 12px; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.header-left { display: flex; align-items: flex-start; gap: 12px; }
.page-title { font-size: 1.25rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
.page-desc { font-size: 0.85rem; color: #6b7280; margin: 0; }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #374151;
  font-family: inherit;
  transition: background 0.12s;
}

.btn:hover { background: #f9fafb; }
.btn-back { color: #6b7280; padding: 7px 12px; font-size: 0.82rem; border-color: #d1d5db; margin-top: 2px; }
.btn-back:hover { background: #f3f4f6; }

.tab-bar { display: flex; gap: 0; border-bottom: 2px solid #e5e7eb; }
.tab-btn {
  padding: 9px 18px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.12s, border-color 0.12s;
  white-space: nowrap;
}

.tab-btn:hover { color: #374151; }
.tab-btn--active { color: #1d4ed8; border-bottom-color: #1d4ed8; }

.detail-card { background: #fff; border: 1px solid #e8eaed; border-radius: 12px; padding: 24px; }
.section-title { font-size: 0.75rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 18px; padding-bottom: 10px; border-bottom: 1px solid #f3f4f6; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 32px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-label { font-size: 0.72rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
.detail-value { font-size: 0.9rem; color: #111827; font-weight: 500; }
.detail-value.mono { font-family: monospace; letter-spacing: 0.04em; }

.summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.summary-item { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 6px; }
.summary-item.full-width { grid-column: 1 / -1; }
.summary-label { font-size: 0.75rem; color: #6b7280; font-weight: 600; }
.summary-value { font-size: 1rem; color: #111827; font-weight: 700; }
</style>