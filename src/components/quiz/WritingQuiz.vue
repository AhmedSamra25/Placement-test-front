<script setup>
import { useAppStore } from '../../store'
const store = useAppStore()

if (!store.testState.answers.writing) {
  store.testState.answers.writing = {
    fileUploaded: false,
    fileName: ''
  }
}
const answers = store.testState.answers.writing

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    answers.fileUploaded = true
    answers.fileName = file.name
  }
}
</script>

<template>
  <div class="space-y-6 text-left">
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 class="font-bold text-gray-900 mb-2 uppercase tracking-wide">Task</h3>
      <p class="text-gray-700 mb-4 font-semibold text-lg">
        Write a short essay in which you argue for or against the use of social media in schools.
      </p>
      
      <h4 class="font-bold mb-2">Instructions for Submission:</h4>
      <ul class="list-disc pl-5 space-y-2 text-gray-600 mb-6 border-b border-gray-200 pb-6">
        <li>Please write your essay by hand on a clean sheet of paper.</li>
        <li>Your essay must be a minimum of <strong class="text-[var(--color-sg-purple-main)]">150 words</strong>.</li>
        <li>Clearly state your position in the introduction.</li>
        <li>Provide at least two well-supported reasons.</li>
        <li>Once completed, take a clear photo of your handwritten essay and upload it below.</li>
      </ul>
      
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center bg-white hover:bg-gray-50 transition-colors cursor-pointer" onclick="document.getElementById('file-upload').click()">
        <input type="file" id="file-upload" class="hidden" accept="image/*" @change="handleFileUpload" />
        <div v-if="!answers.fileUploaded" class="flex flex-col items-center">
          <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          <span class="text-gray-600 font-semibold mb-1">Click to upload your handwritten essay</span>
          <span class="text-xs text-gray-400">Supported formats: JPG, PNG</span>
        </div>
        <div v-else class="flex flex-col items-center">
          <svg class="w-12 h-12 text-[var(--color-sg-success-green)] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span class="text-[var(--color-sg-success-green)] font-bold text-lg mb-1">File Uploaded Successfully!</span>
          <span class="text-sm font-mono text-gray-500">{{ answers.fileName }}</span>
          <button class="mt-4 text-xs font-bold text-[var(--color-sg-purple-main)] uppercase tracking-wider underline" @click.stop="answers.fileUploaded = false; answers.fileName = ''">Replace File</button>
        </div>
      </div>
    </div>
  </div>
</template>
