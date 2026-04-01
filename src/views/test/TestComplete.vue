<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAnalyzing = ref(true)
const analysisStep = ref(0)
const analysisMessages = [
  "Submitting test data securely...",
  "Sending responses to Gemini LLM...",
  "Analyzing Speaking fluency and pronunciation...",
  "Evaluating Grammar and Vocabulary proficiency...",
  "Structuring CEFR Level mapping...",
  "Finalizing assessment report..."
]

onMounted(() => {
  // Simulate AI Analysis Steps
  const interval = setInterval(() => {
    if (analysisStep.value < analysisMessages.length - 1) {
      analysisStep.value++
    } else {
      clearInterval(interval)
      setTimeout(() => {
        isAnalyzing.value = false
      }, 1000)
    }
  }, 1200) // Change message every 1.2s, total ~7 seconds AI simulation
})

const returnHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="max-w-xl mx-auto text-center mt-12 mb-20">
    <div class="card space-y-8 p-10 border-t-8 border-t-[var(--color-sg-purple-main)] shadow-2xl relative overflow-hidden">
      
      <!-- Analyzing State -->
      <div v-if="isAnalyzing" class="flex flex-col items-center justify-center py-8 relative z-10">
        <!-- AI Loading Animation -->
        <div class="relative w-24 h-24 mb-6">
          <div class="absolute inset-0 border-4 border-[var(--color-sg-purple-light)] rounded-full animate-[spin_3s_linear_infinite]"></div>
          <div class="absolute inset-2 border-4 border-[var(--color-sg-purple-main)] rounded-full border-t-transparent animate-[spin_1.5s_linear_infinite_reverse]"></div>
          <div class="absolute inset-4 border-4 border-pink-400 rounded-full border-b-transparent animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center text-3xl">✨</div>
        </div>

        <h1 class="text-2xl font-extrabold text-gray-900 mb-2">AI Analysis in Progress</h1>
        <p class="text-lg text-[var(--color-sg-purple-main)] font-semibold mb-4 h-8 transition-all">{{ analysisMessages[analysisStep] }}</p>
        <p class="text-gray-500 text-sm">Please do not close this window while we process your results. This usually takes less than a minute.</p>
      </div>

      <!-- Complete State -->
      <div v-else class="flex flex-col items-center justify-center py-8 relative z-10">
        <div class="w-24 h-24 bg-[var(--color-sg-success-green)] rounded-full flex items-center justify-center mb-6 shadow-lg transform scale-100 animate-[bounce_0.5s_ease-out]">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 class="text-4xl font-extrabold text-[var(--color-sg-text-heading)] mb-4">You're All Set!</h1>
        
        <div class="bg-purple-50 p-6 rounded-lg border border-purple-100 mb-6 w-full">
          <h2 class="font-bold text-gray-900 mb-2 text-xl">What happens next?</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Our AI model has successfully ingested your assessment. Your final language proficiency results are currently being compiled into a comprehensive report.
          </p>
          <div class="flex items-center gap-3 bg-white p-4 rounded border border-gray-200 justify-center">
            <span class="text-2xl">📧</span>
            <span class="font-semibold text-[var(--color-sg-purple-main)] text-left">You will be notified via email once your results are ready for review.</span>
          </div>
        </div>
        
        <button @click="returnHome" class="btn-primary px-8 py-3 text-lg mt-4">
          Return to Homepage
        </button>
      </div>

      <!-- Decorative background elements -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-sg-purple-light)] rounded-full mix-blend-multiply filter blur-2xl opacity-50 z-0 pointer-events-none"></div>
      <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 z-0 pointer-events-none"></div>
    </div>
  </div>
</template>
