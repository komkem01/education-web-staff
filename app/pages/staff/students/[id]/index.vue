<template>
  <div class="page">
    <div class="back-row">
      <button type="button" class="btn-back" @click="navigateTo('/staff/students')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        กลับรายการนักเรียน
      </button>
    </div>

    <div v-if="!student" class="not-found">
      <p>ไม่พบข้อมูลนักเรียนเลขประจำตัว {{ id }}</p>
      <button type="button" class="btn btn-secondary" @click="navigateTo('/staff/students')">กลับ</button>
    </div>

    <template v-else>
      <!-- Profile Header -->
      <div class="profile-card">
        <div class="avatar">{{ student.name[0] }}</div>
        <div class="profile-info">
          <h2 class="profile-name">{{ student.name }}</h2>
          <p class="profile-sub">{{ student.class }} · ครูที่ปรึกษา: {{ student.advisor }}</p>
          <p class="profile-id">เลขประจำตัว: <span class="id-badge">{{ student.id }}</span></p>
        </div>
        <div class="profile-actions">
          <StaffStatusBadge
            :label="student.status"
            :variant="student.status === 'ปกติ' ? 'approved' : student.status === 'รออนุมัติ' ? 'pending' : 'default'"
          />
          <button v-if="student.status === 'รออนุมัติ'" type="button" class="btn btn-approve-lg" @click="doApprove">อนุมัติ</button>
          <button type="button" class="btn btn-edit-lg" @click="showEdit = true">แก้ไขข้อมูล</button>
        </div>
      </div>

      <!-- Detail Sections -->
      <div class="sections">
        <!-- Academic -->
        <div class="section-card">
          <h3 class="section-title">ข้อมูลวิชาการ</h3>
          <div class="field"><span class="fl">ชั้น/ห้อง</span><span class="fv">{{ student.class }}</span></div>
          <div class="field"><span class="fl">ครูที่ปรึกษา</span><span class="fv">{{ student.advisor }}</span></div>
          <div class="field"><span class="fl">เกรดเฉลี่ย (GPA)</span><span class="fv gpa" :class="gpaClass">{{ student.gpa }}</span></div>
        </div>

        <!-- Discipline -->
        <div class="section-card">
          <h3 class="section-title">ข้อมูลวินัย</h3>
          <div class="field"><span class="fl">คะแนนความประพฤติ</span>
            <span class="fv disc" :class="discClass">{{ student.discipline }}<span class="disc-max">/100</span></span>
          </div>
          <div class="field"><span class="fl">ระดับ</span><span class="fv">{{ discLabel }}</span></div>
        </div>

        <!-- Status -->
        <div class="section-card">
          <h3 class="section-title">สถานะการเรียน</h3>
          <div class="field"><span class="fl">สถานะ</span>
            <StaffStatusBadge :label="student.status" :variant="student.status === 'ปกติ' ? 'approved' : student.status === 'รออนุมัติ' ? 'pending' : 'default'" />
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <StaffAppModal v-model="showEdit" title="แก้ไขข้อมูลนักเรียน" size="md">
        <template #footer>
          <button type="button" class="btn btn-secondary" @click="showEdit = false">ยกเลิก</button>
          <button type="button" class="btn btn-primary" @click="saveEdit">บันทึก</button>
        </template>
        <div class="form-body">
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
            <div class="form-group">
              <label class="form-label">สถานะ</label>
              <select v-model="editForm.status" class="input">
                <option>ปกติ</option>
                <option>รออนุมัติ</option>
                <option>ย้ายออก</option>
                <option>พ้นสภาพ</option>
              </select>
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

definePageMeta({ layout: 'staff' })

const route = useRoute()
const id = route.params.id as string
const { rows, updateRow } = useStudentsData()

const student = computed(() => rows.value.find(r => r.id === id))

const showEdit = ref(false)
const editForm = ref({ name: '', class: '', advisor: '', gpa: '', discipline: 0, status: '' })

watch(showEdit, (v) => {
  if (v && student.value) {
    const s = student.value
    editForm.value = { name: s.name, class: s.class, advisor: s.advisor, gpa: s.gpa, discipline: s.discipline, status: s.status }
  }
})

function saveEdit() {
  updateRow(id, editForm.value)
  showEdit.value = false
}

function doApprove() {
  updateRow(id, { status: 'ปกติ' })
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
.back-row { display: flex; }
.btn-back { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: #1d4ed8; font-size: 0.875rem; font-weight: 500; cursor: pointer; padding: 6px 0; font-family: inherit; }
.btn-back:hover { text-decoration: underline; }
.not-found { text-align: center; padding: 60px 0; color: #6b7280; }
.profile-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 28px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.avatar { width: 64px; height: 64px; background: linear-gradient(135deg, #0ea5e9, #1d4ed8); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.4rem; font-weight: 700; flex-shrink: 0; }
.profile-info { flex: 1; min-width: 200px; }
.profile-name { font-size: 1.2rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
.profile-sub { font-size: 0.875rem; color: #6b7280; margin: 0 0 6px; }
.profile-id { font-size: 0.8rem; color: #9ca3af; margin: 0; }
.id-badge { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 5px; padding: 1px 7px; font-size: 0.75rem; font-family: monospace; color: #374151; }
.profile-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 7px; padding: 8px 16px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: background 0.12s; }
.btn-edit-lg { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-edit-lg:hover { background: #f9fafb; }
.btn-approve-lg { background: #16a34a; color: #fff; }
.btn-approve-lg:hover { background: #15803d; }
.btn-secondary { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-secondary:hover { background: #f9fafb; }
.btn-primary { background: #1d4ed8; color: #fff; }
.btn-primary:hover { background: #1e40af; }
.sections { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.section-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; }
.section-title { font-size: 0.875rem; font-weight: 700; color: #111827; margin: 0 0 14px; padding-bottom: 10px; border-bottom: 1px solid #f3f4f6; }
.field { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid #f9fafb; }
.field:last-child { border-bottom: none; }
.fl { font-size: 0.8rem; color: #9ca3af; min-width: 120px; }
.fv { font-size: 0.875rem; color: #111827; font-weight: 500; text-align: right; }
.gpa-high { color: #16a34a; font-weight: 700; }
.gpa-mid { color: #d97706; }
.gpa-low { color: #dc2626; }
.disc { font-size: 1rem; font-weight: 700; }
.disc-max { font-size: 0.75rem; color: #9ca3af; font-weight: 400; margin-left: 2px; }
.disc-high { color: #16a34a; }
.disc-mid { color: #d97706; }
.disc-low { color: #dc2626; }
.form-body { display: flex; flex-direction: column; gap: 14px; }
.form-row { display: flex; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 5px; flex: 1; }
.form-group.flex-2 { flex: 2; }
.form-label { font-size: 0.8rem; font-weight: 600; color: #374151; }
.input { width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; font-family: inherit; color: #111827; background: #fff; outline: none; box-sizing: border-box; }
.input:focus { border-color: #1d4ed8; }
</style>
