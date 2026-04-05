<script setup>
import { computed, watch } from 'vue'
import { useAppStore } from '../../store'
import { useAudioRecorder } from '../../composables/useAudioRecorder'

const props = defineProps({
  itemId: String,
  isActive: Boolean,
  globalActiveItem: String // Added to know what is active
})

const emit = defineEmits(['startRecording', 'stopRecording'])
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

const isRecorded = computed(() => !!audioBlob.value || store.testState.answers.pronunciation[props.itemId] === 'recorded')

const toggleAction = () => {
  if (isRecorded.value) {
    playAudio()
  } else if (isRecording.value) {
    stopRecording()
  } else {
    emit('startRecording', props.itemId)
    startRecording()
  }
}

// Ensure it stops if another item takes over
watch(() => props.isActive, (newActive) => {
  if (!newActive && isRecording.value) stopRecording()
})

watch(audioBlob, (blob) => {
  if (blob) {
    store.audioBlobs[props.itemId] = blob
    store.testState.answers.pronunciation[props.itemId] = 'recorded'
    emit('stopRecording', props.itemId)
  }
})

const clearAudio = () => {
  discardRecording()
  delete store.audioBlobs[props.itemId]
  store.testState.answers.pronunciation[props.itemId] = 'unrecorded'
}
</script>

<template>
  <div class="flex items-center gap-4 border-l-2 border-gray-100 pl-4 shrink-0">
    <button 
      @click.stop="toggleAction"
      :disabled="(!isActive && globalActiveItem) && !isRecorded"
      class="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white border relative shrink-0"
      :class="[
        isRecording ? 'border-red-100 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : (isRecorded ? 'border-[var(--color-sg-purple-main)]' : 'border-gray-200 hover:border-red-100'),
        (!isActive && globalActiveItem && !isRecorded) ? 'opacity-50 cursor-not-allowed' : ''
      ]"
    >
      <svg v-if="isRecorded" class="w-5 h-5 text-[var(--color-sg-purple-main)] ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
      <div v-else class="w-3 h-3 rounded-full transition-all" :class="isRecording ? 'bg-red-500 scale-75 rounded-sm' : 'bg-red-500'"></div>
    </button>
    <div class="flex items-center gap-2 min-w-[80px]">
      <div v-if="isRecording" class="flex items-center gap-1 h-4">
        <div class="w-1 bg-red-400 rounded-full animate-pulse h-full" style="animation-delay: 0s;"></div>
        <div class="w-1 bg-red-500 rounded-full animate-pulse h-2" style="animation-delay: 0.2s;"></div>
        <div class="w-1 bg-red-400 rounded-full animate-pulse h-3" style="animation-delay: 0.4s;"></div>
      </div>
      <span v-if="isRecording" class="font-mono font-bold text-red-500 text-xs">{{ formattedTime() }}</span>
      <div v-else-if="isRecorded" class="flex flex-col items-start gap-1">
        <span class="text-xs font-bold text-[var(--color-sg-success-green)] uppercase tracking-wider flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Saved
        </span>
        <button @click.stop="clearAudio" class="text-[10px] uppercase text-gray-400 hover:text-red-500 font-bold underline">Re-record</button>
      </div>
    </div>
  </div>
</template>
