<script setup>
import { computed, watch, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../store'
import api from '../../services/api' // import api for uploading media

import ReadingQuiz from '../../components/quiz/ReadingQuiz.vue'
import WritingQuiz from '../../components/quiz/WritingQuiz.vue'
import SpeakingQuiz from '../../components/quiz/SpeakingQuiz.vue'
import ListeningQuiz from '../../components/quiz/ListeningQuiz.vue'
import VocabularyQuiz from '../../components/quiz/VocabularyQuiz.vue'
import GrammarQuiz from '../../components/quiz/GrammarQuiz.vue'
import PronunciationQuiz from '../../components/quiz/PronunciationQuiz.vue'
import SpeakingItem from '../../components/quiz/SpeakingItem.vue'

const store = useAppStore()
const router = useRouter()

const SECTIONS = [
  { id: 'reading', title: 'Reading Comprehension', description: 'Evaluate your ability to understand written texts, from simple phrases to complex documents.', component: ReadingQuiz },
  { id: 'writing', title: 'Writing Skills', description: 'Assess your ability to write coherently, from basic sentences to structured paragraphs.', component: WritingQuiz },
  { id: 'speaking', title: 'Speaking Fluency', description: 'Test your spoken communication, covering pronunciation, vocabulary usage, and conversational flow.', component: SpeakingQuiz },
  { id: 'listening', title: 'Listening Comprehension', description: 'Gauge your understanding of spoken language, including dialogues and monologues.', component: ListeningQuiz },
  { id: 'vocabulary', title: 'Vocabulary Usage', description: 'Measure your word knowledge and ability to use varied terminology correctly.', component: VocabularyQuiz },
  { id: 'grammar', title: 'Grammar Accuracy', description: 'Evaluate your command over grammar structures, syntax, and sentence formations.', component: GrammarQuiz },
  { id: 'pronunciation', title: 'Pronunciation & Intonation', description: 'Check your pronunciation accuracy and native-like rhythm.', component: PronunciationQuiz }
]

const currentSectionIndex = computed(() => store.testState.currentSection)
const currentSection = computed(() => SECTIONS[currentSectionIndex.value])
const language = computed(() => store.testState.language)
const isLastSection = computed(() => currentSectionIndex.value === SECTIONS.length - 1)

// Timer logic
const testStartTime = ref(Date.now())
const elapsedTime = ref(0)
let timerInterval = null

onMounted(() => {
  timerInterval = setInterval(() => {
    elapsedTime.value = Math.floor((Date.now() - testStartTime.value) / 1000)
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timerInterval)
})

const formattedTime = computed(() => {
  const m = Math.floor(elapsedTime.value / 60).toString().padStart(2, '0')
  const s = (elapsedTime.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

// Progress calculation
const progress = computed(() => {
  return ((currentSectionIndex.value + 1) / SECTIONS.length) * 100
})

// Validation
const isCurrentSectionValid = computed(() => {
  const ans = store.testState.answers[currentSection.value.id]
  if (!ans && currentSection.value.id !== 'speaking' && currentSection.value.id !== 'pronunciation') return false
  
  if (currentSection.value.id === 'reading') {
    return ans.q1 && ans.q2 && ans.q3 && ans.q4 && ans.q5 && ans.q6
  }
  if (currentSection.value.id === 'writing') {
    // We will refactor writing to upload soon. For now, valid if there is text or a file
    return ans.essay && ans.essay.trim().length > 20 || ans.fileUploaded
  }
  if (currentSection.value.id === 'listening') {
    return ans.q1 && ans.q2 && ans.q3 && ans.q4
  }
  if (currentSection.value.id === 'vocabulary') {
    return ans.p1_1 && ans.p1_2 && ans.p1_3 && ans.p1_4 && ans.p2_1 && ans.p2_2 && ans.p2_3 && ans.p2_4 && ans.p3_1 && ans.p3_2 && ans.p3_3
  }
  if (currentSection.value.id === 'grammar') {
    return ans.p1_1 && ans.p1_2 && ans.p1_3 && ans.p2_1 && ans.p2_2 && ans.p2_3 && ans.p3_1 && ans.p3_2 && ans.p3_3 && ans.p3_4 && ans.p3_5
  }
  return true // speaking, pronunciation not strictly validated via text
})

// Auto persist when state changes
watch(() => store.testState, () => {
  store.persistTestState()
}, { deep: true })

// Make sure user started properly
const unwatchName = watch(() => store.testState.studentName, (val) => {
  if (!val) {
    router.push('/test')
  }
}, { immediate: true })

const saveAndPause = () => {
  store.persistTestState()
  router.push('/test')
}

const isUploading = ref(false)

const nextSection = async () => {
  // Check and upload any pending audio blogs
  const storedBlobs = Object.keys(store.audioBlobs)
  if (storedBlobs.length > 0) {
    isUploading.value = true
    try {
      for (const promptId of storedBlobs) {
        const blob = store.audioBlobs[promptId]
        const formData = new FormData()
        formData.append('audio', blob, `${promptId}.webm`)
        
        const { data } = await api.post('/upload-media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        const fileUrl = data.url || (data.data && data.data.url) || data
        
        if (currentSection.value.id === 'speaking' || store.testState.answers.speaking[promptId]) {
          store.testState.answers.speaking[promptId] = fileUrl
        } else if (currentSection.value.id === 'pronunciation' || store.testState.answers.pronunciation[promptId]) {
          store.testState.answers.pronunciation[promptId] = fileUrl
        }
      }
      
      // Clear blobs after they are uploaded securely
      for (const promptId of storedBlobs) delete store.audioBlobs[promptId]
    } catch (e) {
      console.error("Failed to upload audio files.", e)
      alert("There was an issue uploading your audio responses. Please check your network connection.")
      isUploading.value = false
      return
    }
    isUploading.value = false
  }

  if (isLastSection.value) {
    // Generate mock score based on CEFR level (1-6 random) to complete test
    const mockResult = {}
    SECTIONS.forEach(s => {
      mockResult[s.id] = Math.floor(Math.random() * 6) + 1 // 1 to 6
    })
    
    // Attempt to link to an org (we assume Org 1 for this static mock)
    // First, register student if not exists
    const existing = store.students.find(s => s.email === store.testState.studentEmail)
    const nextId = store.students.length > 0 ? Math.max(...store.students.map(s => s.id)) + 1 : 101 // Using + 1 to the max existing ID, or starting at 101
    const studentId = existing ? existing.id : nextId
    
    if (!existing) {
       store.students.push({
         id: studentId,
         orgId: 1, // Defaulting to org 1 for public test taker mock
         name: store.testState.studentName,
         email: store.testState.studentEmail,
         status: 'pending'
       })
    }
    
    unwatchName() // Stop the watcher from intercepting the clearTestState
    store.saveTestResult(studentId, mockResult)
    router.push('/test/complete')
  } else {
    store.testState.currentSection++
  }
}

const prevSection = () => {
  if (currentSectionIndex.value > 0) {
    store.testState.currentSection--
  }
}

</script>

<template>
  <div v-if="currentSection" class="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
    
    <!-- Sidebar Test Navigator -->
    <div class="w-full md:w-64 shrink-0">
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sticky top-6">
        <h3 class="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm border-b pb-2">Test Navigator</h3>
        <ul class="space-y-2">
          <li v-for="(section, idx) in SECTIONS" :key="section.id" class="flex items-center gap-3">
            <div 
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
              :class="[
                idx === currentSectionIndex ? 'bg-[var(--color-sg-purple-main)] text-white' : 
                idx < currentSectionIndex ? 'bg-[var(--color-sg-success-green)] text-white' : 
                'bg-gray-100 text-gray-400'
              ]"
            >
              <span v-if="idx < currentSectionIndex">✓</span>
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <span 
              class="text-sm transition-colors"
              :class="idx === currentSectionIndex ? 'font-bold text-[var(--color-sg-purple-main)]' : 'text-gray-600'"
            >
              {{ section.title.split(' ')[0] }}
            </span>
          </li>
        </ul>

        <div class="mt-8 pt-4 border-t border-gray-100 space-y-4">
          <div class="font-mono text-gray-700 bg-gray-50 p-3 rounded border border-gray-200 flex items-center justify-between">
            <span class="text-xs uppercase tracking-widest font-bold text-gray-500">Timer</span>
            <span class="font-bold text-lg tracking-wider">{{ formattedTime }}</span>
          </div>
          <button @click="saveAndPause" class="btn-secondary w-full py-2 text-sm flex items-center justify-center gap-2">
            <span>💾</span> Save & Pause
          </button>
        </div>
      </div>
    </div>

    <!-- Main Quiz Area -->
    <div class="flex-1 min-w-0">
      <!-- Progress Header -->
      <div class="mb-8">
        <div class="flex justify-between items-end mb-2">
          <div>
            <h2 class="text-sm font-bold text-[var(--color-sg-purple-main)] uppercase tracking-wider mb-1">
              Section {{ currentSectionIndex + 1 }} of {{ SECTIONS.length }}
            </h2>
            <h1 class="text-3xl font-extrabold text-[var(--color-sg-text-heading)]">{{ currentSection.title }}</h1>
          </div>
          <span class="text-sm font-mono text-gray-500 hidden sm:block">{{ language }} Assessment</span>
        </div>
        
        <!-- Progress Bar -->
        <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-[var(--color-sg-success-green)] transition-all duration-500 ease-out"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Quiz Content -->
      <div class="card min-h-[400px] flex flex-col justify-between mb-8 border-t-4 border-[var(--color-sg-purple-main)] relative">
        <div>
          <div class="bg-purple-50 rounded-lg p-6 mb-8 border border-purple-100 border-l-4 border-l-[var(--color-sg-purple-main)]">
            <h3 class="font-bold text-gray-900 mb-2">Instructions</h3>
            <p class="text-gray-700 leading-relaxed">{{ currentSection.description }}</p>
          </div>
          
          <!-- Dynamic Component Injection -->
          <transition name="fade" mode="out-in">
            <component :is="currentSection.component" :key="currentSection.id" />
          </transition>
        </div>

        <!-- Footer Nav -->
        <div class="flex justify-between items-center mt-12 pt-6 border-t border-gray-100">
          <button 
            @click="prevSection" 
            :disabled="currentSectionIndex === 0 || isUploading"
            class="btn-secondary"
            :class="(currentSectionIndex === 0 || isUploading) ? 'opacity-50 cursor-not-allowed hidden' : ''"
          >
            Previous
          </button>
          <div class="flex-1"></div>
          <button 
            @click="nextSection" 
            class="btn-primary flex items-center gap-2 transition-all min-w-[150px] justify-center"
            :disabled="!isCurrentSectionValid || isUploading"
            :class="(!isCurrentSectionValid || isUploading) ? 'opacity-50 cursor-not-allowed' : ''"
          >
            <span v-if="isUploading">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span v-if="isUploading">Saving...</span>
            <span v-else>{{ isLastSection ? 'Submit Test' : 'Next Section' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
