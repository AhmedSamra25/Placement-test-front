<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../store'

const store = useAppStore()
const router = useRouter()

const org = computed(() => store.currentOrg)
const remainingTests = computed(() => org.value.totalTests - org.value.usedTests)
const completedTests = computed(() => store.orgStudents.filter(s => s.status === 'completed'))
const activePendingTests = computed(() => store.orgStudents.filter(s => s.status !== 'completed'))

const completionRate = computed(() => {
  if (store.orgStudents.length === 0) return 0
  return Math.round((completedTests.value.length / store.orgStudents.length) * 100)
})

const getCEFRLevel = (score) => {
  if (score >= 5) return 'C1/C2'
  if (score >= 4) return 'B2'
  if (score >= 3) return 'B1'
  return 'A1/A2'
}

const getOrgLevel = (score) => {
  const level = store.cefrLevels.find(l => parseFloat(score) >= l.scoreMin && parseFloat(score) <= l.scoreMax)
  return level ? level.name : '—'
}

const cefrDistribution = computed(() => {
  const dist = { 'C1/C2': 0, 'B2': 0, 'B1': 0, 'A1/A2': 0 }
  completedTests.value.forEach(s => {
    dist[getCEFRLevel(s.score)]++
  })
  return dist
})

const orgLevelDistribution = computed(() => {
  const dist = {}
  store.cefrLevels.forEach(l => { dist[l.name] = 0 })
  completedTests.value.forEach(s => {
    const name = getOrgLevel(s.score)
    if (name in dist) dist[name]++
  })
  return dist
})

const averageScore = computed(() => {
  if (completedTests.value.length === 0) return '—'
  const sum = completedTests.value.reduce((acc, curr) => acc + parseFloat(curr.score), 0)
  return (sum / completedTests.value.length).toFixed(1)
})

const topLevel = computed(() => {
  if (completedTests.value.length === 0) return '—'
  const sorted = [...completedTests.value].sort((a, b) => b.score - a.score)
  return getCEFRLevel(sorted[0].score)
})

const recentSubmissions = computed(() => {
  return [...completedTests.value]
    .sort((a, b) => new Date(b.testDate) - new Date(a.testDate))
    .slice(0, 5)
})

const statCards = computed(() => [
  {
    label: 'Total Submissions',
    value: completedTests.value.length,
    sub: 'completed tests',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    color: 'bg-purple-50 text-[var(--color-sg-purple-main)]',
    borderColor: 'border-t-[var(--color-sg-purple-main)]'
  },
  {
    label: 'Active/Pending',
    value: activePendingTests.value.length,
    sub: 'awaiting completion',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'bg-yellow-50 text-yellow-600',
    borderColor: 'border-t-[var(--color-sg-warning-yellow)]'
  },
  {
    label: 'Avg Score',
    value: averageScore.value,
    sub: 'out of 6.0',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    color: 'bg-green-50 text-[var(--color-sg-success-green)]',
    borderColor: 'border-t-[var(--color-sg-success-green)]'
  },
  {
    label: 'Completion Rate',
    value: completionRate.value + '%',
    sub: 'of invited students',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'bg-blue-50 text-blue-600',
    borderColor: 'border-t-blue-400'
  },
  {
    label: 'Top Level',
    value: topLevel.value,
    sub: 'highest performer',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    color: 'bg-orange-50 text-orange-500',
    borderColor: 'border-t-orange-400'
  },
  {
    label: 'Tests Remaining',
    value: remainingTests.value,
    sub: `of ${org.value?.totalTests} purchased`,
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    color: remainingTests.value > 10 ? 'bg-green-50 text-[var(--color-sg-success-green)]' : 'bg-red-50 text-red-500',
    borderColor: remainingTests.value > 10 ? 'border-t-[var(--color-sg-success-green)]' : 'border-t-red-400'
  }
])
</script>

<template>
  <div v-if="org">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-[var(--color-sg-text-heading)] mb-1">Dashboard Overview</h1>
        <p class="text-gray-500">{{ org.name }} &bull; {{ store.orgStudents.length }} students enrolled</p>
      </div>
      <button @click="router.push('/org/students')" class="btn-primary flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Invite Student
      </button>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
      <div v-for="card in statCards" :key="card.label" class="card border-t-4 !py-5 border border-gray-100 hover:shadow-md transition-shadow" :class="card.borderColor">
        <div class="flex items-start justify-between mb-3">
          <p class="text-xs font-bold uppercase tracking-widest text-gray-400">{{ card.label }}</p>
          <div class="p-2 rounded-lg" :class="card.color">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="card.icon"></path></svg>
          </div>
        </div>
        <p class="text-3xl font-black text-gray-900">{{ card.value }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ card.sub }}</p>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      <!-- CEFR Distribution Bar Chart -->
      <div class="card border border-gray-100">
        <h3 class="font-bold text-gray-500 mb-6 uppercase tracking-wider text-xs flex justify-between">
          <span>CEFR Level Distribution</span>
          <span class="text-[var(--color-sg-purple-main)]">All Time</span>
        </h3>
        <div class="flex h-44 items-end gap-4 pb-2 border-b-2 border-gray-50">
          <div v-for="(count, level) in cefrDistribution" :key="level" class="flex-1 flex flex-col justify-end group">
            <div class="text-center text-xs font-bold text-gray-700 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">{{ count }}</div>
            <div class="w-full rounded-t-md transition-all" 
              :class="{
                'bg-blue-300 group-hover:bg-blue-400': level === 'A1/A2',
                'bg-[var(--color-sg-success-green)] opacity-70 group-hover:opacity-100': level === 'B1',
                'bg-[var(--color-sg-warning-yellow)] group-hover:opacity-80': level === 'B2',
                'bg-[var(--color-sg-purple-main)] group-hover:bg-[var(--color-sg-purple-dark)] shadow-[0_-4px_10px_rgba(109,40,217,0.2)]': level === 'C1/C2'
              }" 
              :style="{ height: `${(count / Math.max(1, completedTests.value?.length || 1)) * 100}%`, minHeight: '8px' }"></div>
            <div class="text-center mt-2 font-bold text-xs" :class="level === 'C1/C2' ? 'text-[var(--color-sg-purple-main)]' : 'text-gray-500'">{{ level }}</div>
          </div>
        </div>
      </div>

      <!-- Org Levels Distribution -->
      <div class="card border border-gray-100">
        <h3 class="font-bold text-gray-500 mb-6 uppercase tracking-wider text-xs flex justify-between">
          <span>Org Level Distribution</span>
          <button @click="router.push('/org/settings')" class="text-[var(--color-sg-purple-main)] hover:underline">Manage Levels</button>
        </h3>
        <div class="space-y-3">
          <div v-for="level in store.cefrLevels" :key="level.id" class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full shrink-0" :class="{
              'bg-blue-400': level.color === 'blue',
              'bg-cyan-400': level.color === 'cyan',
              'bg-green-500': level.color === 'green',
              'bg-yellow-400': level.color === 'yellow',
              'bg-orange-400': level.color === 'orange',
              'bg-purple-600': level.color === 'purple',
            }"></div>
            <span class="text-sm font-semibold text-gray-700 w-36 truncate">{{ level.name }}</span>
            <span class="text-xs text-gray-400 font-mono w-8 text-right">{{ orgLevelDistribution[level.name] || 0 }}</span>
            <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all" :class="{
                'bg-blue-400': level.color === 'blue',
                'bg-cyan-400': level.color === 'cyan',
                'bg-green-500': level.color === 'green',
                'bg-yellow-400': level.color === 'yellow',
                'bg-orange-400': level.color === 'orange',
                'bg-purple-600': level.color === 'purple',
              }" :style="{ width: `${((orgLevelDistribution[level.name] || 0) / Math.max(1, completedTests.value?.length || 1)) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Submissions Table -->
    <div class="card border border-gray-100 !p-0 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 class="font-bold text-gray-700 text-sm">Recent Submissions</h3>
        <button @click="router.push('/org/submissions')" class="text-sm font-bold text-[var(--color-sg-purple-main)] hover:underline">View All</button>
      </div>
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-xs uppercase tracking-widest font-bold text-gray-400 border-b border-gray-50">
            <th class="px-6 py-3">Student</th>
            <th class="px-6 py-3">Language</th>
            <th class="px-6 py-3">Date</th>
            <th class="px-6 py-3">Score</th>
            <th class="px-6 py-3">CEFR</th>
            <th class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="student in recentSubmissions" :key="student.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4 font-semibold text-gray-900">{{ student.name }}</td>
            <td class="px-6 py-4 text-gray-500 font-semibold text-xs">{{ student.targetLanguage || 'English' }}</td>
            <td class="px-6 py-4 text-gray-400 font-mono text-xs">{{ student.testDate }}</td>
            <td class="px-6 py-4 font-mono font-bold text-[var(--color-sg-purple-main)]">{{ student.score }}</td>
            <td class="px-6 py-4"><span class="px-2 py-0.5 text-xs font-bold rounded-full bg-purple-100 text-purple-800">{{ getCEFRLevel(student.score) }}</span></td>
            <td class="px-6 py-4 text-right">
              <button @click="router.push(`/org/results/${student.id}`)" class="text-xs font-bold text-[var(--color-sg-purple-main)] hover:underline">View Report →</button>
            </td>
          </tr>
          <tr v-if="recentSubmissions.length === 0">
            <td colspan="6" class="px-6 py-10 text-center text-gray-400">No submissions yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
