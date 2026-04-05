<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '../../store'

const store = useAppStore()
const router = useRouter()
const route = useRoute()

const form = computed(() => store.testState)
const hasSavedSession = ref(false)

onMounted(() => {
  // Prefill email and orgId from invitation URLs if present
  if (route.query.email) form.value.studentEmail = decodeURIComponent(route.query.email)
  if (route.query.org_id) form.value.orgId = route.query.org_id

  const saved = localStorage.getItem('sg_placement_test_state')
  if (saved) {
    const parsed = JSON.parse(saved)
    if (parsed.studentName && parsed.studentEmail) {
      hasSavedSession.value = true
    }
  }
})

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Chinese', 'Arabic'
]

const startTest = () => {
  if (form.value.studentName && form.value.studentEmail) {
    if (!hasSavedSession.value) {
      store.testState.currentSection = 0
      store.testState.answers = {}
    }
    store.persistTestState()
    router.push('/test/quiz')
  }
}

const startNewTest = () => {
  store.clearTestState()
  hasSavedSession.value = false
}
</script>

<template>
  <div class="max-w-2xl mx-auto mt-12">
    <div class="text-center mb-12 border-b-2 border-purple-100 pb-8">
      <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center p-4">
        <img src="https://speakingenie.com/lovable-uploads/logo.png" alt="Speaking Genie Logo" class="w-full h-auto object-contain">
      </div>
      <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Language Placement Test</h1>
      <p class="text-gray-600 text-lg">Evaluate your proficiency across 7 key language skills: Reading, Writing, Speaking, Listening, Vocabulary, Grammar, and Pronunciation.</p>
    </div>

    <div class="card space-y-8 !p-10 border-t-8 border-t-[var(--color-sg-purple-main)] shadow-2xl relative overflow-hidden">
      <!-- Decorative background glow -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-sg-purple-light)] rounded-full mix-blend-multiply filter blur-2xl opacity-40 pointer-events-none"></div>

      <div v-if="hasSavedSession" class="bg-yellow-50 border border-yellow-200 p-8 rounded-xl mb-6 relative z-10 shadow-sm transition-all hover:shadow-md">
        <div class="flex items-center gap-3 mb-4 text-yellow-800">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 class="font-extrabold text-2xl tracking-tight">Resume Your Test</h3>
        </div>
        <p class="text-yellow-700 leading-relaxed mb-6">We found a saved session for <strong class="text-yellow-900 border-b border-yellow-300">{{ form.studentName }}</strong> <em>({{ form.studentEmail }})</em>. Would you like to resume where you left off?</p>
        <div class="flex flex-col sm:flex-row gap-4">
          <button @click="startTest" class="btn-primary flex-1 py-4 text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">Resume Test</button>
          <button @click="startNewTest" class="btn-secondary flex-1 py-4 text-lg text-red-600 hover:bg-red-50 border-red-200 transition-all transition-colors">Start New Test</button>
        </div>
      </div>

      <div v-else class="relative z-10">
        <div class="text-center mb-10 border-b border-gray-100 pb-8">
          <div class="w-20 h-20 bg-gradient-to-br from-[var(--color-sg-purple-light)] to-[var(--color-sg-purple-main)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform rotate-3">
            <svg class="w-10 h-10 text-white transform -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome to the Assessment</h2>
          <p class="text-gray-500 mt-2">Please fill in your details to begin the language placement test.</p>
        </div>
        
        <div class="bg-purple-50 text-[var(--color-sg-purple-dark)] p-6 rounded-xl text-sm mb-8 border border-purple-100 shadow-sm relative overflow-hidden">
          <div class="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-purple-100/50 to-transparent pointer-events-none"></div>
          <h4 class="font-bold mb-3 flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Things to Know</h4>
          <ul class="list-disc pl-5 space-y-2 relative z-10">
            <li>The test covers 7 skills: Reading, Writing, Speaking, Listening, Vocabulary, Grammar, and Pronunciation.</li>
            <li>You can <strong>Save and Pause</strong> your test at any time. Your progress is saved securely.</li>
            <li>For the writing section, you will need to upload a photo of a handwritten essay.</li>
            <li>Ensure you are in a quiet environment for the Speaking and Pronunciation sections.</li>
          </ul>
        </div>

        <div class="space-y-6">
          <div class="relative">
            <label class="block text-sm font-bold text-gray-700 mb-2">Target Language</label>
            <div class="relative flex items-center">
              <div class="absolute left-4 text-[var(--color-sg-purple-main)] pointer-events-none">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
              </div>
              <select v-model="form.language" class="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-4 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent transition-all appearance-none cursor-pointer text-gray-900 font-medium">
                <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
              </select>
              <div class="absolute right-4 text-gray-400 pointer-events-none">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div class="relative">
            <label class="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <div class="relative flex items-center">
              <div class="absolute left-4 text-[var(--color-sg-purple-main)] pointer-events-none">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <input v-model="form.studentName" type="text" class="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-4 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent transition-all text-gray-900 font-medium" placeholder="Enter your full name" required />
            </div>
          </div>

          <div class="relative">
            <label class="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <div class="relative flex items-center">
              <div class="absolute left-4 text-[var(--color-sg-purple-main)] pointer-events-none">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <input v-model="form.studentEmail" type="email" class="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-4 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent transition-all text-gray-900 font-medium" placeholder="Enter your email" required />
            </div>
          </div>

          <div class="pt-8">
            <button 
              @click="startTest" 
              :disabled="!form.studentName || !form.studentEmail"
              class="btn-primary w-full py-4 text-xl font-bold shadow-lg flex justify-center items-center gap-2 group transition-all"
              :class="!form.studentName || !form.studentEmail ? 'opacity-50 cursor-not-allowed shadow-none' : 'hover:-translate-y-1 hover:shadow-xl hover:bg-[var(--color-sg-purple-dark)]'"
            >
              Begin {{ form.language }} Assessment
              <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
