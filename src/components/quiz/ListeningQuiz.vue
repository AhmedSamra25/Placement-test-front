<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../../store'
const store = useAppStore()

if (!store.testState.answers.listening) {
  store.testState.answers.listening = {
    q1: '',
    q2: '',
    q3: '',
    q4: ''
  }
}
const answers = store.testState.answers.listening

// Audio Player State
const isPlaying = ref(false)
const progress = ref(0)
const playCount = ref(0)
const audio = ref(null)

onMounted(() => {
  // Initialize the audio object with the file from public/audio
  audio.value = new Audio('/audio/speaking-national-park.mp3')
  
  audio.value.addEventListener('timeupdate', () => {
    if (audio.value.duration) {
      progress.value = (audio.value.currentTime / audio.value.duration) * 100
    }
  })

  // When audio finishes, reset progress
  audio.value.addEventListener('ended', () => {
    isPlaying.value = false
    progress.value = 0
  })
})

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause()
    audio.value.removeAttribute('src')
    audio.value.load()
    audio.value = null
  }
})

const togglePlay = () => {
  if (!audio.value) return

  if (isPlaying.value) {
    audio.value.pause()
    isPlaying.value = false
  } else {
    // Only increment play count if starting from the beginning
    if (progress.value === 0 || audio.value.currentTime === 0) {
      if (playCount.value >= 2) {
        alert("You have already listened to this audio clip twice.")
        return
      }
      playCount.value++
    }
    
    // Attempt to play
    audio.value.play().then(() => {
      isPlaying.value = true
    }).catch(e => {
      console.warn("Audio playback failed. Please ensure your audio file exists in public/audio/speaking-national-park.mp3");
      alert("Please place 'speaking-national-park.mp3' in the 'public/audio/' folder to play this audio.");
      isPlaying.value = false;
    })
  }
}
</script>

<template>
  <div class="space-y-8 text-left">
    <!-- Audio Player Mock -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col items-center">
      <div class="w-16 h-16 bg-[var(--color-sg-purple-main)] rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg mb-4" @click="togglePlay">
        <svg v-if="!isPlaying" class="w-8 h-8 text-white ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
        <svg v-else class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
      </div>
      
      <div class="w-full max-w-md h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
        <div class="h-full bg-[var(--color-sg-success-green)] transition-all ease-linear" :style="{ width: `${progress}%`, transitionDuration: isPlaying ? '500ms' : '0ms' }"></div>
      </div>
      
      <p class="text-sm font-bold text-gray-500 uppercase tracking-wider">Audio Clip: Trip to a National Park</p>
      <p class="text-xs text-red-500 mt-1 font-semibold" v-if="playCount > 0">Listened {{ playCount }} / 2 times</p>
    </div>

    <!-- Questions -->
    <div class="space-y-6">
      <h3 class="text-lg font-bold border-b pb-2">Questions</h3>
      <p class="text-sm text-gray-500 italic mb-4">You will hear the audio twice. Answer the questions after each time.</p>

      <div class="space-y-4">
        <div>
          <label class="block font-medium text-gray-700 mb-2">1. What is the speaker's overall purpose in this recording?</label>
          <textarea v-model="answers.q1" class="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[var(--color-sg-purple-main)]" rows="2" placeholder="Your answer..."></textarea>
        </div>
        <div>
          <label class="block font-medium text-gray-700 mb-2">2. What was the weather like on the first day of the trip?</label>
          <input type="text" v-model="answers.q2" class="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[var(--color-sg-purple-main)]" placeholder="Your answer..." />
        </div>
        <div>
          <label class="block font-medium text-gray-700 mb-2">3. What specific animal did the speaker mention seeing?</label>
          <input type="text" v-model="answers.q3" class="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[var(--color-sg-purple-main)]" placeholder="Your answer..." />
        </div>
        <div>
          <label class="block font-medium text-gray-700 mb-2">4. Based on the speaker's voice and word choice, what can you infer about their feelings towards nature?</label>
          <textarea v-model="answers.q4" class="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[var(--color-sg-purple-main)]" rows="2" placeholder="Your answer..."></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
