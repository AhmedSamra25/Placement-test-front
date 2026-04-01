<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Hide the global header inside the org portal — it has its own sidebar
const showGlobalHeader = computed(() => !route.path.startsWith('/org'))
</script>

<template>
  <div class="min-h-screen bg-[var(--color-sg-bg-canvas)]">
    <!-- Top Navigation — only shown on the public test-taking flow -->
    <header v-if="showGlobalHeader" class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center gap-4">
            <!-- Brand Logo Space -->
            <div class="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center p-1">
               <img src="https://speakingenie.com/lovable-uploads/logo.png" alt="Speaking Genie" class="w-full h-auto object-contain">
            </div>
            <span class="font-bold text-[var(--color-sg-text-heading)] text-lg tracking-tight">Speaking Genie</span>
          </div>
          <nav class="flex gap-4">
            <router-link to="/test" class="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors" active-class="text-[var(--color-sg-purple-main)]">Take Test</router-link>
            <router-link to="/org/login" class="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">Org Portal →</router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main :class="showGlobalHeader ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''">
      <router-view></router-view>
    </main>
  </div>
</template>
