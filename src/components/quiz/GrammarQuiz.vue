<script setup>
import { useAppStore } from '../../store'
const store = useAppStore()

if (!store.testState.answers.grammar) {
  store.testState.answers.grammar = {
    p1_1: '',
    p1_2: '',
    p1_3: '',
    p2_1: '',
    p2_2: '',
    p2_3: '',
    p3_1: '',
    p3_2: '',
    p3_3: '',
    p3_4: '',
    p3_5: ''
  }
}
const answers = store.testState.answers.grammar
</script>

<template>
  <div class="space-y-8 text-left">
    
    <!-- Part 1: Sentence Correction -->
    <div class="card space-y-4">
      <h3 class="font-bold border-b pb-2 text-[var(--color-sg-purple-main)] uppercase tracking-wide text-sm">Part 1: Sentence Correction</h3>
      <p class="text-sm text-gray-600 mb-4 font-semibold">Each sentence below contains one or more grammatical errors. Rewrite each sentence correctly.</p>

      <div class="space-y-4">
        <div>
          <p class="text-sm text-gray-800 mb-2 font-mono bg-gray-50 p-2 rounded">1. When she walked into the room, she seen her best friend smiling.</p>
          <input type="text" v-model="answers.p1_1" class="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[var(--color-sg-purple-main)]" placeholder="Corrected sentence..." />
        </div>
        <div>
          <p class="text-sm text-gray-800 mb-2 font-mono bg-gray-50 p-2 rounded">2. The team, along with the coach, are celebrating their victory.</p>
          <input type="text" v-model="answers.p1_2" class="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[var(--color-sg-purple-main)]" placeholder="Corrected sentence..." />
        </div>
        <div>
          <p class="text-sm text-gray-800 mb-2 font-mono bg-gray-50 p-2 rounded">3. My grandmother loves to read, her favorite genre is historical fiction.</p>
          <input type="text" v-model="answers.p1_3" class="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[var(--color-sg-purple-main)]" placeholder="Corrected sentence..." />
        </div>
      </div>
    </div>

    <!-- Part 2: Punctuation and Usage -->
    <div class="card space-y-4">
      <h3 class="font-bold border-b pb-2 text-[var(--color-sg-purple-main)] uppercase tracking-wide text-sm">Part 2: Punctuation and Usage</h3>
      <p class="text-sm text-gray-600 mb-4 font-semibold">For each question, choose the sentence that is grammatically correct.</p>

      <div class="space-y-6">
        <div>
          <p class="font-bold mb-2">1. Choose the correct sentence:</p>
          <div class="space-y-2">
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="a" v-model="answers.p2_1" class="mt-1" /> <span class="text-sm">a) The cat lost it's collar in the yard.</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="b" v-model="answers.p2_1" class="mt-1" /> <span class="text-sm">b) The cat lost its collar in the yard.</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="c" v-model="answers.p2_1" class="mt-1" /> <span class="text-sm">c) The cats lost its collar in the yard.</span></label>
          </div>
        </div>
        <div>
          <p class="font-bold mb-2">2. Choose the correct sentence:</p>
          <div class="space-y-2">
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="a" v-model="answers.p2_2" class="mt-1" /> <span class="text-sm">a) The student studied hard, however, he still failed the test.</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="b" v-model="answers.p2_2" class="mt-1" /> <span class="text-sm">b) The student studied hard; however, he still failed the test.</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="c" v-model="answers.p2_2" class="mt-1" /> <span class="text-sm">c) The student studied hard however he still failed the test.</span></label>
          </div>
        </div>
        <div>
          <p class="font-bold mb-2">3. Choose the correct sentence:</p>
          <div class="space-y-2">
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="a" v-model="answers.p2_3" class="mt-1" /> <span class="text-sm">a) Who's book is this?</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="b" v-model="answers.p2_3" class="mt-1" /> <span class="text-sm">b) Whose book is this?</span></label>
            <label class="flex items-start gap-2 cursor-pointer"><input type="radio" value="c" v-model="answers.p2_3" class="mt-1" /> <span class="text-sm">c) Whose book are this?</span></label>
          </div>
        </div>
      </div>
    </div>

    <!-- Part 3: Verb Tense Completion -->
    <div class="card space-y-4">
      <h3 class="font-bold border-b pb-2 text-[var(--color-sg-purple-main)] uppercase tracking-wide text-sm">Part 3: Verb Tense Completion</h3>
      <p class="text-sm text-gray-600 mb-4 font-semibold">Read the paragraph below. Fill in the blanks with the correct form of the verb in parentheses.</p>
      
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 leading-loose text-lg font-serif">
        Last summer, my family and I (1. travel) <input type="text" v-model="answers.p3_1" class="border-b-2 border-[var(--color-sg-purple-main)] bg-transparent w-32 text-center focus:outline-none" /> 
        to the mountains. The weather (2. be) <input type="text" v-model="answers.p3_2" class="border-b-2 border-[var(--color-sg-purple-main)] bg-transparent w-24 text-center focus:outline-none" /> 
        beautiful, so we (3. decide) <input type="text" v-model="answers.p3_3" class="border-b-2 border-[var(--color-sg-purple-main)] bg-transparent w-32 text-center focus:outline-none" /> 
        to hike every day. Right now, I (4. plan) <input type="text" v-model="answers.p3_4" class="border-b-2 border-[var(--color-sg-purple-main)] bg-transparent w-32 text-center focus:outline-none" /> 
        our next trip to the beach. I hope it (5. be) <input type="text" v-model="answers.p3_5" class="border-b-2 border-[var(--color-sg-purple-main)] bg-transparent w-24 text-center focus:outline-none" /> 
        just as much fun as the last one.
      </div>
    </div>

  </div>
</template>
