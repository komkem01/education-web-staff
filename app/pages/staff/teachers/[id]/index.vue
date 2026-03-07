<template>
  <div class="page">
    <div v-if="!teacher" class="not-found">
      <button type="button" class="btn btn-back" @click="navigateTo('/staff/teachers')">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 2L3 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        กลับ
      </button>
      <p>ไม่พบข้อมูลครูรหัส {{ id }}</p>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <button type="button" class="btn btn-back" @click="navigateTo('/staff/teachers')">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 2L3 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            กลับ
          </button>
          <div>
            <h2 class="page-title">{{ teacher.prefix }}{{ teacher.firstName }} {{ teacher.lastName }}</h2>
            <p class="page-desc">{{ teacher.subjectGroup }} · รหัส {{ teacher.id }}</p>
          </div>
        </div>
        <div class="header-actions">
          <button type="button" class="btn btn-edit" @click="showEdit = true">แก้ไข</button>
        </div>
      </div>

      <!-- Tab bar -->
      <div class="tab-bar">
        <button v-for="t in tabs" :key="t.key" type="button" class="tab-btn" :class="{ 'tab-btn--active': activeTab === t.key }" @click="activeTab = t.key">
          {{ t.label }}
        </button>
      </div>

      <!-- Tab: ข้อมูลครู -->
      <div v-show="activeTab === 'general'">
        <div class="detail-card">
          <p class="section-title">ข้อมูลการสอน</p>
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">รหัสครู</span><span class="detail-value mono">{{ teacher.id }}</span></div>
            <div class="detail-item"><span class="detail-label">กลุ่มสาระ</span><span class="detail-value">{{ teacher.subjectGroup }}</span></div>
            <div class="detail-item"><span class="detail-label">ตำแหน่ง</span><span class="detail-value">{{ teacher.position }}</span></div>
            <div class="detail-item"><span class="detail-label">ครูที่ปรึกษาห้อง</span><span class="detail-value">{{ teacher.advisorClass || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">จำนวนวิชาที่สอน</span><span class="detail-value">{{ teacher.courses }} วิชา</span></div>
            <div class="detail-item"><span class="detail-label">วันที่เริ่มงาน</span><span class="detail-value">{{ teacher.joinDate }}</span></div>
          </div>
        </div>
        <div class="detail-card" style="margin-top:16px">
          <p class="section-title">ข้อมูลการติดต่อ</p>
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">อีเมล</span><a :href="'mailto:' + teacher.email" class="detail-link">{{ teacher.email }}</a></div>
            <div class="detail-item"><span class="detail-label">โทรศัพท์</span><span class="detail-value">{{ teacher.phone }}</span></div>
          </div>
        </div>
      </div>

      <!-- Tab: ประวัติการศึกษา -->
      <div v-show="activeTab === 'education'">
        <div class="detail-card">
          <p class="section-title">ประวัติการศึกษา</p>
          <div v-if="teacher.education.length === 0" class="empty-state">ยังไม่มีข้อมูลประวัติการศึกษา</div>
          <div v-for="(edu, idx) in teacher.education" :key="idx" class="history-card">
            <div class="hc-title">{{ edu.degree }} · {{ edu.major }}</div>
            <div class="hc-sub">{{ edu.institution }}</div>
            <div class="hc-meta">
              <span>ปี {{ edu.year }}</span>
              <span v-if="edu.gpa">GPA {{ edu.gpa }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: ประวัติการทำงาน -->
      <div v-show="activeTab === 'work'">
        <div class="detail-card">
          <p class="section-title">ประวัติการทำงาน</p>
          <div v-if="teacher.workHistory.length === 0" class="empty-state">ยังไม่มีข้อมูลประวัติการทำงาน</div>
          <div v-for="(work, idx) in teacher.workHistory" :key="idx" class="history-card">
            <div class="hc-title">{{ work.position }}</div>
            <div class="hc-sub">{{ work.organization }}</div>
            <div class="hc-meta">
              <span>{{ work.startYear }} — {{ work.endYear || 'ปัจจุบัน' }}</span>
              <span v-if="work.note">{{ work.note }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <StaffAppModal v-model="showEdit" title="แก้ไขข้อมูลครู" size="md">
        <template #footer>
          <button type="button" class="btn btn-secondary" @click="showEdit = false">ยกเลิก</button>
          <button type="button" class="btn btn-primary" @click="saveEdit">บันทึก</button>
        </template>
        <div class="form-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">คำนำหน้า</label>
              <select v-model="editForm.prefix" class="input"><option>นาย</option><option>นาง</option><option>นางสาว</option></select>
            </div>
            <div class="form-group flex-2">
              <label class="form-label">ชื่อ</label>
              <input v-model="editForm.firstName" class="input" type="text" />
            </div>
            <div class="form-group flex-2">
              <label class="form-label">นามสกุล</label>
              <input v-model="editForm.lastName" class="input" type="text" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">อีเมล</label>
              <input v-model="editForm.email" class="input" type="email" />
            </div>
            <div class="form-group">
              <label class="form-label">โทรศัพท์</label>
              <input v-model="editForm.phone" class="input" type="tel" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">กลุ่มสาระ</label>
              <select v-model="editForm.subjectGroup" class="input">
                <option>ภาษาไทย</option><option>คณิตศาสตร์</option><option>วิทยาศาสตร์</option>
                <option>สังคมศึกษา</option><option>ภาษาต่างประเทศ</option><option>ศิลปะ</option><option>พลศึกษา</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">ตำแหน่ง</label>
              <select v-model="editForm.position" class="input">
                <option>ครูผู้ช่วย</option><option>ครู</option><option>ครูชำนาญการ</option><option>ครูชำนาญการพิเศษ</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">ครูที่ปรึกษาห้อง</label>
              <input v-model="editForm.advisorClass" class="input" type="text" placeholder="เช่น ม.3/1" />
            </div>
            <div class="form-group">
              <label class="form-label">วันที่เริ่มงาน</label>
              <input v-model="editForm.joinDate" class="input" type="text" placeholder="1 พ.ค. 256x" />
            </div>
          </div>
        </div>
      </StaffAppModal>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTeachersData } from '~/composables/useTeachersData'

definePageMeta({ layout: 'staff' })

const route = useRoute()
const id = route.params.id as string
const { rows, updateRow } = useTeachersData()

const teacher = computed(() => rows.value.find(r => r.id === id))

const activeTab = ref<'general' | 'education' | 'work'>('general')
const tabs = [
  { key: 'general', label: 'ข้อมูลครู' },
  { key: 'education', label: 'ประวัติการศึกษา' },
  { key: 'work', label: 'ประวัติการทำงาน' },
]

const showEdit = ref(false)
const editForm = ref({ prefix: '', firstName: '', lastName: '', email: '', phone: '', subjectGroup: '', position: '', advisorClass: '', joinDate: '' })

watch(showEdit, (v) => {
  if (v && teacher.value) {
    const t = teacher.value
    editForm.value = { prefix: t.prefix, firstName: t.firstName, lastName: t.lastName, email: t.email, phone: t.phone, subjectGroup: t.subjectGroup, position: t.position, advisorClass: t.advisorClass, joinDate: t.joinDate }
  }
})

function saveEdit() {
  updateRow(id, editForm.value)
  showEdit.value = false
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

.btn-back { color: #6b7280; padding: 7px 12px; font-size: 0.82rem; border-color: #d1d5db; margin-top: 2px; }
.btn-back:hover { background: #f3f4f6; }

.tab-bar { display: flex; gap: 0; border-bottom: 2px solid #e5e7eb; }
.tab-btn { padding: 9px 18px; font-size: 0.875rem; font-weight: 500; color: #6b7280; background: none; border: none; border-bottom: 2px solid transparent; margin-bottom: -2px; cursor: pointer; font-family: inherit; transition: color 0.12s, border-color 0.12s; white-space: nowrap; }
.tab-btn:hover { color: #374151; }
.tab-btn--active { color: #1d4ed8; border-bottom-color: #1d4ed8; }

.detail-card { background: #fff; border: 1px solid #e8eaed; border-radius: 12px; padding: 24px; }
.section-title { font-size: 0.75rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 18px; padding-bottom: 10px; border-bottom: 1px solid #f3f4f6; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 32px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-label { font-size: 0.72rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
.detail-value { font-size: 0.9rem; color: #111827; font-weight: 500; }
.detail-value.mono { font-family: monospace; letter-spacing: 0.04em; }
.detail-link { font-size: 0.9rem; color: #1d4ed8; text-decoration: none; font-weight: 500; }
.detail-link:hover { text-decoration: underline; }

.empty-state { text-align: center; color: #9ca3af; font-size: 0.875rem; padding: 32px 0; }

.history-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 18px; margin-bottom: 10px; background: #fafafa; }
.history-card:last-child { margin-bottom: 0; }
.hc-title { font-size: 0.9rem; font-weight: 700; color: #111827; margin-bottom: 3px; }
.hc-sub { font-size: 0.85rem; color: #374151; margin-bottom: 6px; }
.hc-meta { display: flex; gap: 12px; font-size: 0.78rem; color: #6b7280; }

.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 8px; padding: 8px 14px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid #d1d5db; background: #fff; color: #374151; font-family: inherit; transition: background 0.12s; }
.btn:hover { background: #f9fafb; }
.btn-edit { border-color: #d1d5db; background: #f9fafb; }
.btn-edit:hover { background: #f3f4f6; }
.btn-secondary { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-secondary:hover { background: #f9fafb; }
.btn-primary { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
.btn-primary:hover { background: #1e40af; }

.form-body { display: flex; flex-direction: column; gap: 14px; }
.form-row { display: flex; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 5px; flex: 1; }
.form-group.flex-2 { flex: 2; }
.form-label { font-size: 0.8rem; font-weight: 600; color: #374151; }
.input { width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; font-family: inherit; color: #111827; background: #fff; outline: none; box-sizing: border-box; }
.input:focus { border-color: #1d4ed8; }
</style>
