<script setup>
import { ref } from 'vue'
import { useAppStore } from '../../store'

const store = useAppStore()

if (!store.testState.answers.speaking) {
  store.testState.answers.speaking = {
    p1: 'unrecorded',
    p2: 'unrecorded',
    p3: 'unrecorded',
    p4: 'unrecorded'
  }
}
const answers = store.testState.answers.speaking

const activeRecordingPrompt = ref(null)
const recordingTime = ref(0)
let timer = null

const toggleRecording = (promptId) => {
  if (activeRecordingPrompt.value === promptId) {
    // Stop recording
    activeRecordingPrompt.value = null
    clearInterval(timer)
    answers[promptId] = 'recorded'
  } else {
    // Start recording
    if (activeRecordingPrompt.value) clearInterval(timer)
    activeRecordingPrompt.value = promptId
    recordingTime.value = 0
    timer = setInterval(() => {
      recordingTime.value++
    }, 1000)
  }
}

const skipPrompt = (promptId) => {
  if (activeRecordingPrompt.value === promptId) {
    activeRecordingPrompt.value = null
    clearInterval(timer)
  }
  answers[promptId] = 'skipped'
}

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const prompts = [
  { id: 'p1', title: 'Prompt 1: Descriptive Speaking', desc: 'Describe your ideal travel destination. What would it look like, sound like, and feel like? Use descriptive adjectives.' },
  { id: 'p2', title: 'Prompt 2: Storytelling', desc: 'Tell a short story about a time you faced a challenge and how you overcame it.' },
  { id: 'p3', title: 'Prompt 3: Opinion Generation', desc: 'Do you think schools should have a longer summer vacation? Why or why not?' }
]
</script>

<template>
  <div class="space-y-6 text-left">
    <div class="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-6">
      <h3 class="font-bold text-[var(--color-sg-purple-main)] mb-2">Recording Instructions</h3>
      <p class="text-sm text-gray-700">Please record in a quiet room with no background noise. Record your response for each prompt separately. If you cannot answer a prompt, use the "Can't Answer" button.</p>
    </div>

    <!-- Prompts -->
    <div class="space-y-6">
      <!-- Standard Prompts -->
      <div v-for="prompt in prompts" :key="prompt.id" class="card space-y-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-gray-900 border-b pb-2">{{ prompt.title }}</h4>
        <p class="text-gray-700 leading-relaxed">{{ prompt.desc }}</p>

        <!-- Recording Controls -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50 bg-gray-50/50 p-4 rounded-lg">
          <div class="flex items-center gap-4">
            <button 
              @click="toggleRecording(prompt.id)"
              :disabled="activeRecordingPrompt && activeRecordingPrompt !== prompt.id"
              class="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white border-2 relative shrink-0"
              :class="[
                activeRecordingPrompt === prompt.id ? 'border-red-100 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'border-gray-200 hover:border-red-100',
                activeRecordingPrompt && activeRecordingPrompt !== prompt.id ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <div class="w-4 h-4 rounded-full transition-all" :class="activeRecordingPrompt === prompt.id ? 'bg-red-500 scale-75 rounded-sm' : 'bg-red-500'"></div>
              <span v-if="activeRecordingPrompt === prompt.id" class="absolute -top-1 -right-1 flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </button>

            <!-- Waveform Animation & Status -->
            <div class="flex items-center gap-3">
              <div v-if="activeRecordingPrompt === prompt.id" class="flex items-center gap-1 h-6">
                <div class="w-1 bg-red-400 rounded-full animate-pulse h-full" style="animation-delay: 0s;"></div>
                <div class="w-1 bg-red-500 rounded-full animate-pulse h-4" style="animation-delay: 0.2s;"></div>
                <div class="w-1 bg-red-400 rounded-full animate-pulse h-5" style="animation-delay: 0.4s;"></div>
                <div class="w-1 bg-red-500 rounded-full animate-pulse h-3" style="animation-delay: 0.1s;"></div>
              </div>
              <span v-if="activeRecordingPrompt === prompt.id" class="font-mono font-bold text-red-500 w-12 text-center">{{ formatTime(recordingTime) }}</span>
              <span v-else-if="answers[prompt.id] === 'recorded'" class="text-sm font-bold text-[var(--color-sg-success-green)] uppercase tracking-wider flex items-center gap-1">✓ Recorded</span>
              <span v-else-if="answers[prompt.id] === 'skipped'" class="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">⚠ Skipped</span>
            </div>
          </div>
          <button @click="skipPrompt(prompt.id)" class="text-xs font-bold text-gray-400 hover:text-gray-600 underline uppercase pr-2">Can't Answer</button>
        </div>
      </div>

      <!-- Prompt 4: Interactive Context -->
      <div class="card space-y-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-gray-900 border-b pb-2">Prompt 4: Contextual Response</h4>
        <p class="text-sm text-gray-500 italic mb-2">Imagine I am a friend who is feeling down. Respond to me and offer some advice or comfort.</p>
        
        <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg italic text-gray-700 flex gap-4 items-start">
          <div class="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">🗣️</div>
          <div>
            <p>"(Sound of a gentle sigh, followed by a slight pause)... Hey. Thanks for meeting me. I just… I don't know, I've just been feeling so overwhelmed lately. Nothing feels right, you know? I'm trying to keep up with everything, but it feels like I'm falling behind. I'm just so exhausted."</p>
          </div>
        </div>
        <p class="text-sm font-bold text-[var(--color-sg-purple-main)] mt-2">Your task is to respond to this friend. Offer some words of comfort and advice.</p>
        
        <!-- Recording Controls -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50 bg-gray-50/50 p-4 rounded-lg mt-4">
          <div class="flex items-center gap-4">
            <button 
              @click="toggleRecording('p4')"
              :disabled="activeRecordingPrompt && activeRecordingPrompt !== 'p4'"
              class="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white border-2 relative shrink-0"
              :class="[
                activeRecordingPrompt === 'p4' ? 'border-red-100 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'border-gray-200 hover:border-red-100',
                activeRecordingPrompt && activeRecordingPrompt !== 'p4' ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <div class="w-4 h-4 rounded-full transition-all" :class="activeRecordingPrompt === 'p4' ? 'bg-red-500 scale-75 rounded-sm' : 'bg-red-500'"></div>
              <span v-if="activeRecordingPrompt === 'p4'" class="absolute -top-1 -right-1 flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </button>

            <!-- Waveform Animation & Status -->
            <div class="flex items-center gap-3">
              <div v-if="activeRecordingPrompt === 'p4'" class="flex items-center gap-1 h-6">
                <div class="w-1 bg-red-400 rounded-full animate-pulse h-full" style="animation-delay: 0s;"></div>
                <div class="w-1 bg-red-500 rounded-full animate-pulse h-4" style="animation-delay: 0.2s;"></div>
                <div class="w-1 bg-red-400 rounded-full animate-pulse h-5" style="animation-delay: 0.4s;"></div>
                <div class="w-1 bg-red-500 rounded-full animate-pulse h-3" style="animation-delay: 0.1s;"></div>
              </div>
              <span v-if="activeRecordingPrompt === 'p4'" class="font-mono font-bold text-red-500 w-12 text-center">{{ formatTime(recordingTime) }}</span>
              <span v-else-if="answers.p4 === 'recorded'" class="text-sm font-bold text-[var(--color-sg-success-green)] uppercase tracking-wider flex items-center gap-1">✓ Recorded</span>
              <span v-else-if="answers.p4 === 'skipped'" class="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">⚠ Skipped</span>
            </div>
          </div>
          <button @click="skipPrompt('p4')" class="text-xs font-bold text-gray-400 hover:text-gray-600 underline uppercase pr-2">Can't Answer</button>
        </div>
      </div>
    </div>
  </div>
</template>
