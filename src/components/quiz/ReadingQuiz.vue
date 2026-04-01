<script setup>
import { useAppStore } from '../../store'
const store = useAppStore()

// Initialize answers if not present
if (!store.testState.answers.reading) {
  store.testState.answers.reading = {
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: ''
  }
}
const answers = store.testState.answers.reading
</script>

<template>
  <div class="space-y-8 text-left">
    <!-- Passage -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 class="text-xl font-bold mb-4 text-[var(--color-sg-purple-main)]">Passage: The Silent Watcher of the Forest</h3>
      <p class="text-gray-700 leading-relaxed indent-4">
        The old oak tree stood sentinel over the clearing. Its gnarled branches, thick with moss and wisdom, stretched out like the arms of a silent giant. For centuries, it had watched the forest floor change with the seasons. It had seen young saplings grow into mighty trees and witnessed the quiet dance of deer at dusk. The tree was a living library, its bark a record of countless storms, a timeline etched in wood. No words were needed for it to tell its story; its presence alone spoke volumes to those who knew how to listen.
      </p>
    </div>

    <!-- Questions -->
    <div class="space-y-6">
      <h3 class="text-lg font-bold border-b pb-2">Assessment Questions</h3>
      
      <div class="space-y-4">
        <h4 class="font-semibold text-gray-800 uppercase tracking-wider text-sm text-[var(--color-sg-purple-main)]">Literal Comprehension</h4>
        <div>
          <label class="block font-medium text-gray-700 mb-2">1. What is the main subject of the passage?</label>
          <textarea v-model="answers.q1" class="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[var(--color-sg-purple-main)]" rows="2" placeholder="Your answer..."></textarea>
        </div>
        <div>
          <label class="block font-medium text-gray-700 mb-2">2. What are two things the oak tree has witnessed over the years?</label>
          <textarea v-model="answers.q2" class="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[var(--color-sg-purple-main)]" rows="2" placeholder="Your answer..."></textarea>
        </div>
      </div>

      <div class="space-y-4 pt-4 border-t border-gray-100">
        <h4 class="font-semibold text-gray-800 uppercase tracking-wider text-sm text-[var(--color-sg-purple-main)]">Inference and Interpretation</h4>
        <div>
          <label class="block font-medium text-gray-700 mb-2">3. The passage describes the oak tree as a "living library." What does this metaphor suggest about the tree?</label>
          <textarea v-model="answers.q3" class="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[var(--color-sg-purple-main)]" rows="3" placeholder="Your answer..."></textarea>
        </div>
        <div>
          <label class="block font-medium text-gray-700 mb-2">4. Based on the text, what does it mean to "listen" to the tree's story?</label>
          <textarea v-model="answers.q4" class="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[var(--color-sg-purple-main)]" rows="3" placeholder="Your answer..."></textarea>
        </div>
      </div>

      <div class="space-y-4 pt-4 border-t border-gray-100">
        <h4 class="font-semibold text-gray-800 uppercase tracking-wider text-sm text-[var(--color-sg-purple-main)]">Critical Analysis</h4>
        <div>
          <label class="block font-medium text-gray-700 mb-2">5. What is the author's tone toward the oak tree? Use at least one word from the passage to support your answer.</label>
          <textarea v-model="answers.q5" class="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[var(--color-sg-purple-main)]" rows="3" placeholder="Your answer..."></textarea>
        </div>
        <div>
          <label class="block font-medium text-gray-700 mb-2">6. The passage states, "No words were needed for it to tell its story." Explain what this phrase reveals about the relationship between the tree and its environment.</label>
          <textarea v-model="answers.q6" class="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[var(--color-sg-purple-main)]" rows="3" placeholder="Your answer..."></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
