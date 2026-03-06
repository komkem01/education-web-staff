<template>
  <div class="page">
    <div class="back-row">
      <button type="button" class="btn-back" @click="navigateTo('/staff/teachers')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        กลับรายการครู
      </button>
    </div>

    <div v-if="!teacher" class="not-found">
      <p>ไม่พบข้อมูลครูรหัส {{ id }}</p>
      <button type="button" class="btn btn-secondary" @click="navigateTo('/staff/teachers')">กลับ</button>
    </div>

    <template v-else>
      <!-- Profile Header -->
      <div class="profile-card">
        <div class="avatar">{{ teacher.prefix[0] }}{{ teacher.firstName[0] }}</div>
        <div class="profile-info">
          <h2 class="profile-name">{{ teacher.prefix }}{{ teacher.firstName }} {{ teacher.lastName }}</h2>
          <p class="profile-sub">{{ teacher.position }} · {{ teacher.subjectGroup }}</p>
          <p class="profile-id">รหัสครู: <span class="id-badge">{{ teacher.id }}</span></p>
        </div>
        <div class="profile-actions">
          <StaffStatusBadge
            :label="teacher.status"
            :variant="teacher.status === 'อนุมัติแล้ว' ? 'approved' : teacher.status === 'รออนุมัติ' ? 'pending' : 'default'"
          />
          <button v-if="teacher.status === 'รออนุมัติ'" type="button" class="btn btn-approve-lg" @click="doApprove">
            อนุมัติครู
          </button>
          <button type="button" class="btn btn-edit-lg" @click="showEdit = true">แก้ไขข้อมูล</button>
        </div>
      </div>

      <!-- Detail Sections -->
      <div class="sections">
        <!-- Contact -->
        <div class="section-card">
          <h3 class="section-title">ข้อมูลการติดต่อ</h3>
          <div class="field"><span class="fl">อีเมล</span><a :href="'mailto:' + teacher.email" class="link">{{ teacher.email }}</a></div>
          <div class="field"><span class="fl">โทรศัพท์</span><span class="fv">{{ teacher.phone }}</span></div>
        </div>

        <!-- Academic -->
        <div class="section-card">
          <h3 class="section-title">ข้อมูลการสอน</h3>
          <div class="field"><span class="fl">กลุ่มสาระ</span><span class="fv">{{ teacher.subjectGroup }}</span></div>
          <div class="field"><span class="fl">ตำแหน่ง</span><span class="fv">{{ teacher.position }}</span></div>
          <div class="field"><span class="fl">ครูที่ปรึกษาห้อง</span><span class="fv">{{ teacher.advisorClass || '-' }}</span></div>
          <div class="field"><span class="fl">จำนวนวิชาที่สอน</span><span class="fv">{{ teacher.courses }} วิชา</span></div>
        </div>

        <!-- Employment -->
        <div class="section-card">
          <h3 class="section-title">ข้อมูลการทำงาน</h3>
          <div class="field"><span class="fl">วันที่เริ่มงาน</span><span class="fv">{{ teacher.joinDate }}</span></div>
          <div class="field"><span class="fl">สถานะบัญชี</span>
            <StaffStatusBadge :label="teacher.status" :variant="teacher.status === 'อนุมัติแล้ว' ? 'approved' : teacher.status === 'รออนุมัติ' ? 'pending' : 'default'" />
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
              <label class="form-label">เลขวันที่เริ่มงาน</label>
              <input v-model="editForm.joinDate" class="input" type="text" placeholder="1 พ.ค. 256x" />
            </div>
          </div>
        </div>
      </StaffAppModal>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTeachersData } from '~/composables/useTeachersData'

definePageMeta({ layout: 'staff' })

const route = useRoute()
const id = route.params.id as string
const { rows, updateRow, approveRow } = useTeachersData()

const teacher = computed(() => rows.value.find(r => r.id === id))

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

function doApprove() {
  approveRow(id)
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }
.back-row { display: flex; }
.btn-back { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: #1d4ed8; font-size: 0.875rem; font-weight: 500; cursor: pointer; padding: 6px 0; font-family: inherit; }
.btn-back:hover { text-decoration: underline; }

.not-found { text-align: center; padding: 60px 0; color: #6b7280; }

.profile-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 28px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.avatar { width: 64px; height: 64px; background: linear-gradient(135deg, #1d4ed8, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.4rem; font-weight: 700; flex-shrink: 0; }
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

.sections { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.section-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; }
.section-title { font-size: 0.875rem; font-weight: 700; color: #111827; margin: 0 0 14px; padding-bottom: 10px; border-bottom: 1px solid #f3f4f6; }
.field { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid #f9fafb; }
.field:last-child { border-bottom: none; }
.fl { font-size: 0.8rem; color: #9ca3af; min-width: 120px; }
.fv { font-size: 0.875rem; color: #111827; font-weight: 500; text-align: right; }
.link { font-size: 0.875rem; color: #1d4ed8; text-decoration: none; }
.link:hover { text-decoration: underline; }

.form-body { display: flex; flex-direction: column; gap: 14px; }
.form-row { display: flex; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 5px; flex: 1; }
.form-group.flex-2 { flex: 2; }
.form-label { font-size: 0.8rem; font-weight: 600; color: #374151; }
.input { width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; font-family: inherit; color: #111827; background: #fff; outline: none; box-sizing: border-box; }
.input:focus { border-color: #1d4ed8; }
</style>
