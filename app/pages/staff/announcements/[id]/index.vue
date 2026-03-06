<template>
  <div class="page">
    <div class="back-row">
      <button type="button" class="btn-back" @click="navigateTo('/staff/announcements')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        กลับรายการประกาศ
      </button>
    </div>

    <div v-if="!announcement" class="not-found">
      <p>ไม่พบประกาศ {{ id }}</p>
      <button type="button" class="btn btn-secondary" @click="navigateTo('/staff/announcements')">กลับ</button>
    </div>

    <template v-else>
      <!-- Announcement Card -->
      <div class="ann-card">
        <div class="ann-header">
          <div class="ann-meta">
            <span class="id-badge">{{ announcement.id }}</span>
            <span class="category-chip">{{ announcement.category }}</span>
            <StaffStatusBadge
              :label="announcement.status"
              :variant="announcement.status === 'เผยแพร่แล้ว' ? 'approved' : 'default'"
            />
          </div>
          <h2 class="ann-title">{{ announcement.title }}</h2>
          <div class="ann-info">
            <span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#9ca3af" stroke-width="1.3"/><path d="M7 4v3l2 2" stroke="#9ca3af" stroke-width="1.3" stroke-linecap="round"/></svg>
              {{ announcement.date }}
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2.5" stroke="#9ca3af" stroke-width="1.3"/><path d="M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="#9ca3af" stroke-width="1.3" stroke-linecap="round"/></svg>
              {{ announcement.author }}
            </span>
          </div>
        </div>

        <!-- Content body (mock content per announcement) -->
        <div class="ann-body">
          <p>{{ mockContent }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAnnouncementsData } from '~/composables/useAnnouncementsData'

definePageMeta({ layout: 'staff' })

const route = useRoute()
const id = route.params.id as string
const { rows } = useAnnouncementsData()

const announcement = computed(() => rows.value.find(r => r.id === id))

const mockContent = computed(() => {
  const contentMap: Record<string, string> = {
    A001: 'ฝ่ายวิชาการแจ้งให้ทราบว่ากำหนดการสอบกลางภาค ภาคเรียนที่ 1/2568 จะจัดขึ้นระหว่างวันที่ 20-25 มีนาคม 2568 ขอให้ครูทุกท่านจัดส่งข้อสอบภายในวันที่ 15 มีนาคม 2568 และขอให้ครูประจำวิชาแจ้งนักเรียนทราบตารางสอบตามที่ฝ่ายวิชาการจัดส่งให้',
    A002: 'โรงเรียนเปิดรับสมัครนักเรียนใหม่ประจำปีการศึกษา 2569 ในระดับชั้น ม.1 และ ม.4 สามารถสมัครได้ที่ห้องทะเบียน ชั้น 1 อาคารบริหารงาน หรือทางออนไลน์ที่เว็บไซต์โรงเรียน ตั้งแต่วันที่ 1-31 มีนาคม 2568',
    A003: 'แจ้งครูทุกท่านเข้าร่วมประชุมประจำเดือนมีนาคม 2568 ในวันศุกร์ที่ 8 มีนาคม 2568 เวลา 15.30-17.00 น. ณ ห้องประชุมใหญ่ชั้น 4 วาระการประชุมจะแจ้งให้ทราบก่อนวันประชุม 2 วัน',
    A004: 'กิจกรรมวันกีฬาสีประจำปี 2568 จะจัดขึ้นในวันที่ 22 มีนาคม 2568 ณ สนามกีฬากลางโรงเรียน ขอเชิญทุกท่านเข้าร่วมกิจกรรมพร้อมสวมเสื้อสีของบ้านที่ตนสังกัด',
    A005: 'แจ้งนักเรียนห้อง ม.3/1 ให้ส่งการบ้านพิเศษวิชาคณิตศาสตร์ ภายในวันศุกร์ที่ 7 มีนาคม 2568 หากไม่ส่งภายในกำหนดจะถูกหักคะแนนเก็บ',
  }
  return contentMap[id] || 'ไม่มีเนื้อหาประกาศเพิ่มเติม'
})
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }
.back-row { display: flex; }
.btn-back { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: #1d4ed8; font-size: 0.875rem; font-weight: 500; cursor: pointer; padding: 6px 0; font-family: inherit; }
.btn-back:hover { text-decoration: underline; }
.not-found { text-align: center; padding: 60px 0; color: #6b7280; }

.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 7px; padding: 8px 16px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid transparent; font-family: inherit; }
.btn-secondary { background: #fff; color: #374151; border-color: #e5e7eb; }

.ann-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
.ann-header { padding: 24px 28px 20px; border-bottom: 1px solid #f3f4f6; }
.ann-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.id-badge { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 5px; padding: 2px 8px; font-size: 0.75rem; font-family: monospace; color: #374151; }
.category-chip { background: #eff6ff; color: #1d4ed8; border-radius: 9999px; padding: 2px 10px; font-size: 0.75rem; font-weight: 600; }
.ann-title { font-size: 1.3rem; font-weight: 700; color: #111827; margin: 0 0 10px; line-height: 1.4; }
.ann-info { display: flex; gap: 18px; flex-wrap: wrap; }
.ann-info span { display: inline-flex; align-items: center; gap: 5px; font-size: 0.8rem; color: #9ca3af; }
.ann-body { padding: 24px 28px; }
.ann-body p { font-size: 0.95rem; color: #374151; line-height: 1.75; margin: 0; }
</style>
