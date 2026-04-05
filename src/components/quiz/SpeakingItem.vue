<script setup>
import { computed, watch } from 'vue'
import { useAppStore } from '../../store'
import { useAudioRecorder } from '../../composables/useAudioRecorder'

const props = defineProps({
  promptId: String,
  isActive: Boolean,
  globalActivePrompt: String
})

const emit = defineEmits(['startRecording', 'stopRecording', 'skipPrompt'])
const store = useAppStore()

const {
  isRecording,
  recordingTime,
  formattedTime,
  audioBlob,
  audioUrl,
  startRecording,
  stopRecording,
  playAudio,
  discardRecording
} = useAudioRecorder()

const answerState = computed(() => store.testState.answers.speaking[props.promptId])
const isRecorded = computed(() => !!audioBlob.value || answerState.value === 'recorded')
const isSkipped = computed(() => answerState.value === 'skipped')

const toggleAction = () => {
  if (isRecorded.value) {
    playAudio()
  } else if (isRecording.value) {
    stopRecording()
  } else {
    emit('startRecording', props.promptId)
    startRecording()
  }
}

watch(() => props.isActive, (newActive) => {
  if (!newActive && isRecording.value) stopRecording()
})

watch(audioBlob, (blob) => {
  if (blob) {
    store.audioBlobs[props.promptId] = blob
    store.testState.answers.speaking[props.promptId] = 'recorded'
    emit('stopRecording', props.promptId)
  }
})

const clearAudio = () => {
  discardRecording()
  delete store.audioBlobs[props.promptId]
  store.testState.answers.speaking[props.promptId] = 'unrecorded'
}

const skipPrompt = () => {
  if (isRecording.value) stopRecording()
  clearAudio()
  store.testState.answers.speaking[props.promptId] = 'skipped'
  emit('skipPrompt', props.promptId)
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50 bg-gray-50/50 p-4 rounded-lg mt-4">
    <div class="flex items-center gap-4">
      <button 
        @click.stop="toggleAction"
        :disabled="(!isActive && globalActivePrompt) || isSkipped"
        class="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white border-2 relative shrink-0"
        :class="[
          isRecording ? 'border-red-100 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : (isRecorded ? 'border-[var(--color-sg-purple-main)]' : 'border-gray-200 hover:border-red-100'),
          ((!isActive && globalActivePrompt && !isRecorded) || isSkipped) ? 'opacity-50 cursor-not-allowed' : ''
        ]"
      >
        <svg v-if="isRecorded" class="w-6 h-6 text-[var(--color-sg-purple-main)] ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
        <div v-else class="w-4 h-4 rounded-full transition-all" :class="isRecording ? 'bg-red-500 scale-75 rounded-sm' : 'bg-red-500'"></div>
        <span v-if="isRecording" class="absolute -top-1 -right-1 flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </button>

      <!-- Waveform Animation & Status -->
      <div class="flex items-center gap-3">
        <div v-if="isRecording" class="flex items-center gap-1 h-6">
          <div class="w-1 bg-red-400 rounded-full animate-pulse h-full" style="animation-delay: 0s;"></div>
          <div class="w-1 bg-red-500 rounded-full animate-pulse h-4" style="animation-delay: 0.2s;"></div>
          <div class="w-1 bg-red-400 rounded-full animate-pulse h-5" style="animation-delay: 0.4s;"></div>
          <div class="w-1 bg-red-500 rounded-full animate-pulse h-3" style="animation-delay: 0.1s;"></div>
        </div>
        
        <span v-if="isRecording" class="font-mono font-bold text-red-500 w-12 text-center">{{ formattedTime() }}</span>
        
        <div v-else-if="isRecorded" class="flex flex-col items-start gap-1">
          <span class="text-sm font-bold text-[var(--color-sg-success-green)] uppercase tracking-wider flex items-center gap-1">✓ Saved</span>
          <button @click.stop="clearAudio" class="text-[10px] uppercase text-gray-400 hover:text-red-500 font-bold underline">Re-record</button>
        </div>
        
        <div v-else-if="isSkipped" class="flex flex-col items-start gap-1">
          <span class="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">⚠ Skipped</span>
          <button @click.stop="clearAudio" class="text-[10px] uppercase text-gray-400 hover:text-[var(--color-sg-purple-main)] font-bold underline">Undo Skip</button>
        </div>
      </div>
    </div>
    
    <button v-if="!isSkipped" @click="skipPrompt" class="text-xs font-bold text-gray-400 hover:text-gray-600 underline uppercase pr-2">Can't Answer</button>
  </div>
</template>
