<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '../../store'

import { Radar } from 'vue-chartjs'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const route = useRoute()
const router = useRouter()
const store = useAppStore()

const studentId = parseInt(route.params.id)
const student = computed(() => store.students.find(s => s.id === studentId))
const result = computed(() => store.results[studentId])

const SKILLS = [
  { key: 'reading', label: 'Reading', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { key: 'writing', label: 'Writing', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
  { key: 'speaking', label: 'Speaking', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
  { key: 'listening', label: 'Listening', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' },
  { key: 'vocabulary', label: 'Vocabulary', icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129' },
  { key: 'grammar', label: 'Grammar', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { key: 'pronunciation', label: 'Pronunciation', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a6 6 0 01-6 6H8.35l-1.538-4.614M18 13V7m0 6a6 6 0 006 0V7a6 6 0 00-6 0v6z' }
]

const getLevelName = (score) => {
  const levels = ['Unscored', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  return levels[Math.round(score)] || 'Unscored'
}

const getScoreBg = (score) => {
  if (score >= 5) return 'bg-[var(--color-sg-purple-main)]'
  if (score >= 4) return 'bg-indigo-500'
  if (score >= 3) return 'bg-[var(--color-sg-success-green)]'
  if (score >= 2) return 'bg-[var(--color-sg-warning-yellow)]'
  return 'bg-gray-300'
}

const getBarWidth = (score) => `${(score / 6) * 100}%`

const overallCEFR = computed(() => {
  if (!student.value?.score) return 'N/A'
  return getLevelName(parseFloat(student.value.score))
})

const chartData = computed(() => {
  if (!result.value) return null
  return {
    labels: SKILLS.map(s => s.label),
    datasets: [{
      label: 'Student Score',
      backgroundColor: 'rgba(107, 33, 168, 0.15)',
      borderColor: '#6B21A8',
      pointBackgroundColor: '#10B981',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#10B981',
      data: SKILLS.map(s => result.value[s.key] || 0)
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      min: 0,
      max: 6,
      ticks: {
        stepSize: 1,
        font: { size: 10 },
        callback: (value) => {
          const levels = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']
          return levels[value] || ''
        }
      },
      grid: { color: 'rgba(0,0,0,0.05)' },
      pointLabels: { font: { size: 12, weight: 'bold' } }
    }
  },
  plugins: {
    legend: { display: false }
  }
}

// Submission Media
const activeTab = ref('overview') // 'overview' | 'writing' | 'speaking' | 'pronunciation'
</script>

<template>
  <div v-if="student && result">
    <!-- Header -->
    <div class="flex flex-wrap justify-between items-start gap-4 mb-8">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <button @click="router.push('/org/students')" class="text-gray-400 hover:text-gray-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <p class="text-xs text-gray-400 uppercase tracking-widest font-bold">Student Report</p>
        </div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">{{ student.name }}</h1>
        <p class="text-gray-500 text-sm">{{ student.email }} &bull; Test Date: {{ student.testDate }}</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-right">
          <p class="text-xs text-gray-400 uppercase tracking-widest font-bold">Overall CEFR Level</p>
          <p class="text-4xl font-black text-[var(--color-sg-purple-main)]">{{ overallCEFR }}</p>
        </div>
        <div class="text-right">
          <p class="text-xs text-gray-400 uppercase tracking-widest font-bold">Avg Score</p>
          <p class="text-4xl font-black text-gray-800">{{ student.score }}</p>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit overflow-x-auto max-w-full">
      <button v-for="tab in ['overview', 'reading', 'listening', 'vocabulary', 'grammar', 'writing', 'speaking', 'pronunciation']" :key="tab" @click="activeTab = tab"
        class="px-4 py-2 text-sm font-semibold rounded-lg transition-all capitalize whitespace-nowrap"
        :class="activeTab === tab ? 'bg-white shadow text-[var(--color-sg-purple-main)]' : 'text-gray-500 hover:text-gray-700'">
        {{ tab }}
      </button>
    </div>

    <!-- Overview Tab -->
    <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Radar Chart -->
      <div class="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">Skill Radar</h2>
        <div class="h-[280px]">
          <Radar v-if="chartData" :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Per-Skill Bars -->
      <div class="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-6">Skill Breakdown</h2>
        <div class="space-y-4">
          <div v-for="skill in SKILLS" :key="skill.key" class="space-y-1">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-[var(--color-sg-purple-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="skill.icon"></path></svg>
                <span class="text-sm font-semibold text-gray-700">{{ skill.label }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-mono text-gray-500">{{ result[skill.key] }}/6</span>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full text-white" :class="getScoreBg(result[skill.key])">{{ getLevelName(result[skill.key]) }}</span>
              </div>
            </div>
            <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-700" :class="getScoreBg(result[skill.key])" :style="{ width: getBarWidth(result[skill.key]) }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Reading Tab -->
    <div v-if="activeTab === 'reading'" class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 class="font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-[var(--color-sg-purple-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        Reading Comprehension Results
        <span class="ml-auto text-xs font-bold px-2 py-1 rounded-full text-white" :class="getScoreBg(result.reading)">Score: {{ result.reading }}/6 — {{ getLevelName(result.reading) }}</span>
      </h2>
      <div class="space-y-4">
        <div v-for="i in 3" :key="`read-${i}`" class="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p class="text-sm font-bold text-gray-700 mb-2">Question {{ i }}: {{ ['Main Theme Identificaton', 'Specific Detail Recall', 'Inference & Context'][i-1] }}</p>
          <div class="flex items-center gap-2 text-xs">
            <span class="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">Correct</span>
            <span class="text-gray-400">Response captured: [Simulated]</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Listening Tab -->
    <div v-if="activeTab === 'listening'" class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 class="font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-[var(--color-sg-purple-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
        Listening Comprehension Results
        <span class="ml-auto text-xs font-bold px-2 py-1 rounded-full text-white" :class="getScoreBg(result.listening)">Score: {{ result.listening }}/6 — {{ getLevelName(result.listening) }}</span>
      </h2>
      <div class="space-y-4">
        <div v-for="i in 3" :key="`listen-${i}`" class="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p class="text-sm font-bold text-gray-700 mb-2">Question {{ i }}: {{ ['Speaker Intention', 'Key Information', 'Tone Analysis'][i-1] }}</p>
          <div class="flex items-center gap-2 text-xs">
            <span class="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">Correct</span>
            <span class="text-gray-400">Response captured: [Simulated]</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Vocabulary Tab -->
    <div v-if="activeTab === 'vocabulary'" class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 class="font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-[var(--color-sg-purple-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
        Vocabulary Usage Results
        <span class="ml-auto text-xs font-bold px-2 py-1 rounded-full text-white" :class="getScoreBg(result.vocabulary)">Score: {{ result.vocabulary }}/6 — {{ getLevelName(result.vocabulary) }}</span>
      </h2>
      <div class="space-y-4">
        <div v-for="i in 3" :key="`vocab-${i}`" class="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p class="text-sm font-bold text-gray-700 mb-2">Category {{ i }}: {{ ['Synonyms & Antonyms', 'Contextual Meaning', 'Collocations'][i-1] }}</p>
          <div class="text-xs text-gray-500">Performance: {{ result.vocabulary >= 4 ? 'High Mastery' : 'Developing' }}</div>
        </div>
      </div>
    </div>

    <!-- Grammar Tab -->
    <div v-if="activeTab === 'grammar'" class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 class="font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-[var(--color-sg-purple-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        Grammar Accuracy Results
        <span class="ml-auto text-xs font-bold px-2 py-1 rounded-full text-white" :class="getScoreBg(result.grammar)">Score: {{ result.grammar }}/6 — {{ getLevelName(result.grammar) }}</span>
      </h2>
      <div class="space-y-4">
        <div v-for="i in 3" :key="`grammar-${i}`" class="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p class="text-sm font-bold text-gray-700 mb-2">Category {{ i }}: {{ ['Verb Tense Consistency', 'Relative Clauses', 'Inversions & Conditionals'][i-1] }}</p>
          <div class="text-xs text-gray-500">Performance: {{ result.grammar >= 4 ? 'High Accuracy' : 'Occasional Errors' }}</div>
        </div>
      </div>
    </div>
    <!-- Writing Tab -->
    <div v-if="activeTab === 'writing'" class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 class="font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-[var(--color-sg-purple-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
        Handwritten Essay Submission
        <span class="ml-auto text-xs font-bold px-2 py-1 rounded-full text-white" :class="getScoreBg(result.writing)">{{ getLevelName(result.writing) }}</span>
      </h2>
      <div class="bg-gray-100 rounded-xl border-2 border-dashed border-gray-200 p-4">
        <div class="aspect-video bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
          <svg class="w-16 h-16 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <p class="font-bold text-gray-500">Handwritten Essay Image</p>
          <p class="text-sm text-gray-400">[Simulated upload: essay_{{ student.id }}.jpg]</p>
        </div>
      </div>
    </div>

    <!-- Speaking Tab -->
    <div v-if="activeTab === 'speaking'" class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 class="font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-[var(--color-sg-purple-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
        Speaking Recordings
        <span class="ml-auto text-xs font-bold px-2 py-1 rounded-full text-white" :class="getScoreBg(result.speaking)">{{ getLevelName(result.speaking) }}</span>
      </h2>
      <div class="space-y-3">
        <div v-for="i in 4" :key="`speak-${i}`" class="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <button class="w-10 h-10 rounded-full bg-[var(--color-sg-purple-main)]/10 text-[var(--color-sg-purple-main)] flex items-center justify-center hover:bg-[var(--color-sg-purple-main)] hover:text-white transition-colors shrink-0">
            <svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <div class="flex-1">
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm font-bold text-gray-700">Prompt {{ i }} — {{ ['Describe ideal travel destination', 'Talk about a best friend', 'Compare city life vs rural life', 'Discuss social media impact'][i-1] }}</span>
              <span class="text-xs text-gray-400 font-mono">00:4{{ i }}</span>
            </div>
            <div class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div class="w-0 h-full bg-[var(--color-sg-purple-main)]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pronunciation Tab -->
    <div v-if="activeTab === 'pronunciation'" class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 class="font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-[var(--color-sg-purple-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13v6m3-3H6.825a2 2 0 01-1.897-1.368l-1.325-3.974a2 2 0 011.897-2.632H18M11 5.882a2 2 0 013.417-.592l2.147 6.15M11 5.882V8a2 2 0 002 2h2m0 0h2a2 2 0 012 2v3m-2-12a2 2 0 01-2 2h-2a2 2 0 01-2-2m2 12v3"></path></svg>
        Pronunciation Recordings
        <span class="ml-auto text-xs font-bold px-2 py-1 rounded-full text-white" :class="getScoreBg(result.pronunciation)">{{ getLevelName(result.pronunciation) }}</span>
      </h2>

      <div class="space-y-6">
        <div>
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Part 1: Minimal Pairs</h3>
          <div class="space-y-2">
            <div v-for="pair in [['ship/sheep', '00:03'], ['bit/beat', '00:04'], ['cat/cut', '00:04']]" :key="pair[0]" class="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <button class="w-8 h-8 rounded-full bg-[var(--color-sg-purple-main)]/10 text-[var(--color-sg-purple-main)] flex items-center justify-center hover:bg-[var(--color-sg-purple-main)] hover:text-white transition-colors shrink-0">
                <svg class="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <span class="text-sm font-semibold text-gray-700 flex-1 font-mono">{{ pair[0] }}</span>
              <span class="text-xs text-gray-400 font-mono">{{ pair[1] }}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Part 3: Paragraph Read-Aloud</h3>
          <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <button class="w-10 h-10 rounded-full bg-[var(--color-sg-purple-main)]/10 text-[var(--color-sg-purple-main)] flex items-center justify-center hover:bg-[var(--color-sg-purple-main)] hover:text-white transition-colors shrink-0">
              <svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <div class="flex-1">
              <p class="text-sm font-bold text-gray-700 mb-1">Full Paragraph Recording</p>
              <div class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div class="w-0 h-full bg-[var(--color-sg-purple-main)]"></div>
              </div>
            </div>
            <span class="text-xs text-gray-400 font-mono">01:12</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="text-center py-12">
    <p class="text-gray-500">Student result not found.</p>
    <button @click="router.push('/org/students')" class="btn-primary mt-4">Return to Students</button>
  </div>
</template>
