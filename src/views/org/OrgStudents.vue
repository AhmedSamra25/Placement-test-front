<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../store'

const store = useAppStore()
const router = useRouter()
const students = computed(() => store.orgStudents)

const showInviteModal = ref(false)
const newStudent = ref({ name: '', email: '', targetLanguage: 'English' })
const languages = ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Arabic']

const handleInvite = () => {
  if (newStudent.value.name && newStudent.value.email) {
    store.sendInvitation(newStudent.value)
    showInviteModal.value = false
    newStudent.value = { name: '', email: '', targetLanguage: 'English' }
  }
}

const resendFeedback = ref('')
const resendInvite = async (student) => {
  try {
    await store.resendInvitation(student.id)
    resendFeedback.value = student.email
    setTimeout(() => { resendFeedback.value = '' }, 3000)
  } catch (e) {
    console.error('Failed to resend invite', e)
  }
}
const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return { bg: 'bg-[var(--color-sg-success-green)]', text: 'text-[var(--color-sg-success-green)]' }
    case 'in_progress': return { bg: 'bg-[var(--color-sg-warning-yellow)]', text: 'text-[var(--color-sg-warning-yellow)]' }
    case 'accepted': return { bg: 'bg-cyan-500', text: 'text-cyan-600' }
    case 'pending':
    default: return { bg: 'bg-gray-400', text: 'text-gray-500' }
  }
}
</script>

<template>
  <div>
    <!-- Resend Invite Toast -->
    <transition name="slide-toast">
      <div v-if="resendFeedback" class="fixed top-6 right-6 z-50 bg-[var(--color-sg-success-green)] text-white px-5 py-3 rounded-xl shadow-xl font-semibold text-sm flex items-center gap-2">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        Invite re-sent to {{ resendFeedback }}
      </div>
    </transition>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-[var(--color-sg-text-heading)] mb-2">Student Management</h1>
        <p class="text-gray-600">Invite students to take the placement test and track their results.</p>
      </div>
      <div class="flex gap-4">
        <button @click="router.push('/org')" class="btn-secondary">
          Back to Dash
        </button>
        <button @click="showInviteModal = true" class="btn-primary">
          Invite Student
        </button>
      </div>
    </div>

    <!-- Students Table -->
    <div class="card overflow-hidden !p-0">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Date</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="student in students" :key="student.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap font-medium text-[var(--color-sg-text-heading)]">{{ student.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ student.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[var(--color-sg-purple-main)]">{{ student.targetLanguage || 'English' }}</td>
            <td class="px-6 py-4 whitespace-nowrap flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" :class="getStatusColor(student.status).bg"></span>
              <span class="text-sm uppercase tracking-wide font-bold" :class="getStatusColor(student.status).text">
                {{ student.status.replace('_', ' ') }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ student.testDate || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap font-mono text-[var(--color-sg-purple-main)] font-bold">{{ student.score || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                v-if="student.status === 'completed'" 
                @click="router.push(`/org/results/${student.id}`)"
                class="text-[var(--color-sg-purple-main)] hover:text-[var(--color-sg-purple-dark)] font-bold transition-colors">
                View Results
              </button>
              <button 
                v-else
                @click="resendInvite(student)"
                class="text-[var(--color-sg-purple-main)] font-bold hover:text-[var(--color-sg-purple-dark)] transition-colors">
                Resend Invite
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Invite Modal -->
    <div v-if="showInviteModal" class="fixed inset-0 bg-black/50 flex flex-col items-center justify-center p-4 z-50">
      <div class="card w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Invite New Student</h2>
        <div class="flex flex-col gap-4 mb-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Target Language</label>
            <select v-model="newStudent.targetLanguage" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-sg-purple-main)]">
              <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <input v-model="newStudent.name" type="text" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-sg-purple-main)]" placeholder="Jane Doe" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input v-model="newStudent.email" type="email" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-sg-purple-main)]" placeholder="jane@example.com" />
          </div>
        </div>
        <div class="flex justify-end gap-3 flex-col sm:flex-row">
          <button @click="showInviteModal = false" class="btn-secondary w-full sm:w-auto">Cancel</button>
          <button @click="handleInvite" class="btn-primary w-full sm:w-auto">Send Invite</button>
        </div>
      </div>
    </div>
  </div>
</template>
