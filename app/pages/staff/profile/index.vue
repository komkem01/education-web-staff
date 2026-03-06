<template>
  <div class="page">
    <StaffAppSkeletonLoader v-if="loading" :rows="6" :cols="2" />
    <template v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">โปรไฟล์ของฉัน</h2>
          <p class="page-desc">ข้อมูลส่วนตัวและการตั้งค่าบัญชีของคุณ</p>
        </div>
      </div>

      <div class="profile-layout">
        <!-- Left: Avatar + quick info -->
        <div class="profile-sidebar">
          <div class="avatar-section">
            <div class="avatar-wrap">
              <div class="avatar-circle">{{ initials }}</div>
              <button type="button" class="avatar-edit-btn" title="เปลี่ยนรูปโปรไฟล์" @click="triggerPhotoUpload">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
              </button>
            </div>
            <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handlePhotoChange" />
            <div class="avatar-name">{{ profile.firstName }} {{ profile.lastName }}</div>
            <div class="avatar-role">บุคลากร · {{ profile.department }}</div>
          </div>
          <div class="quick-stats">
            <div class="qs-item">
              <span class="qs-label">รหัสพนักงาน</span>
              <span class="qs-val">{{ profile.staffId }}</span>
            </div>
            <div class="qs-item">
              <span class="qs-label">วันที่เริ่มงาน</span>
              <span class="qs-val">{{ profile.joinDate }}</span>
            </div>
            <div class="qs-item">
              <span class="qs-label">ตำแหน่ง</span>
              <span class="qs-val">{{ profile.position }}</span>
            </div>
            <div class="qs-item">
              <span class="qs-label">กลุ่มสาระ</span>
              <span class="qs-val">{{ profile.subjectGroup }}</span>
            </div>
          </div>
        </div>

        <!-- Right: Forms -->
        <div class="profile-main">
          <!-- Personal info section -->
          <div class="section-card">
            <div class="section-head">
              <h3 class="section-title">ข้อมูลส่วนตัว</h3>
              <button v-if="!editingProfile" type="button" class="btn btn-secondary" @click="editingProfile = true">แก้ไข</button>
              <div v-else class="edit-actions">
                <button type="button" class="btn btn-clear" @click="cancelProfile">ยกเลิก</button>
                <button type="button" class="btn btn-primary" @click="saveProfile">บันทึก</button>
              </div>
            </div>
            <div class="form-grid">
              <label class="field">
                <span>คำนำหน้า</span>
                <select v-model="profileForm.prefix" class="input" :disabled="!editingProfile">
                  <option>นาย</option>
                  <option>นาง</option>
                  <option>นางสาว</option>
                </select>
              </label>
              <label class="field">
                <span>ชื่อ <span class="req">*</span></span>
                <input v-model="profileForm.firstName" class="input" type="text" :disabled="!editingProfile" />
              </label>
              <label class="field">
                <span>นามสกุล <span class="req">*</span></span>
                <input v-model="profileForm.lastName" class="input" type="text" :disabled="!editingProfile" />
              </label>
              <label class="field">
                <span>อีเมล <span class="req">*</span></span>
                <input v-model="profileForm.email" class="input" type="email" :disabled="!editingProfile" />
              </label>
              <label class="field">
                <span>เบอร์โทรศัพท์</span>
                <input v-model="profileForm.phone" class="input" type="tel" :disabled="!editingProfile" placeholder="0xx-xxx-xxxx" />
              </label>
              <label class="field">
                <span>กลุ่มสาระการเรียนรู้</span>
                <select v-model="profileForm.subjectGroup" class="input" :disabled="!editingProfile">
                  <option>คณิตศาสตร์</option>
                  <option>วิทยาศาสตร์และเทคโนโลยี</option>
                  <option>ภาษาไทย</option>
                  <option>ภาษาต่างประเทศ</option>
                  <option>สังคมศึกษา ศาสนา และวัฒนธรรม</option>
                  <option>สุขศึกษาและพลศึกษา</option>
                  <option>ศิลปะ</option>
                  <option>การงานอาชีพ</option>
                </select>
              </label>
              <label class="field">
                <span>ตำแหน่ง</span>
                <input v-model="profileForm.position" class="input" type="text" :disabled="!editingProfile" />
              </label>
              <label class="field field-full">
                <span>ที่อยู่</span>
                <input v-model="profileForm.address" class="input" type="text" :disabled="!editingProfile" placeholder="ที่อยู่ปัจจุบัน" />
              </label>
            </div>
          </div>

          <!-- Change password section -->
          <div class="section-card">
            <div class="section-head">
              <h3 class="section-title">เปลี่ยนรหัสผ่าน</h3>
              <button v-if="!editingPassword" type="button" class="btn btn-secondary" @click="editingPassword = true">เปลี่ยนรหัสผ่าน</button>
            </div>
            <div v-if="editingPassword">
              <div class="form-col">
                <label class="field">
                  <span>รหัสผ่านปัจจุบัน <span class="req">*</span></span>
                  <div class="pw-wrap">
                    <input v-model="pwForm.current" :type="showPw.current ? 'text' : 'password'" class="input" placeholder="รหัสผ่านปัจจุบัน" />
                    <button type="button" class="pw-eye" @click="showPw.current = !showPw.current">
                      <svg v-if="showPw.current" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="#9ca3af" stroke-width="1.3"/><circle cx="8" cy="8" r="2" stroke="#9ca3af" stroke-width="1.3"/><path d="M2 2l12 12" stroke="#9ca3af" stroke-width="1.3" stroke-linecap="round"/></svg>
                      <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="#9ca3af" stroke-width="1.3"/><circle cx="8" cy="8" r="2" stroke="#9ca3af" stroke-width="1.3"/></svg>
                    </button>
                  </div>
                </label>
                <label class="field">
                  <span>รหัสผ่านใหม่ <span class="req">*</span></span>
                  <div class="pw-wrap">
                    <input v-model="pwForm.newPw" :type="showPw.newPw ? 'text' : 'password'" class="input" placeholder="อย่างน้อย 8 ตัวอักษร" />
                    <button type="button" class="pw-eye" @click="showPw.newPw = !showPw.newPw">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="#9ca3af" stroke-width="1.3"/><circle cx="8" cy="8" r="2" stroke="#9ca3af" stroke-width="1.3"/></svg>
                    </button>
                  </div>
                </label>
                <label class="field">
                  <span>ยืนยันรหัสผ่านใหม่ <span class="req">*</span></span>
                  <div class="pw-wrap">
                    <input v-model="pwForm.confirm" :type="showPw.confirm ? 'text' : 'password'" class="input" :class="pwMismatch ? 'input-error' : ''" placeholder="ยืนยันรหัสผ่านอีกครั้ง" />
                    <button type="button" class="pw-eye" @click="showPw.confirm = !showPw.confirm">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="#9ca3af" stroke-width="1.3"/><circle cx="8" cy="8" r="2" stroke="#9ca3af" stroke-width="1.3"/></svg>
                    </button>
                  </div>
                  <span v-if="pwMismatch" class="err-msg">รหัสผ่านไม่ตรงกัน</span>
                </label>
                <!-- Strength indicator -->
                <div v-if="pwForm.newPw" class="pw-strength">
                  <div class="str-bars">
                    <div v-for="i in 4" :key="i" :class="['str-bar', pwStrength >= i ? `str-${pwStrengthLabel}` : '']" />
                  </div>
                  <span :class="`str-label str-${pwStrengthLabel}`">{{ pwStrengthText }}</span>
                </div>
                <div class="pw-actions">
                  <button type="button" class="btn btn-clear" @click="cancelPassword">ยกเลิก</button>
                  <button type="button" class="btn btn-primary" :disabled="!canSavePassword" @click="savePassword">เปลี่ยนรหัสผ่าน</button>
                </div>
              </div>
            </div>
            <p v-else class="pw-placeholder">คลิก "เปลี่ยนรหัสผ่าน" เพื่อตั้งรหัสผ่านใหม่</p>
          </div>
        </div>
      </div>

      <!-- Toast -->
      <Teleport to="body">
        <Transition name="toast">
          <div v-if="toastMsg" class="toast">{{ toastMsg }}</div>
        </Transition>
      </Teleport>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

definePageMeta({ layout: 'staff' })

const { loading } = usePageLoad()
const fileInput = ref<HTMLInputElement | null>(null)
const toastMsg = ref('')
const editingProfile = ref(false)
const editingPassword = ref(false)
const showPw = reactive({ current: false, newPw: false, confirm: false })
const pwForm = reactive({ current: '', newPw: '', confirm: '' })

const profile = reactive({
  staffId: 'ST-2024-001',
  prefix: 'นาย',
  firstName: 'สมหมาย',
  lastName: 'ใจดี',
  email: 'sommai.jaidee@school.ac.th',
  phone: '081-234-5678',
  department: 'คณิตศาสตร์',
  subjectGroup: 'คณิตศาสตร์',
  position: 'ครูชำนาญการ',
  address: '',
  joinDate: '1 มิถุนายน 2561',
})

const profileForm = reactive({ ...profile })

const initials = computed(() => {
  const f = profile.firstName?.[0] ?? ''
  const l = profile.lastName?.[0] ?? ''
  return `${f}${l}`
})

const pwMismatch = computed(() => !!pwForm.confirm && pwForm.newPw !== pwForm.confirm)

const pwStrength = computed(() => {
  const p = pwForm.newPw
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})
const pwStrengthLabel = computed(() => {
  if (pwStrength.value <= 1) return 'weak'
  if (pwStrength.value === 2) return 'fair'
  if (pwStrength.value === 3) return 'good'
  return 'strong'
})
const pwStrengthText = computed(() => ({ weak: 'อ่อนแอ', fair: 'พอใช้', good: 'ดี', strong: 'แข็งแกร่ง' }[pwStrengthLabel.value]))
const canSavePassword = computed(() => pwForm.current && pwForm.newPw.length >= 8 && pwForm.newPw === pwForm.confirm)

function triggerPhotoUpload() { fileInput.value?.click() }
function handlePhotoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) showToast(`อัปโหลดรูปภาพ "${file.name}" เรียบร้อยแล้ว`)
}

function saveProfile() {
  Object.assign(profile, profileForm)
  editingProfile.value = false
  showToast('บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว')
}
function cancelProfile() { Object.assign(profileForm, profile); editingProfile.value = false }

function savePassword() {
  if (!canSavePassword.value) return
  pwForm.current = ''; pwForm.newPw = ''; pwForm.confirm = ''
  editingPassword.value = false
  showToast('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว')
}
function cancelPassword() { pwForm.current = ''; pwForm.newPw = ''; pwForm.confirm = ''; editingPassword.value = false }

function showToast(msg: string) {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 3000)
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 0; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 1.3rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
.page-desc { font-size: 0.875rem; color: #6b7280; margin: 0; }
.profile-layout { display: grid; grid-template-columns: 260px 1fr; gap: 20px; align-items: start; }
@media (max-width: 768px) { .profile-layout { grid-template-columns: 1fr; } }
.profile-sidebar { display: flex; flex-direction: column; gap: 16px; }
.avatar-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px 20px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.avatar-wrap { position: relative; }
.avatar-circle { width: 80px; height: 80px; border-radius: 50%; background: #1d4ed8; color: #fff; font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.avatar-edit-btn { position: absolute; bottom: 2px; right: 2px; width: 26px; height: 26px; border-radius: 50%; background: #fff; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #374151; }
.avatar-edit-btn:hover { background: #f3f4f6; }
.avatar-name { font-size: 1rem; font-weight: 700; color: #111827; }
.avatar-role { font-size: 0.8rem; color: #6b7280; }
.quick-stats { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }
.qs-item { display: flex; flex-direction: column; gap: 2px; }
.qs-label { font-size: 0.72rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.04em; }
.qs-val { font-size: 0.875rem; font-weight: 600; color: #111827; }
.profile-main { display: flex; flex-direction: column; gap: 18px; }
.section-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 22px 24px; }
.section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.section-title { font-size: 0.95rem; font-weight: 700; color: #111827; margin: 0; }
.edit-actions { display: flex; gap: 8px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-col { display: flex; flex-direction: column; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 5px; font-size: 0.875rem; font-weight: 500; color: #374151; }
.field-full { grid-column: 1 / -1; }
.req { color: #ef4444; }
.input { width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; font-family: inherit; color: #111827; background: #fff; outline: none; transition: border-color 0.15s; box-sizing: border-box; }
.input:focus { border-color: #1d4ed8; }
.input:disabled { background: #f9fafb; color: #6b7280; }
.input-error { border-color: #ef4444 !important; }
.pw-wrap { position: relative; }
.pw-wrap .input { padding-right: 38px; }
.pw-eye { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 2px; color: #9ca3af; display: flex; align-items: center; }
.err-msg { font-size: 0.75rem; color: #ef4444; margin-top: 2px; }
.pw-strength { display: flex; align-items: center; gap: 10px; }
.str-bars { display: flex; gap: 4px; }
.str-bar { width: 36px; height: 5px; border-radius: 3px; background: #e5e7eb; }
.str-bar.str-weak { background: #ef4444; }
.str-bar.str-fair { background: #f97316; }
.str-bar.str-good { background: #eab308; }
.str-bar.str-strong { background: #22c55e; }
.str-label { font-size: 0.75rem; font-weight: 600; }
.str-label.str-weak { color: #ef4444; }
.str-label.str-fair { color: #f97316; }
.str-label.str-good { color: #eab308; }
.str-label.str-strong { color: #22c55e; }
.pw-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
.pw-placeholder { font-size: 0.875rem; color: #9ca3af; margin: 0; }
.btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 7px; padding: 7px 14px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: background 0.12s; white-space: nowrap; }
.btn-primary { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
.btn-primary:hover:not(:disabled) { background: #1e40af; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { background: #fff; color: #374151; border-color: #e5e7eb; }
.btn-secondary:hover { background: #f9fafb; }
.btn-clear { background: #fff; color: #6b7280; border-color: #e5e7eb; }
.btn-clear:hover { background: #f9fafb; }
.toast { position: fixed; bottom: 28px; right: 28px; background: #1e293b; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 0.875rem; box-shadow: 0 4px 24px rgba(0,0,0,.18); z-index: 9999; }
.toast-enter-active, .toast-leave-active { transition: opacity 0.25s, transform 0.25s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(10px); }
</style>
