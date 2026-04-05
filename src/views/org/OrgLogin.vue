<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../store'

const store = useAppStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  const success = await store.login(email.value, password.value)
  if (success) {
    router.push('/org')
  } else {
    error.value = 'Invalid credentials. Please contact your organization administrator.'
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="w-16 h-16 bg-white shadow-md border border-gray-100 rounded-2xl flex items-center justify-center p-2 mx-auto mb-4 transform -rotate-3">
        <img src="https://speakingenie.com/lovable-uploads/logo.png" alt="Speaking Genie" class="w-full h-auto object-contain transform rotate-3">
      </div>
      <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
        Organization Portal
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Sign in to manage your placement tests and students.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl shadow-purple-900/5 sm:rounded-xl sm:px-10 border border-gray-100">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <div class="mt-1">
              <input v-model="email" id="email" name="email" type="email" autocomplete="email" required class="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent sm:text-sm">
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1">
              <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent sm:text-sm">
            </div>
          </div>

          <div v-if="error" class="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ error }}
          </div>

          <div>
            <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-[var(--color-sg-purple-main)] hover:bg-[var(--color-sg-purple-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-sg-purple-main)] transition-all">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
