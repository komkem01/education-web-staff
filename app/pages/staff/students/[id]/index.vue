<template>
  <div class="page">
    <div v-if="!student" class="not-found">
      <button type="button" class="btn btn-back" @click="navigateTo('/staff/students')">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 2L3 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        กลับ
      </button>
      <p>ไม่พบข้อมูลนักเรียนเลขประจำตัว {{ id }}</p>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <button type="button" class="btn btn-back" @click="navigateTo('/staff/students')">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 2L3 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            กลับ
          </button>
          <div>
            <h2 class="page-title">{{ student.name }}</h2>
            <p class="page-desc">{{ student.class }} · เลขประจำตัว {{ student.id }}</p>
          </div>
        </div>
        <div class="header-actions">
          <button type="button" class="btn btn-edit" @click="openEdit">แก้ไข</button>
        </div>
      </div>

      <!-- Tab bar -->
      <div class="tab-bar">
        <button v-for="t in tabs" :key="t.key" type="button" class="tab-btn" :class="{ 'tab-btn--active': activeTab === t.key }" @click="activeTab = t.key">
          {{ t.label }}
        </button>
      </div>

      <!-- Tab: ข้อมูลนักเรียน -->
      <div v-show="activeTab === 'general'">
        <div class="detail-card">
          <p class="section-title">ข้อมูลวิชาการ</p>
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">เลขประจำตัว</span><span class="detail-value mono">{{ student.id }}</span></div>
            <div class="detail-item"><span class="detail-label">ชั้น/ห้อง</span><span class="detail-value">{{ student.class }}</span></div>
            <div class="detail-item"><span class="detail-label">ครูที่ปรึกษา</span><span class="detail-value">{{ student.advisor }}</span></div>
            <div class="detail-item"><span class="detail-label">เกรดเฉลี่ย (GPA)</span><span class="detail-value" :class="gpaClass">{{ student.gpa }}</span></div>
          </div>
        </div>
        <div class="detail-card" style="margin-top:16px">
          <p class="section-title">ข้อมูลความประพฤติ</p>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">คะแนนความประพฤติ</span>
              <span class="detail-value" :class="discClass">{{ student.discipline }}<span class="disc-max">/100</span></span>
            </div>
            <div class="detail-item"><span class="detail-label">ระดับ</span><span class="detail-value">{{ discLabel }}</span></div>
          </div>
        </div>
      </div>

      <!-- Tab: ผู้ปกครอง -->
      <div v-show="activeTab === 'parent'">
        <div class="detail-card">
          <p class="section-title">ข้อมูลผู้ปกครอง</p>
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">ความสัมพันธ์</span><span class="detail-value">{{ student.parent.relation }}</span></div>
            <div class="detail-item"><span class="detail-label">ชื่อผู้ปกครอง</span><span class="detail-value">{{ student.parent.name }}</span></div>
            <div class="detail-item"><span class="detail-label">เบอร์โทรศัพท์</span><span class="detail-value">{{ student.parent.phone }}</span></div>
            <div class="detail-item"><span class="detail-label">อาชีพ</span><span class="detail-value">{{ student.parent.occupation }}</span></div>
          </div>
        </div>
      </div>

      <!-- Tab: ประวัติวิชาการ -->
      <div v-show="activeTab === 'academic'">
        <div class="detail-card">
          <p class="section-title">ประวัติวิชาการ</p>
          <div v-if="student.academicHistory.length === 0" class="empty-state">ยังไม่มีข้อมูลประวัติวิชาการ</div>
          <div v-for="(rec, idx) in student.academicHistory" :key="idx" class="history-card">
            <div class="hc-title">ปีการศึกษา {{ rec.year }} เทอม {{ rec.semester }}</div>
            <div class="hc-meta">
              <span>GPA {{ rec.gpa }}</span>
              <span>{{ rec.note }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <StaffAppModal v-model="showEdit" :title="editModalTitle" size="md">
        <template #footer>
          <button type="button" class="btn btn-secondary" @click="showEdit = false">ยกเลิก</button>
          <button type="button" class="btn btn-primary" @click="saveEdit">บันทึก</button>
        </template>
        <div v-if="editMode === 'general'" class="form-body">
          <div class="form-row">
            <div class="form-group flex-2">
              <label class="form-label">ชื่อ-นามสกุล</label>
              <input v-model="editForm.name" class="input" type="text" />
            </div>
            <div class="form-group">
              <label class="form-label">ชั้น/ห้อง</label>
              <input v-model="editForm.class" class="input" type="text" placeholder="ม.x/x" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">ครูที่ปรึกษา</label>
              <input v-model="editForm.advisor" class="input" type="text" />
            </div>
            <div class="form-group">
              <label class="form-label">เกรดเฉลี่ย</label>
              <input v-model="editForm.gpa" class="input" type="text" placeholder="0.00 - 4.00" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">คะแนนความประพฤติ</label>
              <input v-model.number="editForm.discipline" class="input" type="number" min="0" max="100" />
            </div>
          </div>
        </div>
        <div v-else-if="editMode === 'parent'" class="form-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">ความสัมพันธ์</label>
              <select v-model="parentForm.relation" class="input">
                <option>บิดา</option>
                <option>มารดา</option>
                <option>ปู่</option>
                <option>ย่า</option>
                <option>ตา</option>
                <option>ยาย</option>
                <option>ผู้ปกครอง</option>
              </select>
            </div>
            <div class="form-group flex-2">
              <label class="form-label">ชื่อผู้ปกครอง</label>
              <input v-model="parentForm.name" class="input" type="text" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">เบอร์โทรศัพท์</label>
              <input v-model="parentForm.phone" class="input" type="tel" />
            </div>
            <div class="form-group">
              <label class="form-label">อาชีพ</label>
              <input v-model="parentForm.occupation" class="input" type="text" />
            </div>
          </div>
        </div>
        <div v-else class="form-body">
          <div class="form-tools">
            <button type="button" class="btn btn-secondary btn-sm" @click="addAcademicRecord">+ เพิ่มประวัติวิชาการ</button>
          </div>
          <div v-if="academicForm.length === 0" class="empty-state">ยังไม่มีข้อมูลประวัติวิชาการ</div>
          <div v-for="(record, idx) in academicForm" :key="`acad-${idx}`" class="edit-block">
            <div class="edit-block-head">
              <strong>รายการที่ {{ idx + 1 }}</strong>
              <button type="button" class="btn btn-delete btn-sm" @click="removeAcademicRecord(idx)">ลบ</button>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">ปีการศึกษา</label>
                <input v-model="record.year" class="input" type="text" placeholder="2566" />
              </div>
              <div class="form-group">
                <label class="form-label">ภาคเรียน</label>
                <input v-model="record.semester" class="input" type="text" placeholder="1" />
              </div>
              <div class="form-group">
                <label class="form-label">GPA</label>
                <input v-model="record.gpa" class="input" type="text" placeholder="3.50" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">หมายเหตุ</label>
                <input v-model="record.note" class="input" type="text" />
              </div>
            </div>
          </div>
        </div>
      </StaffAppModal>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStudentsData } from '~/composables/useStudentsData'
import type { ParentInfo, AcademicRecord } from '~/composables/useStudentsData'

definePageMeta({ layout: 'staff' })

const route = useRoute()
const id = route.params.id as string
const { rows, updateRow } = useStudentsData()

const student = computed(() => rows.value.find(r => r.id === id))

const activeTab = ref<'general' | 'parent' | 'academic'>('general')
const tabs = [
  { key: 'general', label: 'ข้อมูลนักเรียน' },
  { key: 'parent', label: 'ผู้ปกครอง' },
  { key: 'academic', label: 'ประวัติวิชาการ' },
]

const showEdit = ref(false)
const editMode = ref<'general' | 'parent' | 'academic'>('general')
const editForm = ref({ name: '', class: '', advisor: '', gpa: '', discipline: 0 })
const parentForm = ref<ParentInfo>({ relation: 'ผู้ปกครอง', name: '', phone: '', occupation: '' })
const academicForm = ref<AcademicRecord[]>([])

const editModalTitle = computed(() => {
  if (editMode.value === 'parent') return 'แก้ไขข้อมูลผู้ปกครอง'
  if (editMode.value === 'academic') return 'แก้ไขประวัติวิชาการ'
  return 'แก้ไขข้อมูลนักเรียน'
})

function openEdit() {
  if (!student.value) return
  const s = student.value
  editMode.value = activeTab.value
  editForm.value = {
    name: s.name,
    class: s.class,
    advisor: s.advisor,
    gpa: s.gpa,
    discipline: s.discipline,
  }
  parentForm.value = { ...s.parent }
  academicForm.value = s.academicHistory.map(record => ({ ...record }))
  showEdit.value = true
}

function saveEdit() {
  if (editMode.value === 'general') {
    updateRow(id, editForm.value)
  } else if (editMode.value === 'parent') {
    updateRow(id, { parent: { ...parentForm.value } })
  } else {
    updateRow(id, { academicHistory: academicForm.value.map(record => ({ ...record })) })
  }
  showEdit.value = false
}

function addAcademicRecord() {
  academicForm.value.push({ year: '', semester: '', gpa: '', note: '' })
}

function removeAcademicRecord(index: number) {
  academicForm.value.splice(index, 1)
}

const gpaClass = computed(() => {
  const g = parseFloat(student.value?.gpa || '0')
  return g >= 3.5 ? 'gpa-high' : g >= 2.5 ? 'gpa-mid' : 'gpa-low'
})

const discClass = computed(() => {
  const d = student.value?.discipline ?? 0
  return d >= 90 ? 'disc-high' : d >= 70 ? 'disc-mid' : 'disc-low'
})

const discLabel = computed(() => {
  const d = student.value?.discipline ?? 0
  return d >= 90 ? 'ดีเยี่ยม' : d >= 80 ? 'ดี' : d >= 70 ? 'พอใช้' : 'ต้องปรับปรุง'
})
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
.disc-max { font-size: 0.75rem; color: #9ca3af; font-weight: 400; margin-left: 2px; }

.gpa-high { color: #16a34a; }
.gpa-mid { color: #d97706; }
.gpa-low { color: #dc2626; }
.disc-high { color: #16a34a; }
.disc-mid { color: #d97706; }
.disc-low { color: #dc2626; }

.empty-state { text-align: center; color: #9ca3af; font-size: 0.875rem; padding: 32px 0; }

.history-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 18px; margin-bottom: 10px; background: #fafafa; }
.history-card:last-child { margin-bottom: 0; }
.hc-title { font-size: 0.9rem; font-weight: 700; color: #111827; margin-bottom: 6px; }
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
.form-tools { display: flex; justify-content: flex-end; }
.form-row { display: flex; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 5px; flex: 1; }
.form-group.flex-2 { flex: 2; }
.form-label { font-size: 0.8rem; font-weight: 600; color: #374151; }
.input { width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; font-family: inherit; color: #111827; background: #fff; outline: none; box-sizing: border-box; }
.input:focus { border-color: #1d4ed8; }

.edit-block { border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; background: #fafafa; }
.edit-block-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; font-size: 0.82rem; color: #374151; }

.btn-delete { border-color: #fecaca; color: #b91c1c; background: #fff1f2; }
.btn-delete:hover { background: #ffe4e6; }
.btn-sm { padding: 6px 10px; font-size: 0.78rem; }

@media (max-width: 900px) {
  .form-row { flex-direction: column; }
}
</style>
