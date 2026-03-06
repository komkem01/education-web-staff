<script setup lang="ts">
const username = ref('')
const password = ref('')
const errorMessage = ref('')

const authToken = useCookie<string | null>('edu_staff_token')
const activeRole = useCookie<string | null>('edu_active_role')

if (authToken.value) {
  await navigateTo('/staff')
}

const handleLogin = async () => {
  if (!username.value.trim() || !password.value.trim()) {
    errorMessage.value = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน'
    return
  }

  authToken.value = 'mock-staff-token'
  activeRole.value = 'staff'
  errorMessage.value = ''

  await navigateTo('/staff')
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand-row">
        <span class="brand-icon">E</span>
        <div>
          <h1>EduFlow</h1>
          <p>Staff Portal</p>
        </div>
      </div>

      <div class="intro">
        <h2>เข้าสู่ระบบบุคลากร</h2>
        <p>กรุณาเข้าสู่ระบบเพื่อใช้งานในฐานะบุคลากร</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          ชื่อผู้ใช้
          <input v-model="username" type="text" placeholder="เช่น teacher.mail@school.ac.th" autocomplete="username" />
        </label>

        <label>
          รหัสผ่าน
          <input v-model="password" type="password" placeholder="••••••••" autocomplete="current-password" />
        </label>

        <p class="role-fixed">สิทธิ์การใช้งาน: บุคลากร</p>

        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

        <button type="submit">เข้าสู่ระบบ</button>
      </form>

      <p class="helper-text">* โหมดตัวอย่าง: ผู้พัฒนาระบบเป็นผู้ลงทะเบียนบัญชีเริ่มต้นให้</p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #eff6ff 0%, #f4f5f7 100%);
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 28px 24px;
  display: grid;
  gap: 20px;
  box-shadow: 0 4px 24px rgba(29, 78, 216, 0.08);
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #1d4ed8;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.brand-row h1 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.brand-row p {
  font-size: 0.78rem;
  color: #60a5fa;
  margin: 0;
}

.intro h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px;
}

.intro p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.login-form {
  display: grid;
  gap: 14px;
}

.login-form label {
  display: grid;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.login-form input {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  background: #fff;
  color: #111827;
}

.login-form input:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.12);
}

.role-fixed {
  font-size: 0.8rem;
  color: #9ca3af;
  background: #f3f4f6;
  border-radius: 6px;
  padding: 6px 10px;
}

.error-text {
  font-size: 0.83rem;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 8px 12px;
}

.login-form button {
  background: #1d4ed8;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 11px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 4px;
}

.login-form button:hover {
  background: #1e40af;
}

.helper-text {
  font-size: 0.78rem;
  color: #9ca3af;
  text-align: center;
}
</style>
