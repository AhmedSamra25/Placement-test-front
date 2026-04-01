<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../../store'

const store = useAppStore()

const showAddModal = ref(false)
const showEditModal = ref(false)
const editingMod = ref(null)

const newMod = ref({ name: '', email: '', phone: '' })

const openEdit = (mod) => {
  editingMod.value = { ...mod }
  showEditModal.value = true
}

const handleAdd = () => {
  if (newMod.value.name && newMod.value.email) {
    store.addModerator({ ...newMod.value })
    showAddModal.value = false
    newMod.value = { name: '', email: '', phone: '' }
  }
}

const handleUpdate = () => {
  if (editingMod.value) {
    store.updateModerator(editingMod.value.id, {
      name: editingMod.value.name,
      email: editingMod.value.email,
      phone: editingMod.value.phone
    })
    showEditModal.value = false
    editingMod.value = null
  }
}

const handleRemove = (id) => {
  if (confirm('Are you sure you want to remove this moderator?')) {
    store.removeModerator(id)
  }
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-[var(--color-sg-text-heading)] mb-2">Team Settings</h1>
      <p class="text-gray-600">Manage your organization's administrators and moderators. Admins can view all data; Moderators can review submissions.</p>
    </div>

    <!-- Team Table -->
    <div class="card border border-gray-100 !p-0 overflow-hidden mb-8">
      <div class="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div>
          <h2 class="font-bold text-gray-900">Active Team Members</h2>
          <p class="text-xs text-gray-500 mt-0.5">{{ store.moderators.length + 1 }} member{{ store.moderators.length + 1 !== 1 ? 's' : '' }} total (1 admin + {{ store.moderators.length }} moderator{{ store.moderators.length !== 1 ? 's' : '' }})</p>
        </div>
        <button @click="showAddModal = true" class="btn-primary py-2 text-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Add Moderator
        </button>
      </div>
      
      <table class="w-full">
        <thead class="bg-white border-b border-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Member</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
            <th class="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <!-- Admin row (not editable) -->
          <tr class="hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-sg-purple-main)] to-[var(--color-sg-purple-dark)] text-white flex items-center justify-center font-bold text-sm shadow-sm">SA</div>
                <div>
                  <p class="font-bold text-gray-900 text-sm">School Admin</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">admin@school.edu</td>
            <td class="px-6 py-4"><span class="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full uppercase tracking-wider">Admin</span></td>
            <td class="px-6 py-4"><span class="flex items-center gap-1.5 text-xs font-bold text-[var(--color-sg-success-green)]"><span class="w-1.5 h-1.5 rounded-full bg-[var(--color-sg-success-green)]"></span>Active</span></td>
            <td class="px-6 py-4 text-right">
              <span class="text-xs text-gray-300 font-bold">Owner</span>
            </td>
          </tr>

          <!-- Moderator rows -->
          <tr v-for="mod in store.moderators" :key="mod.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">{{ mod.name.charAt(0) }}</div>
                <div>
                  <p class="font-bold text-gray-900 text-sm">{{ mod.name }}</p>
                  <p v-if="mod.phone" class="text-xs text-gray-400">{{ mod.phone }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ mod.email }}</td>
            <td class="px-6 py-4"><span class="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wider">Moderator</span></td>
            <td class="px-6 py-4"><span class="flex items-center gap-1.5 text-xs font-bold" :class="mod.status === 'active' ? 'text-[var(--color-sg-success-green)]' : 'text-gray-400'"><span class="w-1.5 h-1.5 rounded-full" :class="mod.status === 'active' ? 'bg-[var(--color-sg-success-green)]' : 'bg-gray-300'"></span>{{ mod.status }}</span></td>
            <td class="px-6 py-4">
              <div class="flex justify-end gap-2">
                <button @click="openEdit(mod)" class="text-gray-400 hover:text-[var(--color-sg-purple-main)] transition-colors p-1.5 rounded hover:bg-purple-50" title="Edit">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button @click="handleRemove(mod.id)" class="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded hover:bg-red-50" title="Remove">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!store.moderators.length" class="px-6 py-8 text-center text-sm text-gray-400">
        No moderators yet. Add one to let them review student submissions.
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-100">
        <h2 class="text-xl font-extrabold text-gray-900 mb-6">Add New Moderator</h2>
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
            <input v-model="newMod.name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent outline-none" placeholder="Jane Doe" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Email Address *</label>
            <input v-model="newMod.email" type="email" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent outline-none" placeholder="jane@school.edu" />
            <p class="text-xs text-gray-400 mt-1">They'll sign in with email + password "mod"</p>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Phone (optional)</label>
            <input v-model="newMod.phone" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent outline-none" placeholder="+1 (555) 000-0000" />
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="showAddModal = false" class="btn-secondary flex-1">Cancel</button>
          <button @click="handleAdd" :disabled="!newMod.name || !newMod.email" class="btn-primary flex-1" :class="!newMod.name || !newMod.email ? 'opacity-50 cursor-not-allowed' : ''">Add Moderator</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal && editingMod" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-100">
        <h2 class="text-xl font-extrabold text-gray-900 mb-6">Edit Moderator</h2>
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <input v-model="editingMod.name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent outline-none" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input v-model="editingMod.email" type="email" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent outline-none" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Phone</label>
            <input v-model="editingMod.phone" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent outline-none" />
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="showEditModal = false" class="btn-secondary flex-1">Cancel</button>
          <button @click="handleUpdate" class="btn-primary flex-1">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>
