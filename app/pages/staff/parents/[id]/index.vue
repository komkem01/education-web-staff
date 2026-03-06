<template>
  <div class="page">
    <div class="back-row">
      <button type="button" class="btn-back" @click="navigateTo('/staff/parents')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        กลับรายการผู้ปกครอง
      </button>
    </div>

    <div v-if="!parent" class="not-found">
      <p>ไม่พบข้อมูลผู้ปกครองรหัส {{ id }}</p>
      <button type="button" class="btn btn-secondary" @click="navigateTo('/staff/parents')">กลับ</button>
    </div>

    <template v-else>
      <!-- Profile Header -->
      <div class="profile-card">
        <div class="avatar">{{ parent.prefix[0] }}{{ parent.firstName[0] }}</div>
        <div class="profile-info">
          <h2 class="profile-name">{{ parent.prefix }}{{ parent.firstName }} {{ parent.lastName }}</h2>
          <p class="profile-sub">{{ parent.relation }} ของ {{ parent.studentName }}</p>
          <p class="profile-id">รหัส: <span class="id-badge">{{ parent.id }}</span></p>
        </div>
        <div class="profile-actions">
          <StaffStatusBadge
            :label="parent.status"
            :variant="parent.status === 'ใช้งาน' ? 'approved' : 'default'"
          />
          <button type="button" class="btn btn-edit-lg" @click="showEdit = true">แก้ไขข้อมูล</button>
        </div>
      </div>

      <!-- Detail Sections -->
      <div class="sections">
        <!-- Contact -->
        <div class="section-card">
          <h3 class="section-title">ข้อมูลการติดต่อ</h3>
          <div class="field"><span class="fl">โทรศัพท์</span><span class="fv">{{ parent.phone }}</span></div>
          <div class="field"><span class="fl">อีเมล</span>
            <a v-if="parent.email" :href="'mailto:' + parent.email" class="link">{{ parent.email }}</a>
            <span v-else class="fv na">ไม่ระบุ</span>
          </div>
          <div class="field"><span class="fl">Line ID</span>
            <span class="fv">{{ parent.lineId || 'ไม่ระบุ' }}</span>
          </div>
          <div class="field"><span class="fl">ที่อยู่</span><span class="fv addr">{{ parent.address }}</span></div>
        </div>

        <!-- Student info -->
        <div class="section-card">
          <h3 class="section-title">ข้อมูลนักเรียนในความดูแล</h3>
          <div class="field"><span class="fl">ชื่อนักเรียน</span><span class="fv">{{ parent.studentName }}</span></div>
          <div class="field"><span class="fl">เลขประจำตัว</span><span class="id-badge">{{ parent.studentId }}</span></div>
          <div class="field"><span class="fl">ชั้น/ห้อง</span><span class="fv">{{ parent.studentClass }}</span></div>
          <div class="field"><span class="fl">ความสัมพันธ์</span><span class="fv">{{ parent.relation }}</span></div>
        </div>

        <!-- Status -->
        <div class="section-card">
          <h3 class="section-title">สถานะบัญชี</h3>
          <div class="field"><span class="fl">สถานะ</span>
            <StaffStatusBadge :label="parent.status" :variant="parent.status === 'ใช้งาน' ? 'approved' : 'default'" />
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <StaffAppModal v-model="showEdit" title="แก้ไขข้อมูลผู้ปกครอง" size="md">
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
              <label class="form-label">โทรศัพท์</label>
              <input v-model="editForm.phone" class="input" type="tel" />
            </div>
            <div class="form-group">
              <label class="form-label">อีเมล</label>
              <input v-model="editForm.email" class="input" type="email" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Line ID</label>
              <input v-model="editForm.lineId" class="input" type="text" />
            </div>
            <div class="form-group">
              <label class="form-label">ความสัมพันธ์</label>
              <select v-model="editForm.relation" class="input">
                <option>บิดา</option><option>มารดา</option><option>ผู้ปกครอง</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group flex-2">
              <label class="form-label">ที่อยู่</label>
              <input v-model="editForm.address" class="input" type="text" />
            </div>
            <div class="form-group">
              <label class="form-label">สถานะ</label>
              <select v-model="editForm.status" class="input">
                <option>ใช้งาน</option><option>ระงับ</option>
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
import { useParentsData } from '~/composables/useParentsData'

definePageMeta({ layout: 'staff' })

const route = useRoute()
const id = route.params.id as string
const { rows, updateRow } = useParentsData()

const parent = computed(() => rows.value.find(r => r.id === id))

const showEdit = ref(false)
const editForm = ref({ prefix: '', firstName: '', lastName: '', phone: '', email: '', lineId: '', relation: '', address: '', status: 'ใช้งาน' as 'ใช้งาน' | 'ระงับ' })

watch(showEdit, (v) => {
  if (v && parent.value) {
    const p = parent.value
    editForm.value = { prefix: p.prefix, firstName: p.firstName, lastName: p.lastName, phone: p.phone, email: p.email, lineId: p.lineId, relation: p.relation, address: p.address, status: p.status }
  }
})

function saveEdit() {
  updateRow(id, editForm.value)
  showEdit.value = false
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }
.back-row { display: flex; }
.btn-back { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: #1d4ed8; font-size: 0.875rem; font-weight: 500; cursor: pointer; padding: 6px 0; font-family: inherit; }
.btn-back:hover { text-decoration: underline; }
.not-found { text-align: center; padding: 60px 0; color: #6b7280; }
.profile-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 28px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.avatar { width: 64px; height: 64px; background: linear-gradient(135deg, #7c3aed, #a78bfa); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.4rem; font-weight: 700; flex-shrink: 0; }
.profile-info { flex: 1; min-width: 200px; }
.profile-name { font-size: 1.2rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
.profile-sub { font-size: 0.875rem; color: #6b7280; margin: 0 0 6px; }
.profile-id { font-size: 0.8rem; color: #9ca3af; margin: 0; }
.id-badge { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 5px; padding: 1px 7px; font-size: 0.75rem; font-family: monospace; color: #374151; }
.profile-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 7px; padding: 8px 16px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: background 0.12s; }
.btn-edit-lg { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-edit-lg:hover { background: #f9fafb; }
.btn-secondary { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-secondary:hover { background: #f9fafb; }
.btn-primary { background: #1d4ed8; color: #fff; }
.btn-primary:hover { background: #1e40af; }
.sections { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.section-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; }
.section-title { font-size: 0.875rem; font-weight: 700; color: #111827; margin: 0 0 14px; padding-bottom: 10px; border-bottom: 1px solid #f3f4f6; }
.field { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid #f9fafb; }
.field:last-child { border-bottom: none; }
.fl { font-size: 0.8rem; color: #9ca3af; min-width: 100px; }
.fv { font-size: 0.875rem; color: #111827; font-weight: 500; text-align: right; }
.fv.na { color: #9ca3af; font-weight: 400; font-style: italic; }
.fv.addr { font-size: 0.8rem; text-align: right; }
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
