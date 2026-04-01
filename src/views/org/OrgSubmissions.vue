<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../store'

const store = useAppStore()
const router = useRouter()

const completedStudents = computed(() => {
  return store.orgStudents.filter(s => s.status === 'completed')
})

const activeSubmission = ref(null)

const viewSubmission = (student) => {
  activeSubmission.value = student
}

const downloadAudio = () => {
  alert('Downloading simulated audio file...')
}
</script>

<template>
  <div>
    <div class="mb-8 flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-extrabold text-[var(--color-sg-text-heading)] mb-2">Test Submissions</h1>
        <p class="text-gray-600">Review raw test data, uploaded essays, and voice recordings from your students.</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Submissions List -->
      <div class="lg:col-span-1 card border border-gray-100 p-0 overflow-hidden flex flex-col h-[600px]">
        <div class="p-4 border-b border-gray-100 bg-gray-50 font-bold text-sm uppercase tracking-wider text-gray-500">
          Completed Tests ({{ completedStudents.length }})
        </div>
        <div class="overflow-y-auto flex-1 p-2 space-y-2">
          <div 
            v-for="student in completedStudents" 
            :key="student.id"
            @click="viewSubmission(student)"
            class="p-4 rounded-lg cursor-pointer transition-all border"
            :class="activeSubmission?.id === student.id ? 'bg-purple-50 border-[var(--color-sg-purple-main)]' : 'border-transparent hover:bg-gray-50'"
          >
            <div class="flex justify-between items-start mb-1">
              <span class="font-bold text-gray-900 truncate pr-2">{{ student.name }}</span>
              <span class="text-xs bg-[var(--color-sg-success-green)] text-white px-2 py-0.5 rounded-full font-bold shadow-sm">CEFR: {{ student.score >= 5 ? 'C1/C2' : student.score >= 4 ? 'B2' : student.score >= 3 ? 'B1' : 'A1/A2' }}</span>
            </div>
            <p class="text-xs text-gray-500 truncate mb-2">{{ student.email }}</p>
            <p class="text-[10px] text-gray-400 font-mono">Submitted: {{ student.testDate }}</p>
          </div>
          <div v-if="completedStudents.length === 0" class="p-8 text-center text-gray-400">
            No completed submissions available yet.
          </div>
        </div>
      </div>

      <!-- Submission Detail View -->
      <div class="lg:col-span-2 card border border-gray-100 min-h-[600px] flex flex-col bg-gray-50">
        <div v-if="activeSubmission" class="bg-white rounded border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
          <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ activeSubmission.name }}'s Submission</h2>
              <p class="text-sm text-gray-500">{{ activeSubmission.email }}</p>
            </div>
            <button @click="router.push(`/org/results/${activeSubmission.id}`)" class="btn-secondary py-2 text-sm">View Analytics Report</button>
          </div>

          <div class="p-6 overflow-y-auto flex-1 space-y-8">
            <!-- Skill Scores Summary -->
            <div class="bg-[var(--color-sg-purple-main)]/5 border border-[var(--color-sg-purple-main)]/10 rounded-xl p-6">
              <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-[var(--color-sg-purple-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                7-Skill Score Summary
              </h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div v-for="skill in ['reading', 'listening', 'vocabulary', 'grammar', 'writing', 'speaking', 'pronunciation']" :key="skill" class="bg-white p-3 rounded-lg border border-purple-100 shadow-sm">
                  <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">{{ skill }}</p>
                  <p class="text-xl font-black text-[var(--color-sg-purple-main)]">{{ store.results[activeSubmission.id]?.[skill] || '—' }}</p>
                </div>
                <div class="bg-gradient-to-br from-[var(--color-sg-purple-main)] to-indigo-600 p-3 rounded-lg shadow-md text-white">
                  <p class="text-[10px] uppercase tracking-widest text-purple-200 font-bold mb-1">Overall</p>
                  <p class="text-xl font-black">{{ activeSubmission.score }}</p>
                </div>
              </div>
            </div>

            <!-- Writing Review -->
            <div>
              <h3 class="font-bold text-[var(--color-sg-purple-main)] border-b pb-2 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                Handwritten Essay Upload
              </h3>
              <div class="bg-gray-100 rounded-lg p-2 border border-gray-200 relative group">
                <!-- Mock image placeholder -->
                <div class="aspect-video bg-gray-200 rounded flex items-center justify-center text-gray-400 font-mono text-sm border-2 border-dashed border-gray-300">
                  <div class="text-center">
                    <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    [Simulated Essay Image.jpg]
                  </div>
                </div>
                <button class="absolute top-4 right-4 bg-white/90 shadow text-gray-700 hover:text-[var(--color-sg-purple-main)] rounded px-3 py-1 text-xs font-bold transition-all opacity-0 group-hover:opacity-100 border border-gray-200">
                  Expand Image
                </button>
              </div>
            </div>

            <!-- Speaking Review -->
            <div>
               <h3 class="font-bold text-[var(--color-sg-purple-main)] border-b pb-2 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                Speaking Audio Tracks
              </h3>
              
              <div class="space-y-3">
                <div v-for="i in 4" :key="`speak-${i}`" class="flex items-center gap-4 bg-white p-3 border border-gray-200 rounded shadow-sm">
                  <button class="w-10 h-10 rounded-full bg-purple-100 text-[var(--color-sg-purple-main)] flex items-center justify-center hover:bg-[var(--color-sg-purple-main)] hover:text-white transition-colors shrink-0">
                    <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </button>
                  <div class="flex-1">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-xs font-bold text-gray-700">Prompt {{ i }}</span>
                      <span class="text-[10px] text-gray-400 font-mono">00:4{{ i }}</span>
                    </div>
                    <div class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div class="w-0 h-full bg-[var(--color-sg-purple-main)]"></div>
                    </div>
                  </div>
                  <button @click="downloadAudio" class="text-gray-400 hover:text-gray-700 shrink-0" title="Download Audio">
                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  </button>
                </div>
              </div>
            </div>
            
             <!-- Pronunciation Review -->
            <div>
               <h3 class="font-bold text-[var(--color-sg-purple-main)] border-b pb-2 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13v6m3-3H6.825a2 2 0 01-1.897-1.368l-1.325-3.974a2 2 0 011.897-2.632H18M11 5.882a2 2 0 013.417-.592l2.147 6.15M11 5.882V8a2 2 0 002 2h2m0 0h2a2 2 0 012 2v3m-2-12a2 2 0 01-2 2h-2a2 2 0 01-2-2m2 12v3"></path></svg>
                Pronunciation Read Aloud
              </h3>
              
              <div class="space-y-3">
                <div class="flex items-center gap-4 bg-white p-3 border border-gray-200 rounded shadow-sm">
                  <button class="w-10 h-10 rounded-full bg-purple-100 text-[var(--color-sg-purple-main)] flex items-center justify-center hover:bg-[var(--color-sg-purple-main)] hover:text-white transition-colors shrink-0">
                    <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </button>
                  <div class="flex-1">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-xs font-bold text-gray-700">Part 3: Paragraph</span>
                      <span class="text-[10px] text-gray-400 font-mono">01:12</span>
                    </div>
                    <div class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div class="w-0 h-full bg-[var(--color-sg-purple-main)]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div v-else class="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center h-full">
           <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
           <p class="text-lg font-bold text-gray-500">Select a submission from the list</p>
           <p class="text-sm">Click on any completed test on the left to review the raw data and media files.</p>
        </div>
      </div>
    </div>
  </div>
</template>
