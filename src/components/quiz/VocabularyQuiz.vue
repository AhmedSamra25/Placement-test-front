<script setup>
import { useAppStore } from '../../store'
const store = useAppStore()

if (!store.testState.answers.vocabulary) {
  store.testState.answers.vocabulary = {
    p1_1: '',
    p1_2: '',
    p1_3: '',
    p1_4: '',
    p2_1: '',
    p2_2: '',
    p2_3: '',
    p2_4: '',
    p3_1: '',
    p3_2: '',
    p3_3: ''
  }
}
const answers = store.testState.answers.vocabulary
</script>

<template>
  <div class="space-y-8 text-left">
    
    <!-- Part 1: Definitions -->
    <div class="card space-y-4">
      <h3 class="font-bold border-b pb-2 text-[var(--color-sg-purple-main)] uppercase tracking-wide text-sm">Part 1: Definitions (Multiple Choice)</h3>
      <p class="text-sm text-gray-600 mb-4 font-semibold">Choose the best definition for each of the following words.</p>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="bg-gray-50 p-4 rounded border">
          <p class="font-bold mb-2">1. Ambiguous</p>
          <div class="space-y-2">
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="a" v-model="answers.p1_1" class="mt-1" /> <span class="text-sm">a) Clear and easy to understand</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="b" v-model="answers.p1_1" class="mt-1" /> <span class="text-sm">b) Open to more than one interpretation; having a double meaning</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="c" v-model="answers.p1_1" class="mt-1" /> <span class="text-sm">c) Difficult or impossible to achieve</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="d" v-model="answers.p1_1" class="mt-1" /> <span class="text-sm">d) Friendly and good-natured</span></label>
          </div>
        </div>
        <div class="bg-gray-50 p-4 rounded border">
          <p class="font-bold mb-2">2. Benevolent</p>
          <div class="space-y-2">
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="a" v-model="answers.p1_2" class="mt-1" /> <span class="text-sm">a) Well-meaning and kindly</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="b" v-model="answers.p1_2" class="mt-1" /> <span class="text-sm">b) Harmful or evil in nature</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="c" v-model="answers.p1_2" class="mt-1" /> <span class="text-sm">c) Lacking in depth or seriousness</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="d" v-model="answers.p1_2" class="mt-1" /> <span class="text-sm">d) Strong and unyielding</span></label>
          </div>
        </div>
        <div class="bg-gray-50 p-4 rounded border">
          <p class="font-bold mb-2">3. Superficial</p>
          <div class="space-y-2">
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="a" v-model="answers.p1_3" class="mt-1" /> <span class="text-sm">a) Existing or occurring at or on the surface; not thorough or deep</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="b" v-model="answers.p1_3" class="mt-1" /> <span class="text-sm">b) Extremely important or essential</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="c" v-model="answers.p1_3" class="mt-1" /> <span class="text-sm">c) Happening by accident or chance</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="d" v-model="answers.p1_3" class="mt-1" /> <span class="text-sm">d) Lasting for a very short time</span></label>
          </div>
        </div>
        <div class="bg-gray-50 p-4 rounded border">
          <p class="font-bold mb-2">4. Concede</p>
          <div class="space-y-2">
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="a" v-model="answers.p1_4" class="mt-1" /> <span class="text-sm">a) To argue against a point forcefully</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="b" v-model="answers.p1_4" class="mt-1" /> <span class="text-sm">b) To invent or create a new idea</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="c" v-model="answers.p1_4" class="mt-1" /> <span class="text-sm">c) To admit that something is true or valid after first denying it</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="d" v-model="answers.p1_4" class="mt-1" /> <span class="text-sm">d) To ignore or overlook something important</span></label>
          </div>
        </div>
      </div>
    </div>

    <!-- Part 2: Word Association -->
    <div class="card space-y-4">
      <h3 class="font-bold border-b pb-2 text-[var(--color-sg-purple-main)] uppercase tracking-wide text-sm">Part 2: Word Association</h3>
      <p class="text-sm text-gray-600 mb-2 font-semibold">Read each scenario and choose the word from the word bank that best fits the situation.</p>
      
      <div class="bg-purple-50 p-3 rounded font-mono text-sm text-[var(--color-sg-purple-dark)] text-center font-bold tracking-wide border border-purple-100 mb-4 inline-block w-full">
        Word Bank: Elucidate | Inevitable | Ambiguous | Benevolent
      </div>

      <div class="space-y-4">
        <div>
          <p class="text-sm text-gray-800 mb-1">1. A teacher needs to clarify a difficult concept for her students so they can understand it better. Which word describes what she needs to do?</p>
          <input type="text" v-model="answers.p2_1" class="w-full border-b border-gray-400 p-2 focus:outline-none focus:border-[var(--color-sg-purple-main)] bg-transparent" placeholder="Type word here..." />
        </div>
        <div>
          <p class="text-sm text-gray-800 mb-1">2. After seeing the dark storm clouds gathering, it was clear that the picnic would be rained out. Which word describes the rain?</p>
          <input type="text" v-model="answers.p2_2" class="w-full border-b border-gray-400 p-2 focus:outline-none focus:border-[var(--color-sg-purple-main)] bg-transparent" placeholder="Type word here..." />
        </div>
        <div>
          <p class="text-sm text-gray-800 mb-1">3. A wealthy philanthropist donates millions of dollars to build a new hospital for the community. Which word describes her actions?</p>
          <input type="text" v-model="answers.p2_3" class="w-full border-b border-gray-400 p-2 focus:outline-none focus:border-[var(--color-sg-purple-main)] bg-transparent" placeholder="Type word here..." />
        </div>
        <div>
          <p class="text-sm text-gray-800 mb-1">4. The politician's speech was so unclear that his supporters and opponents both thought he agreed with them. Which word describes his speech?</p>
          <input type="text" v-model="answers.p2_4" class="w-full border-b border-gray-400 p-2 focus:outline-none focus:border-[var(--color-sg-purple-main)] bg-transparent" placeholder="Type word here..." />
        </div>
      </div>
    </div>

    <!-- Part 3: Sentence Application -->
    <div class="card space-y-4">
      <h3 class="font-bold border-b pb-2 text-[var(--color-sg-purple-main)] uppercase tracking-wide text-sm">Part 3: Sentence Application</h3>
      <p class="text-sm text-gray-600 mb-4 font-semibold">Read each sentence below. If the bolded word is used correctly, write "Correct." If it is used incorrectly, rewrite the sentence using the word properly.</p>

      <div class="space-y-4">
        <div>
          <p class="text-sm text-gray-800 mb-2">1. His understanding of the problem was very <strong>superficial</strong>; he knew all the complex details and history.</p>
          <textarea v-model="answers.p3_1" class="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[var(--color-sg-purple-main)]" rows="2" placeholder="Write 'Correct' or rewrite the sentence..."></textarea>
        </div>
        <div>
          <p class="text-sm text-gray-800 mb-2">2. After losing the debate, the candidate had to <strong>concede</strong> that his opponent had made some valid points.</p>
          <textarea v-model="answers.p3_2" class="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[var(--color-sg-purple-main)]" rows="2" placeholder="Write 'Correct' or rewrite the sentence..."></textarea>
        </div>
        <div>
          <p class="text-sm text-gray-800 mb-2">3. The outcome was <strong>inevitable</strong>, and no one was sure how it would end.</p>
          <textarea v-model="answers.p3_3" class="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[var(--color-sg-purple-main)]" rows="2" placeholder="Write 'Correct' or rewrite the sentence..."></textarea>
        </div>
      </div>
    </div>

  </div>
</template>
