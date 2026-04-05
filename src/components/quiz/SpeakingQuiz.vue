<script setup>
import { ref } from 'vue'
import { useAppStore } from '../../store'
import SpeakingItem from './SpeakingItem.vue'

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

        <SpeakingItem :promptId="prompt.id" :isActive="activeRecordingPrompt === prompt.id" :globalActivePrompt="activeRecordingPrompt" @startRecording="activeRecordingPrompt = $event" @stopRecording="activeRecordingPrompt = null" @skipPrompt="activeRecordingPrompt = null" />
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
        
        <SpeakingItem promptId="p4" :isActive="activeRecordingPrompt === 'p4'" :globalActivePrompt="activeRecordingPrompt" @startRecording="activeRecordingPrompt = $event" @stopRecording="activeRecordingPrompt = null" @skipPrompt="activeRecordingPrompt = null" />
      </div>
    </div>
  </div>
</template>
