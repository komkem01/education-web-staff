<template>
	<div class="page">
		<div v-if="!request" class="not-found">
			<button type="button" class="btn btn-back" @click="navigateTo('/staff/documents')">
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 2L3 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
				กลับ
			</button>
			<p>ไม่พบคำขอเอกสารรหัส {{ id }}</p>
		</div>

		<template v-else>
			<div class="page-header">
				<div class="header-left">
					<button type="button" class="btn btn-back" @click="navigateTo('/staff/documents')">
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 2L3 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
						กลับ
					</button>
					<div>
						<h2 class="page-title">{{ request.docType }}</h2>
						<p class="page-desc">{{ request.id }} · {{ request.requesterName }}</p>
					</div>
				</div>
				<div class="header-actions">
					<button v-if="request.status === 'ร้องขอ'" type="button" class="btn btn-process" @click="processRequest">รับเรื่อง</button>
					<button v-if="request.status === 'กำลังดำเนินการ'" type="button" class="btn btn-complete" @click="completeRequest">เสร็จสิ้น</button>
				</div>
			</div>

			<div class="tab-bar">
				<button type="button" class="tab-btn" :class="{ 'tab-btn--active': activeTab === 'general' }" @click="activeTab = 'general'">ข้อมูลคำขอ</button>
				<button type="button" class="tab-btn" :class="{ 'tab-btn--active': activeTab === 'process' }" @click="activeTab = 'process'">สถานะการดำเนินการ</button>
			</div>

			<div v-show="activeTab === 'general'" class="detail-card">
				<p class="section-title">รายละเอียดคำขอ</p>
				<div class="detail-grid">
					<div class="detail-item"><span class="detail-label">รหัสคำขอ</span><span class="detail-value mono">{{ request.id }}</span></div>
					<div class="detail-item"><span class="detail-label">หมวดหมู่</span><span class="detail-value">{{ request.category }}</span></div>
					<div class="detail-item"><span class="detail-label">ผู้ขอ</span><span class="detail-value">{{ request.requesterName }}</span></div>
					<div class="detail-item"><span class="detail-label">บทบาท</span><span class="detail-value">{{ request.requesterRole }}</span></div>
					<div class="detail-item"><span class="detail-label">จำนวนชุด</span><span class="detail-value">{{ request.copies }} ชุด</span></div>
					<div class="detail-item"><span class="detail-label">วันที่ขอ</span><span class="detail-value">{{ request.requestedAt }}</span></div>
					<div class="detail-item full-width"><span class="detail-label">วัตถุประสงค์</span><span class="detail-value">{{ request.purpose }}</span></div>
				</div>
			</div>

			<div v-show="activeTab === 'process'" class="detail-card">
				<p class="section-title">ข้อมูลการดำเนินการ</p>
				<div class="detail-grid">
					<div class="detail-item">
						<span class="detail-label">สถานะ</span>
						<StaffStatusBadge :label="request.status" :variant="request.status === 'เสร็จสิ้น' ? 'approved' : request.status === 'ยกเลิก' ? 'default' : 'pending'" />
					</div>
					<div class="detail-item"><span class="detail-label">ผู้ดำเนินการ</span><span class="detail-value">{{ request.handledBy || '—' }}</span></div>
					<div class="detail-item"><span class="detail-label">วันที่เสร็จ</span><span class="detail-value">{{ request.completedAt || '—' }}</span></div>
					<div class="detail-item full-width"><span class="detail-label">หมายเหตุ</span><span class="detail-value">{{ request.note || '—' }}</span></div>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDocumentsData } from '~/composables/useDocumentsData'

definePageMeta({ layout: 'staff' })

const route = useRoute()
const id = route.params.id as string
const { requests } = useDocumentsData()

const request = computed(() => requests.value.find(r => r.id === id))
const activeTab = ref<'general' | 'process'>('general')
const handledBy = 'นางสาวสมใจ รักงาน'

function processRequest() {
	if (!request.value || request.value.status !== 'ร้องขอ') return
	const idx = requests.value.findIndex(r => r.id === id)
	if (idx !== -1) requests.value[idx] = { ...requests.value[idx], status: 'กำลังดำเนินการ', handledBy }
}

function completeRequest() {
	if (!request.value || request.value.status !== 'กำลังดำเนินการ') return
	const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
	const idx = requests.value.findIndex(r => r.id === id)
	if (idx !== -1) requests.value[idx] = { ...requests.value[idx], status: 'เสร็จสิ้น', completedAt: today, handledBy }
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }

.not-found { text-align: center; padding: 60px 0; color: #6b7280; display: flex; flex-direction: column; align-items: center; gap: 12px; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.header-left { display: flex; align-items: flex-start; gap: 12px; }
.page-title { font-size: 1.25rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
.page-desc { font-size: 0.85rem; color: #6b7280; margin: 0; }
.header-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 8px; padding: 8px 14px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid #d1d5db; background: #fff; color: #374151; font-family: inherit; transition: background 0.12s; }
.btn:hover { background: #f9fafb; }
.btn-back { color: #6b7280; padding: 7px 12px; font-size: 0.82rem; border-color: #d1d5db; margin-top: 2px; }
.btn-back:hover { background: #f3f4f6; }
.btn-process { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.btn-process:hover { background: #dbeafe; }
.btn-complete { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
.btn-complete:hover { background: #dcfce7; }

.tab-bar { display: flex; gap: 0; border-bottom: 2px solid #e5e7eb; }
.tab-btn { padding: 9px 18px; font-size: 0.875rem; font-weight: 500; color: #6b7280; background: none; border: none; border-bottom: 2px solid transparent; margin-bottom: -2px; cursor: pointer; font-family: inherit; transition: color 0.12s, border-color 0.12s; white-space: nowrap; }
.tab-btn:hover { color: #374151; }
.tab-btn--active { color: #1d4ed8; border-bottom-color: #1d4ed8; }

.detail-card { background: #fff; border: 1px solid #e8eaed; border-radius: 12px; padding: 24px; }
.section-title { font-size: 0.75rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 18px; padding-bottom: 10px; border-bottom: 1px solid #f3f4f6; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 32px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-item.full-width { grid-column: 1 / -1; }
.detail-label { font-size: 0.72rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
.detail-value { font-size: 0.9rem; color: #111827; font-weight: 500; }
.detail-value.mono { font-family: monospace; letter-spacing: 0.04em; }
</style>
