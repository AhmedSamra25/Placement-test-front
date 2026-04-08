<script setup>
import { computed, watch } from 'vue'
import { useAppStore } from '../../store'
import { useSpeechToText } from '../../composables/useSpeechToText'

const props = defineProps({
  promptId: String,
  isActive: Boolean,
  globalActivePrompt: String
})

const emit = defineEmits(['startRecording', 'stopRecording', 'skipPrompt'])
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

const answerState = computed(() => store.testState.answers.speaking[props.promptId])
const isRecorded = computed(() => answerState.value && answerState.value !== 'unrecorded' && answerState.value !== 'skipped')
const isSkipped = computed(() => answerState.value === 'skipped')

const currentText = computed(() => finalTranscript.value + interimTranscript.value)

watch(currentText, (newText) => {
  if (isRecording.value && newText) {
    store.testState.answers.speaking[props.promptId] = newText.trim()
  }
})

const toggleAction = () => {
  if (isRecording.value) {
    stopRecording()
    emit('stopRecording', props.promptId)
  } else {
    emit('startRecording', props.promptId)
    startRecording()
  }
}

watch(() => props.isActive, (newActive) => {
  if (!newActive && isRecording.value) stopRecording()
})

const clearAudio = () => {
  discardRecording()
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
  <div class="flex flex-col gap-4 pt-4 border-t border-gray-50 bg-gray-50/50 p-4 rounded-lg mt-4">
    
    <div v-if="!isSupported" class="text-sm text-[var(--color-sg-alert-red)] bg-red-50 p-3 rounded">
      ⚠️ Speech Recognition is not supported in this browser. Please use google chrome.
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <button 
          @click.stop="toggleAction"
          :disabled="(!isActive && globalActivePrompt) || isSkipped || (!isSupported && !isRecorded)"
          class="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white border-2 relative shrink-0"
          :class="[
            isRecording ? 'border-red-100 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : (isRecorded ? 'border-[var(--color-sg-purple-main)]' : 'border-gray-200 hover:border-red-100'),
            ((!isActive && globalActivePrompt && !isRecorded) || isSkipped || (!isSupported && !isRecorded)) ? 'opacity-50 cursor-not-allowed' : ''
          ]"
        >
          <div v-if="isRecording" class="w-4 h-4 rounded-full transition-all bg-red-500 scale-75 rounded-sm"></div>
          <svg v-else-if="!isRecorded" class="w-4 h-4 rounded-full transition-all bg-red-500" viewBox="0 0 16 16"></svg>
          <svg v-if="isRecorded && !isRecording" class="w-6 h-6 text-[var(--color-sg-purple-main)] ml-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
          <span v-if="isRecording" class="absolute -top-1 -right-1 flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </button>

        <!-- Status -->
        <div class="flex items-center gap-3">
          <div v-if="isRecording" class="flex items-center gap-2 text-red-500 text-sm font-bold animate-pulse">
            Listening...
          </div>
          
          <div v-else-if="isRecorded" class="flex flex-col items-start gap-1">
            <span class="text-sm font-bold text-[var(--color-sg-success-green)] uppercase tracking-wider flex items-center gap-1">✓ Saved</span>
            <button @click.stop="clearAudio" class="text-[10px] uppercase text-gray-400 hover:text-red-500 font-bold underline">Clear & Try Again</button>
          </div>
          
          <div v-else-if="isSkipped" class="flex flex-col items-start gap-1">
            <span class="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">⚠ Skipped</span>
            <button @click.stop="clearAudio" class="text-[10px] uppercase text-gray-400 hover:text-[var(--color-sg-purple-main)] font-bold underline">Undo Skip</button>
          </div>
        </div>
      </div>
      
      <button v-if="!isSkipped" @click="skipPrompt" class="text-xs font-bold text-gray-400 hover:text-gray-600 underline uppercase pr-2">Can't Answer</button>
    </div>

    <!-- Disabled text box as requested for raw grammar evaluation -->
    <textarea 
      v-if="isRecorded || isRecording"
      :id="'stt-output-' + promptId" 
      readonly
      autocorrect="off" 
      autocomplete="off" 
      spellcheck="false" 
      data-gramm="false" 
      autocapitalize="off"
      rows="3"
      class="w-full p-3 border border-gray-200 rounded-lg bg-white/60 text-gray-800 text-sm focus:outline-none focus:border-[var(--color-sg-purple-main)] resize-y cursor-default shadow-inner"
      :value="isRecording ? currentText : (typeof answerState === 'string' && answerState !== 'unrecorded' && answerState !== 'skipped' ? answerState : '')"
      placeholder="Listening... speak clearly"
    ></textarea>
  </div>
</template>
