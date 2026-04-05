<script setup>
import { ref } from 'vue'
import { useAppStore } from '../../store'
import PronunciationItem from './PronunciationItem.vue'

const store = useAppStore()

if (!store.testState.answers.pronunciation) {
  store.testState.answers.pronunciation = {
    p1_1: 'unrecorded',
    p1_2: 'unrecorded',
    p1_3: 'unrecorded',
    p2_1: 'unrecorded',
    p2_2: 'unrecorded',
    p2_3: 'unrecorded',
    p2_4: 'unrecorded',
    p3_1: 'unrecorded'
  }
}
const answers = store.testState.answers.pronunciation

const activeRecordingItem = ref(null)
</script>

<template>
  <div class="space-y-8 text-left">
    <div class="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-6">
      <h3 class="font-bold text-[var(--color-sg-purple-main)] mb-2">Recording Instructions</h3>
      <p class="text-sm text-gray-700">Please record in a quiet room. Record each pair, word, or paragraph using its individual recording button. Speak clearly and naturally.</p>
    </div>

    <!-- Part 1: Minimal Pairs -->
    <div class="card space-y-4 shadow-sm border border-gray-100">
      <h3 class="font-bold border-b pb-2 text-[var(--color-sg-purple-main)] uppercase tracking-wide text-sm flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13v6m3-3H6.825a2 2 0 01-1.897-1.368l-1.325-3.974a2 2 0 011.897-2.632H18M11 5.882a2 2 0 013.417-.592l2.147 6.15M11 5.882V8a2 2 0 002 2h2m0 0h2a2 2 0 012 2v3m-2-12a2 2 0 01-2 2h-2a2 2 0 01-2-2m2 12v3"></path></svg> Part 1: Minimal Pairs</h3>
      <p class="text-sm text-gray-600 mb-4 font-semibold">Read the following pairs of words aloud, paying attention to the subtle differences in sound.</p>

      <div class="grid gap-4 md:grid-cols-3">
        <div class="bg-gray-50 p-4 rounded border flex justify-between items-center group hover:bg-white transition-colors hover:shadow-md">
          <p class="text-2xl font-serif text-center font-bold tracking-wide">Ship / Sheep</p>
          <PronunciationItem itemId="p1_1" :isActive="activeRecordingItem === 'p1_1'" :globalActiveItem="activeRecordingItem" @startRecording="activeRecordingItem = $event" @stopRecording="activeRecordingItem = null" />
        </div>
        <div class="bg-gray-50 p-4 rounded border flex justify-between items-center group hover:bg-white transition-colors hover:shadow-md">
          <p class="text-2xl font-serif text-center font-bold tracking-wide">Bat / But</p>
          <PronunciationItem itemId="p1_2" :isActive="activeRecordingItem === 'p1_2'" :globalActiveItem="activeRecordingItem" @startRecording="activeRecordingItem = $event" @stopRecording="activeRecordingItem = null" />
        </div>
        <div class="bg-gray-50 p-4 rounded border flex justify-between items-center group hover:bg-white transition-colors hover:shadow-md">
          <p class="text-2xl font-serif text-center font-bold tracking-wide">Think / Sink</p>
          <PronunciationItem itemId="p1_3" :isActive="activeRecordingItem === 'p1_3'" :globalActiveItem="activeRecordingItem" @startRecording="activeRecordingItem = $event" @stopRecording="activeRecordingItem = null" />
        </div>
      </div>
    </div>

    <!-- Part 2: Targeted Sounds -->
    <div class="card space-y-4 shadow-sm border border-gray-100">
      <h3 class="font-bold border-b pb-2 text-[var(--color-sg-purple-main)] uppercase tracking-wide text-sm flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg> Part 2: Targeted Sounds</h3>
      <p class="text-sm text-gray-600 mb-4 font-semibold">Read the following words aloud, focusing on the clarity of the consonants and vowels.</p>

      <div class="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div class="bg-gray-50 p-4 rounded border flex justify-between items-center group hover:bg-white transition-colors hover:shadow-md">
          <p class="text-xl font-serif font-bold">1. Through</p>
          <PronunciationItem itemId="p2_1" :isActive="activeRecordingItem === 'p2_1'" :globalActiveItem="activeRecordingItem" @startRecording="activeRecordingItem = $event" @stopRecording="activeRecordingItem = null" />
        </div>
        <div class="bg-gray-50 p-4 rounded border flex justify-between items-center group hover:bg-white transition-colors hover:shadow-md">
          <p class="text-xl font-serif font-bold">2. Measurement</p>
          <PronunciationItem itemId="p2_2" :isActive="activeRecordingItem === 'p2_2'" :globalActiveItem="activeRecordingItem" @startRecording="activeRecordingItem = $event" @stopRecording="activeRecordingItem = null" />
        </div>
        <div class="bg-gray-50 p-4 rounded border flex justify-between items-center group hover:bg-white transition-colors hover:shadow-md">
          <p class="text-xl font-serif font-bold">3. Specific</p>
          <PronunciationItem itemId="p2_3" :isActive="activeRecordingItem === 'p2_3'" :globalActiveItem="activeRecordingItem" @startRecording="activeRecordingItem = $event" @stopRecording="activeRecordingItem = null" />
        </div>
        <div class="bg-gray-50 p-4 rounded border flex justify-between items-center group hover:bg-white transition-colors hover:shadow-md">
          <p class="text-xl font-serif font-bold">4. Unbelievable</p>
          <PronunciationItem itemId="p2_4" :isActive="activeRecordingItem === 'p2_4'" :globalActiveItem="activeRecordingItem" @startRecording="activeRecordingItem = $event" @stopRecording="activeRecordingItem = null" />
        </div>
      </div>
    </div>

    <!-- Part 3: Reading Aloud -->
    <div class="card space-y-4 shadow-sm border border-gray-100">
      <h3 class="font-bold border-b pb-2 text-[var(--color-sg-purple-main)] uppercase tracking-wide text-sm flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg> Part 3: Reading Aloud</h3>
      <p class="text-sm text-gray-600 mb-4 font-semibold">Read the following paragraph aloud naturally. Pay attention to pausing, stress, and intonation.</p>
      
      <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
        <p class="text-lg font-serif leading-relaxed text-gray-800">
          "The rapid development of technology has fundamentally changed the way we communicate. 
          While it has made connecting with people across the globe easier than ever, some argue that it has also reduced the quality of our face-to-face interactions. 
          It is crucial to find a balance between the digital world and the physical one."
        </p>
        <div class="bg-gray-50 p-4 rounded-lg border w-full sm:w-auto flex justify-center shrink-0">
          <PronunciationItem itemId="p3_1" :isActive="activeRecordingItem === 'p3_1'" :globalActiveItem="activeRecordingItem" @startRecording="activeRecordingItem = $event" @stopRecording="activeRecordingItem = null" />
        </div>
      </div>
    </div>
  </div>
</template>
