<script setup>
import { computed, watch } from 'vue'
import { useAppStore } from '../../store'
import { useSpeechToText } from '../../composables/useSpeechToText'

const props = defineProps({
  itemId: String,
  isActive: Boolean,
  globalActiveItem: String
})

const emit = defineEmits(['startRecording', 'stopRecording'])
const store = useAppStore()

const {
  isSupported,
  isRecording,
  finalTranscript,
  interimTranscript,
  startRecording,
  stopRecording,
  discardRecording
} = useSpeechToText()

const answerState = computed(() => store.testState.answers.pronunciation[props.itemId])
const isRecorded = computed(() => answerState.value && answerState.value !== 'unrecorded')

const currentText = computed(() => finalTranscript.value + interimTranscript.value)

watch(currentText, (newText) => {
  if (isRecording.value && newText) {
    store.testState.answers.pronunciation[props.itemId] = newText.trim()
  }
})

const toggleAction = () => {
  if (isRecording.value) {
    stopRecording()
    emit('stopRecording', props.itemId)
  } else {
    emit('startRecording', props.itemId)
    startRecording()
  }
}

watch(() => props.isActive, (newActive) => {
  if (!newActive && isRecording.value) stopRecording()
})

const clearAudio = () => {
  discardRecording()
  store.testState.answers.pronunciation[props.itemId] = 'unrecorded'
}
</script>

<template>
  <div class="flex flex-col gap-2 border-l-2 border-gray-100 pl-4 shrink-0 mt-2">
    <div class="flex items-center gap-4">
      <button 
        @click.stop="toggleAction"
        :disabled="(!isActive && globalActiveItem && !isRecorded) || (!isSupported && !isRecorded)"
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white border relative shrink-0"
        :class="[
          isRecording ? 'border-red-100 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : (isRecorded ? 'border-[var(--color-sg-purple-main)]' : 'border-gray-200 hover:border-red-100'),
          (!isActive && globalActiveItem && !isRecorded) || (!isSupported && !isRecorded) ? 'opacity-50 cursor-not-allowed' : ''
        ]"
      >
        <svg v-if="isRecorded && !isRecording" class="w-5 h-5 text-[var(--color-sg-purple-main)] ml-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
        <div v-else class="w-3 h-3 rounded-full transition-all" :class="isRecording ? 'bg-red-500 scale-75 rounded-sm' : 'bg-red-500'"></div>
      </button>

      <div class="flex items-center gap-2 min-w-[80px]">
        <div v-if="isRecording" class="font-bold text-red-500 text-xs animate-pulse">
          Listening...
        </div>
        <div v-else-if="isRecorded" class="flex flex-col items-start gap-1">
          <span class="text-xs font-bold text-[var(--color-sg-success-green)] uppercase tracking-wider flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Saved
          </span>
          <button @click.stop="clearAudio" class="text-[10px] uppercase text-gray-400 hover:text-red-500 font-bold underline">Clear & Try Again</button>
        </div>
        <div v-else-if="!isSupported" class="text-[10px] text-red-500">Not Supported</div>
      </div>
    </div>
    
    <textarea 
      v-if="isRecorded || isRecording"
      :id="'stt-output-' + itemId" 
      readonly
      autocorrect="off" 
      autocomplete="off" 
      spellcheck="false" 
      data-gramm="false" 
      autocapitalize="off"
      rows="2"
      class="w-full mt-1 p-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm focus:outline-none resize-none cursor-default"
      :value="isRecording ? currentText : (typeof answerState === 'string' && answerState !== 'unrecorded' ? answerState : '')"
      placeholder="..."
    ></textarea>
  </div>
</template>
