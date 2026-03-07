<template>
  <aside class="sidebar" :class="{ collapsed }">
    <!-- Logo -->
    <div class="sidebar-header">
      <div class="logo-mark">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L3 6v8l7 4 7-4V6L10 2z" fill="#fff" fill-opacity=".9" />
        </svg>
      </div>
      <Transition name="fade">
        <div v-if="!collapsed" class="logo-text">
          <span class="logo-title">EduFlow</span>
          <span class="logo-sub">ฝ่ายบุคลากร</span>
        </div>
      </Transition>
    </div>

    <!-- School tag -->
    <Transition name="fade">
      <div v-if="!collapsed" class="school-tag">
        <span class="online-dot" />
        <span class="school-name">โรงเรียนตัวอย่างวิทยา</span>
      </div>
    </Transition>

    <!-- Nav -->
    <nav class="nav">
      <template v-for="group in navGroups" :key="group.id">
        <!-- ── COLLAPSED MODE: icon-only list ── -->
        <template v-if="collapsed">
          <div class="collapsed-group">
            <NuxtLink
              v-for="item in group.items"
              :key="item.path"
              :to="item.path"
              class="nav-item nav-item--icon"
              active-class="nav-item--active"
              :title="item.label"
            >
              <span class="item-icon" v-html="item.icon" />
            </NuxtLink>
          </div>
        </template>

        <!-- ── EXPANDED MODE: accordion group ── -->
        <template v-else>
          <div class="nav-group">
            <button
              type="button"
              class="group-header"
              :class="{ 'group-header--open': openGroups.has(group.id) }"
              @click="toggleGroup(group.id)"
            >
              <span class="group-label">{{ group.label }}</span>
              <span class="group-chevron" :class="{ 'group-chevron--open': openGroups.has(group.id) }">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </button>

            <div class="group-items" :class="{ 'group-items--open': openGroups.has(group.id) }">
              <NuxtLink
                v-for="item in group.items"
                :key="item.path"
                :to="item.path"
                class="nav-item"
                active-class="nav-item--active"
              >
                <span class="item-icon" v-html="item.icon" />
                <span class="item-label">{{ item.label }}</span>
              </NuxtLink>
            </div>
          </div>
        </template>
      </template>
    </nav>

    <!-- Footer user -->
    <div class="sidebar-footer">
      <div class="user-row">
        <div class="avatar">บ</div>
        <Transition name="fade">
          <div v-if="!collapsed" class="user-info">
            <span class="user-name">นางสาวสมใจ รักงาน</span>
            <span class="user-role">เจ้าหน้าที่บุคลากร</span>
          </div>
        </Transition>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{ collapsed: boolean }>()
defineEmits<{ (e: 'toggle'): void }>()

const route = useRoute()

const ICON_DASHBOARD = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" fill-opacity=".8"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" fill-opacity=".8"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" fill-opacity=".8"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" fill-opacity=".8"/></svg>`
const ICON_TEACHER = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="4.5" r="2.5" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M1 13c0-2.761 2.239-4 5-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none"/><path d="M10.5 8l1.5 1.5L15 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const ICON_STUDENT = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3L14 6l-6 3-6-3 6-3z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="none"/><path d="M4 7.5v3.5c0 0 1.5 1.5 4 1.5s4-1.5 4-1.5V7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`
const ICON_PARENT = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="5" cy="4" r="2" stroke="currentColor" stroke-width="1.3" fill="none"/><circle cx="11" cy="4" r="2" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M1 13c0-2.209 1.791-3 4-3s4 .791 4 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none"/><path d="M11 10c1.5 0 3 .5 3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none"/></svg>`
const ICON_CLASSROOM = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M1 6h14" stroke="currentColor" stroke-width="1.2"/><path d="M5 3V2M11 3V2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M4 9.5h3M9 9.5h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`
const ICON_REGISTRAR = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M5 5h6M5 8h4M5 11h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M12 10l1.5 1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`
const ICON_APPROVE = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="12" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M4 7l2.5 2.5L12 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const ICON_DOCUMENT = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 1h6l4 4v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/><path d="M10 1v4h4" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M5.5 8h5M5.5 11h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`
const ICON_ANNOUNCE = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 5h9l3-2v9l-3-2H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/><path d="M5 10v3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`
const ICON_BEHAVIOR = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l1 2.5H14l-2 1.5.8 2.5L8 7 5.2 8.5 6 6 4 4.5h3L8 2z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" fill="none"/><path d="M6 10l2 2 4.5-4.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const ICON_CALENDAR = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="11" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M1 7h14M5 3V1M11 3V1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="5.5" cy="10.5" r="0.8" fill="currentColor"/><circle cx="8" cy="10.5" r="0.8" fill="currentColor"/><circle cx="10.5" cy="10.5" r="0.8" fill="currentColor"/></svg>`
const ICON_REPORT = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`
const ICON_PROFILE = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>`

const navGroups = [
  {
    id: 'overview',
    label: 'ภาพรวม',
    items: [
      { path: '/staff', label: 'แดชบอร์ด', icon: ICON_DASHBOARD },
    ],
  },
  {
    id: 'people',
    label: 'จัดการบุคคล',
    items: [
      { path: '/staff/teachers', label: 'ครู', icon: ICON_TEACHER },
      { path: '/staff/students', label: 'นักเรียน', icon: ICON_STUDENT },
      { path: '/staff/parents', label: 'ผู้ปกครอง', icon: ICON_PARENT },
    ],
  },
  {
    id: 'registrar',
    label: 'งานทะเบียน',
    items: [
      { path: '/staff/classrooms', label: 'ห้องเรียน', icon: ICON_CLASSROOM },
      { path: '/staff/registrar', label: 'ลงทะเบียน/ย้ายเรียน', icon: ICON_REGISTRAR },
    ],
  },
  {
    id: 'workflow',
    label: 'คำขอและเอกสาร',
    items: [
      { path: '/staff/approvals', label: 'คำขออนุมัติ', icon: ICON_APPROVE },
      { path: '/staff/documents', label: 'จัดการเอกสาร', icon: ICON_DOCUMENT },
    ],
  },
  {
    id: 'activities',
    label: 'ประกาศและกิจกรรม',
    items: [
      { path: '/staff/announcements', label: 'ประกาศ/ข่าวสาร', icon: ICON_ANNOUNCE },
      { path: '/staff/behavior', label: 'งานปกครอง', icon: ICON_BEHAVIOR },
      { path: '/staff/calendar', label: 'ปฏิทินการศึกษา', icon: ICON_CALENDAR },
    ],
  },
  {
    id: 'system',
    label: 'ระบบ',
    items: [
      { path: '/staff/reports', label: 'รายงาน/Export', icon: ICON_REPORT },
      { path: '/staff/profile', label: 'ข้อมูลของฉัน', icon: ICON_PROFILE },
    ],
  },
]

const openGroups = ref<Set<string>>(new Set())

function getActiveGroupId(path: string) {
  const found = navGroups.find(g =>
    g.items.some(item => path === item.path || path.startsWith(`${item.path}/`)),
  )
  return found?.id ?? 'overview'
}

function toggleGroup(id: string) {
  const next = new Set(openGroups.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  openGroups.value = next
}

function syncOpenGroup(path: string) {
  const id = getActiveGroupId(path)
  if (!openGroups.value.has(id)) {
    openGroups.value = new Set([...openGroups.value, id])
  }
}

syncOpenGroup(route.path)
watch(() => route.path, syncOpenGroup)
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 240px;
  background: #111827;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width 0.2s ease;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px 14px;
  flex-shrink: 0;
}

.logo-mark {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-title {
  display: block;
  font-weight: 700;
  font-size: 0.97rem;
  color: #f9fafb;
  white-space: nowrap;
  letter-spacing: -0.2px;
}

.logo-sub {
  display: block;
  font-size: 0.73rem;
  color: #60a5fa;
  white-space: nowrap;
  margin-top: 1px;
}

.school-tag {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0 12px 6px;
  padding: 7px 10px;
  background: #1f2937;
  border-radius: 7px;
  flex-shrink: 0;
}

.online-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  flex-shrink: 0;
}

.school-name {
  font-size: 0.78rem;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 8px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #374151 transparent;
}

.collapsed-group {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding-bottom: 6px;
  border-bottom: 1px solid #1f2937;
  margin-bottom: 2px;
}

.collapsed-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.nav-group {
  display: flex;
  flex-direction: column;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 10px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 7px;
  font-family: inherit;
  transition: background 0.12s;
  margin-top: 4px;
}

.group-header:hover {
  background: #1a2233;
}

.group-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 0.01em;
  white-space: nowrap;
  flex: 1;
  text-align: left;
  transition: color 0.12s;
}

.group-header:hover .group-label,
.group-header--open .group-label {
  color: #d1d5db;
}

.group-chevron {
  color: #6b7280;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease, color 0.12s;
}

.group-chevron:not(.group-chevron--open) {
  transform: rotate(-90deg);
}

.group-chevron--open {
  transform: rotate(0deg);
  color: #d1d5db;
}

.group-items {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
}

.group-items--open {
  max-height: 400px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 10px 7px 14px;
  border-radius: 7px;
  color: #9ca3af;
  font-size: 0.875rem;
  font-weight: 400;
  transition: background 0.12s, color 0.12s;
  white-space: nowrap;
  overflow: hidden;
}

.nav-item:hover {
  background: #1f2937;
  color: #e5e7eb;
}

.nav-item--active {
  background: rgba(29,78,216,.15) !important;
  color: #93c5fd !important;
  font-weight: 500;
  border-right: 3px solid #1d4ed8;
}

.nav-item--icon {
  justify-content: center;
  padding: 9px;
}

.item-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.item-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid #1f2937;
  flex-shrink: 0;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1d4ed8;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  flex-shrink: 0;
}

.user-info {
  overflow: hidden;
}

.user-name {
  display: block;
  font-size: 0.83rem;
  color: #f9fafb;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  display: block;
  font-size: 0.73rem;
  color: #60a5fa;
  white-space: nowrap;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
