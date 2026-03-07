<template>
	<div class="page">
		<div v-if="!registration && !transfer" class="not-found">
			<button type="button" class="btn btn-back" @click="navigateTo('/staff/registrar')">
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 2L3 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
				กลับ
			</button>
			<p>ไม่พบรายการงานทะเบียนรหัส {{ id }}</p>
		</div>

		<template v-else>
			<div class="page-header">
				<div class="header-left">
					<button type="button" class="btn btn-back" @click="navigateTo('/staff/registrar')">
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 2L3 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
						กลับ
					</button>
					<div>
						<h2 class="page-title">{{ titleText }}</h2>
						<p class="page-desc">{{ subtitleText }}</p>
					</div>
				</div>
				<div class="header-actions">
					<button v-if="registration?.status === 'รอตรวจสอบ'" type="button" class="btn btn-reject" @click="openRegConfirm('reject')">ปฏิเสธ</button>
					<button v-if="registration?.status === 'รอตรวจสอบ'" type="button" class="btn btn-approve" @click="openRegConfirm('approve')">อนุมัติลงทะเบียน</button>
					<button v-if="transfer?.status === 'รอดำเนินการ'" type="button" class="btn btn-approve" @click="openTransferConfirm">ดำเนินการเสร็จ</button>
				</div>
			</div>

			<div class="tab-bar">
				<button type="button" class="tab-btn" :class="{ 'tab-btn--active': activeTab === 'general' }" @click="activeTab = 'general'">ข้อมูลหลัก</button>
				<button type="button" class="tab-btn" :class="{ 'tab-btn--active': activeTab === 'process' }" @click="activeTab = 'process'">สถานะการดำเนินการ</button>
			</div>

			<div v-show="activeTab === 'general'" class="detail-card">
				<p class="section-title">ข้อมูลรายการ</p>

				<div v-if="registration" class="detail-grid">
					<div class="detail-item"><span class="detail-label">รหัสรายการ</span><span class="detail-value mono">{{ registration.id }}</span></div>
					<div class="detail-item"><span class="detail-label">เลขประจำตัว</span><span class="detail-value">{{ registration.studentId }}</span></div>
					<div class="detail-item"><span class="detail-label">ชื่อนักเรียน</span><span class="detail-value">{{ registration.prefix }}{{ registration.studentName }}</span></div>
					<div class="detail-item"><span class="detail-label">วันเกิด</span><span class="detail-value">{{ registration.dob }}</span></div>
					<div class="detail-item"><span class="detail-label">เลขบัตรประชาชน</span><span class="detail-value">{{ registration.nationalId }}</span></div>
					<div class="detail-item"><span class="detail-label">ห้องที่ขอเข้า</span><span class="detail-value">{{ registration.targetClass }}</span></div>
					<div class="detail-item"><span class="detail-label">ผู้ปกครอง</span><span class="detail-value">{{ registration.parentName }}</span></div>
					<div class="detail-item"><span class="detail-label">โทรผู้ปกครอง</span><span class="detail-value">{{ registration.parentPhone }}</span></div>
				</div>

				<div v-if="transfer" class="detail-grid">
					<div class="detail-item"><span class="detail-label">รหัสรายการ</span><span class="detail-value mono">{{ transfer.id }}</span></div>
					<div class="detail-item"><span class="detail-label">เลขประจำตัว</span><span class="detail-value">{{ transfer.studentId }}</span></div>
					<div class="detail-item"><span class="detail-label">ชื่อนักเรียน</span><span class="detail-value">{{ transfer.studentName }}</span></div>
					<div class="detail-item"><span class="detail-label">ห้องปัจจุบัน</span><span class="detail-value">{{ transfer.currentClass }}</span></div>
					<div class="detail-item"><span class="detail-label">ประเภทรายการ</span><span class="detail-value" :class="transfer.transferType === 'ย้ายเข้า' ? 'type-in' : 'type-out'">{{ transfer.transferType }}</span></div>
					<div class="detail-item"><span class="detail-label">โรงเรียน</span><span class="detail-value">{{ transfer.targetSchool }}</span></div>
					<div class="detail-item full-width"><span class="detail-label">เหตุผล</span><span class="detail-value">{{ transfer.reason }}</span></div>
				</div>
			</div>

			<div v-show="activeTab === 'process'" class="detail-card">
				<p class="section-title">ข้อมูลการดำเนินการ</p>

				<div v-if="registration" class="detail-grid">
					<div class="detail-item"><span class="detail-label">ยื่นคำขอเมื่อ</span><span class="detail-value">{{ registration.submittedAt }}</span></div>
					<div class="detail-item"><span class="detail-label">ลงทะเบียนโดย</span><span class="detail-value">{{ registration.registeredBy }} ({{ registration.registeredByRole }})</span></div>
					<div class="detail-item"><span class="detail-label">วันที่ดำเนินการ</span><span class="detail-value">{{ registration.processedAt || '—' }}</span></div>
					<div class="detail-item">
						<span class="detail-label">สถานะ</span>
						<StaffStatusBadge :label="registration.status" :variant="registration.status === 'ลงทะเบียนแล้ว' ? 'approved' : registration.status === 'รอตรวจสอบ' ? 'pending' : 'default'" />
					</div>
					<div class="detail-item full-width"><span class="detail-label">หมายเหตุ</span><span class="detail-value">{{ registration.note || '—' }}</span></div>
				</div>

				<div v-if="transfer" class="detail-grid">
					<div class="detail-item"><span class="detail-label">ขอรายการเมื่อ</span><span class="detail-value">{{ transfer.requestedAt }}</span></div>
					<div class="detail-item"><span class="detail-label">วันที่เสร็จสิ้น</span><span class="detail-value">{{ transfer.completedAt || '—' }}</span></div>
					<div class="detail-item"><span class="detail-label">ผู้ดำเนินการ</span><span class="detail-value">{{ transfer.handledBy || '—' }}</span></div>
					<div class="detail-item">
						<span class="detail-label">สถานะ</span>
						<StaffStatusBadge :label="transfer.status" :variant="transfer.status === 'เสร็จสิ้น' ? 'approved' : transfer.status === 'รอดำเนินการ' ? 'pending' : 'default'" />
					</div>
				</div>
			</div>

			<StaffAppModal v-model="showRegConfirm" :title="regConfirmType === 'approve' ? 'ยืนยันการอนุมัติ' : 'ยืนยันการปฏิเสธ'" size="sm">
				<template #footer>
					<button type="button" class="btn btn-secondary" @click="showRegConfirm = false">ยกเลิก</button>
					<button
						type="button"
						class="btn"
						:class="regConfirmType === 'approve' ? 'btn-approve' : 'btn-reject'"
						@click="confirmRegistrationAction"
					>{{ regConfirmType === 'approve' ? 'ยืนยันอนุมัติ' : 'ยืนยันปฏิเสธ' }}</button>
				</template>
				<p class="confirm-text" v-if="registration">
					{{ regConfirmType === 'approve' ? 'ยืนยันอนุมัติการลงทะเบียนของ' : 'ยืนยันปฏิเสธการลงทะเบียนของ' }}
					<strong>{{ registration.prefix }}{{ registration.studentName }}</strong>
					ใช่หรือไม่?
				</p>
			</StaffAppModal>

			<StaffAppModal v-model="showTransferConfirm" title="ยืนยันดำเนินการย้ายเรียน" size="sm">
				<template #footer>
					<button type="button" class="btn btn-secondary" @click="showTransferConfirm = false">ยกเลิก</button>
					<button type="button" class="btn btn-approve" @click="confirmTransferAction">ยืนยันดำเนินการเสร็จ</button>
				</template>
				<p class="confirm-text" v-if="transfer">
					ยืนยันว่ารายการย้ายเรียนของ <strong>{{ transfer.studentName }}</strong>
					ดำเนินการเสร็จสิ้นแล้วใช่หรือไม่?
				</p>
			</StaffAppModal>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRegistrarData } from '~/composables/useRegistrarData'

definePageMeta({ layout: 'staff' })

const route = useRoute()
const id = route.params.id as string
const { registrations, transfers } = useRegistrarData()

const registration = computed(() => registrations.value.find(r => r.id === id))
const transfer = computed(() => transfers.value.find(r => r.id === id))

const activeTab = ref<'general' | 'process'>('general')
const handledBy = 'นางสาวสมใจ รักงาน'
const showRegConfirm = ref(false)
const regConfirmType = ref<'approve' | 'reject'>('approve')
const showTransferConfirm = ref(false)

watch([registration, transfer], () => {
	activeTab.value = 'general'
})

const titleText = computed(() => {
	if (registration.value) return `${registration.value.prefix}${registration.value.studentName}`
	if (transfer.value) return transfer.value.studentName
	return 'ไม่พบข้อมูล'
})

const subtitleText = computed(() => {
	if (registration.value) return `ลงทะเบียนใหม่ · รหัส ${registration.value.id}`
	if (transfer.value) return `${transfer.value.transferType} · รหัส ${transfer.value.id}`
	return ''
})

function approveRegistration() {
	if (!registration.value || registration.value.status !== 'รอตรวจสอบ') return
	const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
	const idx = registrations.value.findIndex(r => r.id === id)
	if (idx !== -1) registrations.value[idx] = { ...registrations.value[idx], status: 'ลงทะเบียนแล้ว', processedAt: today }
}

function rejectRegistration() {
	if (!registration.value || registration.value.status !== 'รอตรวจสอบ') return
	const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
	const idx = registrations.value.findIndex(r => r.id === id)
	if (idx !== -1) registrations.value[idx] = { ...registrations.value[idx], status: 'ปฏิเสธ', processedAt: today }
}

function openRegConfirm(type: 'approve' | 'reject') {
	if (!registration.value || registration.value.status !== 'รอตรวจสอบ') return
	regConfirmType.value = type
	showRegConfirm.value = true
}

function confirmRegistrationAction() {
	if (regConfirmType.value === 'approve') approveRegistration()
	else rejectRegistration()
	showRegConfirm.value = false
}

function openTransferConfirm() {
	if (!transfer.value || transfer.value.status !== 'รอดำเนินการ') return
	showTransferConfirm.value = true
}

function confirmTransferAction() {
	completeTransfer()
	showTransferConfirm.value = false
}

function completeTransfer() {
	if (!transfer.value || transfer.value.status !== 'รอดำเนินการ') return
	const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
	const idx = transfers.value.findIndex(r => r.id === id)
	if (idx !== -1) transfers.value[idx] = { ...transfers.value[idx], status: 'เสร็จสิ้น', completedAt: today, handledBy }
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
.btn-approve { background: #16a34a; color: #fff; border-color: #16a34a; }
.btn-approve:hover { background: #15803d; }
.btn-reject { background: #dc2626; color: #fff; border-color: #dc2626; }
.btn-reject:hover { background: #b91c1c; }

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
.detail-item.full-width { grid-column: 1 / -1; }
.detail-label { font-size: 0.72rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
.detail-value { font-size: 0.9rem; color: #111827; font-weight: 500; }
.detail-value.mono { font-family: monospace; letter-spacing: 0.04em; }

.type-in { color: #16a34a; }
.type-out { color: #dc2626; }

.confirm-text {
	margin: 0;
	font-size: 0.9rem;
	color: #374151;
	line-height: 1.6;
}
</style>
