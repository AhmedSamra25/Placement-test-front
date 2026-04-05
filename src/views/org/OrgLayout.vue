<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '../../store'

const store = useAppStore()
const router = useRouter()
const route = useRoute()

const currentUser = computed(() => store.currentUser)

onMounted(() => {
  store.fetchDashboardStats()
  store.fetchStudents()
  store.fetchCefrLevels()
  if (currentUser.value?.role === 'admin') {
    store.fetchTeam()
  }
})

const navItems = [
  { name: 'Overview', path: '/org', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { name: 'Students & Invites', path: '/org/students', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { name: 'Submissions', path: '/org/submissions', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { name: 'Goals & CEFR', path: '/org/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', adminOnly: true },
  { name: 'Team Settings', path: '/org/team', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', adminOnly: true }
]

const visibleNavItems = computed(() => {
  if (!currentUser.value) return []
  return navItems.filter(item => !item.adminOnly || currentUser.value.role === 'admin')
})

const handleLogout = () => {
  store.logout()
  router.push('/org/login')
}
</script>

<template>
  <div v-if="currentUser" class="min-h-[85vh] flex gap-6 mt-4">
    <!-- Sidebar -->
    <aside class="w-64 shrink-0 flex flex-col justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative hidden md:flex">
      <div>
        <div class="mb-8 px-2 border-b border-gray-100 pb-6">
          <p class="text-[10px] uppercase tracking-widest text-[var(--color-sg-purple-main)] font-black mb-1">Organization</p>
          <h2 class="font-bold text-gray-900 leading-tight">{{ store.currentOrg?.name || 'Dashboard' }}</h2>
        </div>

        <nav class="space-y-1">
          <router-link 
            v-for="item in visibleNavItems" 
            :key="item.path" 
            :to="item.path"
            class="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all group"
            :class="route.path === item.path || (route.path.startsWith(item.path) && item.path !== '/org') ? 'bg-[var(--color-sg-purple-dark)] text-white shadow-md shadow-purple-900/10' : 'text-gray-600 hover:bg-purple-50 hover:text-[var(--color-sg-purple-main)]'"
          >
            <svg class="w-5 h-5 transition-transform" :class="route.path === item.path || (route.path.startsWith(item.path) && item.path !== '/org') ? 'text-purple-300' : 'text-gray-400 group-hover:text-[var(--color-sg-purple-main)] group-hover:scale-110'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"></path></svg>
            {{ item.name }}
          </router-link>
        </nav>
      </div>

      <div class="mt-8 pt-4 border-t border-gray-100">
        <div class="flex items-center gap-3 px-2 mb-4">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-sg-purple-main)] to-[var(--color-sg-purple-dark)] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
            {{ currentUser.name.charAt(0) }}
          </div>
          <div>
            <p class="text-sm font-bold text-gray-900 drop-shadow-sm">{{ currentUser.name }}</p>
            <p class="text-[10px] uppercase font-mono tracking-widest text-[var(--color-sg-success-green)] font-bold">{{ currentUser.role }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main View Area -->
    <main class="flex-1 min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <router-view></router-view>
    </main>
  </div>
</template>
