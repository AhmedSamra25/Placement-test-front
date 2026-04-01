<script setup>
import { computed } from 'vue'

const props = defineProps({
  itemId: String,
  isActive: Boolean,
  isRecorded: Boolean,
  timeString: String
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <div class="flex items-center gap-4 border-l-2 border-gray-100 pl-4 shrink-0">
    <button 
      @click="$emit('toggle', itemId)"
      :disabled="!isActive && timeString !== '00:00' && $parent.activeRecordingItem"
      class="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white border relative shrink-0"
      :class="[
        isActive ? 'border-red-100 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'border-gray-200 hover:border-red-100',
        (!isActive && timeString !== '00:00' && $parent.activeRecordingItem) ? 'opacity-50 cursor-not-allowed' : ''
      ]"
    >
      <div class="w-3 h-3 rounded-full transition-all" :class="isActive ? 'bg-red-500 scale-75 rounded-sm' : 'bg-red-500'"></div>
    </button>
    <div class="flex items-center gap-2 min-w-[80px]">
      <div v-if="isActive" class="flex items-center gap-1 h-4">
        <div class="w-1 bg-red-400 rounded-full animate-pulse h-full" style="animation-delay: 0s;"></div>
        <div class="w-1 bg-red-500 rounded-full animate-pulse h-2" style="animation-delay: 0.2s;"></div>
        <div class="w-1 bg-red-400 rounded-full animate-pulse h-3" style="animation-delay: 0.4s;"></div>
      </div>
      <span v-if="isActive" class="font-mono font-bold text-red-500 text-xs">{{ timeString }}</span>
      <span v-else-if="isRecorded" class="text-xs font-bold text-[var(--color-sg-success-green)] uppercase tracking-wider flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> OK
      </span>
    </div>
  </div>
</template>
