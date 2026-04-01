<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../../store'

const store = useAppStore()

const CEFR_OPTIONS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const COLOR_OPTIONS = [
  { name: 'blue', class: 'bg-blue-500' },
  { name: 'cyan', class: 'bg-cyan-500' },
  { name: 'green', class: 'bg-green-500' },
  { name: 'yellow', class: 'bg-yellow-500' },
  { name: 'orange', class: 'bg-orange-500' },
  { name: 'purple', class: 'bg-purple-600' },
]

const colorClass = (color) => {
  const found = COLOR_OPTIONS.find(c => c.name === color)
  return found ? found.class : 'bg-gray-400'
}

const showAddModal = ref(false)
const showEditModal = ref(false)
const editingLevel = ref(null)
const expandedLevel = ref(null)

const newLevel = ref({ name: '', cefrMap: 'A1', scoreMin: 1.0, scoreMax: 1.9, goals: '', color: 'blue' })

const handleAdd = () => {
  if (newLevel.value.name && newLevel.value.cefrMap) {
    store.addCefrLevel({ ...newLevel.value })
    showAddModal.value = false
    newLevel.value = { name: '', cefrMap: 'A1', scoreMin: 1.0, scoreMax: 1.9, goals: '', color: 'blue' }
  }
}

const openEdit = (level) => {
  editingLevel.value = { ...level }
  showEditModal.value = true
}

const handleUpdate = () => {
  if (editingLevel.value) {
    store.updateCefrLevel(editingLevel.value.id, {
      name: editingLevel.value.name,
      cefrMap: editingLevel.value.cefrMap,
      scoreMin: parseFloat(editingLevel.value.scoreMin),
      scoreMax: parseFloat(editingLevel.value.scoreMax),
      goals: editingLevel.value.goals,
      color: editingLevel.value.color
    })
    showEditModal.value = false
    editingLevel.value = null
  }
}

const handleRemove = (id) => {
  if (confirm('Remove this level? This cannot be undone.')) {
    store.removeCefrLevel(id)
  }
}

const toggleExpand = (id) => {
  expandedLevel.value = expandedLevel.value === id ? null : id
}
</script>

<template>
  <div>
    <div class="mb-8 flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-extrabold text-[var(--color-sg-text-heading)] mb-2">Goals & CEFR Mapping</h1>
        <p class="text-gray-600">Create and manage your organization's proficiency levels, map them to CEFR, and define learning outcomes.</p>
      </div>
      <button @click="showAddModal = true" class="btn-primary py-2 text-sm flex items-center gap-2 shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        New Level
      </button>
    </div>

    <!-- CEFR Info Banner -->
    <div class="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-8 flex items-start gap-3">
      <svg class="w-5 h-5 text-[var(--color-sg-purple-main)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <p class="text-sm text-purple-800">These levels define how your organization interprets student test scores. Each level is mapped to the international CEFR standard (A1 to C2), giving you a custom framework while maintaining global compatibility.</p>
    </div>

    <!-- Levels List -->
    <div class="space-y-4">
      <div v-for="level in store.cefrLevels" :key="level.id" class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all">
        <div class="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50/50 transition-colors" @click="toggleExpand(level.id)">
          <!-- Color Dot & Name -->
          <div class="w-3 h-3 rounded-full shrink-0" :class="colorClass(level.color)"></div>
          <div class="flex-1">
            <div class="flex items-center gap-3 flex-wrap">
              <h3 class="font-bold text-gray-900">{{ level.name }}</h3>
              <span class="px-2 py-0.5 text-xs font-bold rounded-full bg-purple-100 text-purple-900">{{ level.cefrMap }}</span>
              <span class="text-xs text-gray-400 font-mono">Score: {{ level.scoreMin }} – {{ level.scoreMax }}</span>
            </div>
            <p class="text-sm text-gray-500 mt-0.5 truncate max-w-xl">{{ level.goals || 'No goals defined yet.' }}</p>
          </div>
          <!-- Actions -->
          <div class="flex items-center gap-2 shrink-0">
            <button @click.stop="openEdit(level)" class="text-gray-400 hover:text-[var(--color-sg-purple-main)] transition-colors p-2 rounded hover:bg-purple-50" title="Edit Level">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </button>
            <button @click.stop="handleRemove(level.id)" class="text-gray-400 hover:text-red-500 transition-colors p-2 rounded hover:bg-red-50" title="Delete Level">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
            <svg class="w-4 h-4 text-gray-300 transition-transform" :class="expandedLevel === level.id ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
        
        <!-- Expanded Goals -->
        <div v-if="expandedLevel === level.id" class="px-6 pb-5 pt-0 border-t border-gray-50 bg-gray-50/30">
          <h4 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 mt-4">Learning Goals & Outcomes</h4>
          <p class="text-sm text-gray-700 leading-relaxed">{{ level.goals || 'No detailed goals defined yet. Click Edit to add them.' }}</p>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 border border-gray-100">
        <h2 class="text-xl font-extrabold text-gray-900 mb-2">Create New Level</h2>
        <p class="text-sm text-gray-500 mb-6">Define a proficiency level for your organization and map it to the global CEFR standard.</p>
        <div class="space-y-4 mb-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Level Name *</label>
              <input v-model="newLevel.name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent outline-none" placeholder="e.g. Pre-Intermediate" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">CEFR Mapping *</label>
              <select v-model="newLevel.cefrMap" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent outline-none">
                <option v-for="c in CEFR_OPTIONS" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Score Min</label>
              <input v-model.number="newLevel.scoreMin" type="number" step="0.1" min="0" max="6" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent outline-none" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Score Max</label>
              <input v-model.number="newLevel.scoreMax" type="number" step="0.1" min="0" max="6" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent outline-none" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Color</label>
              <div class="flex gap-1.5 flex-wrap pt-1">
                <button v-for="c in COLOR_OPTIONS" :key="c.name" @click="newLevel.color = c.name" class="w-6 h-6 rounded-full transition-all border-2" :class="[c.class, newLevel.color === c.name ? 'border-gray-700 scale-125' : 'border-transparent']"></button>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Goals & Outcomes</label>
            <textarea v-model="newLevel.goals" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent outline-none" placeholder="Describe what students at this level can do..."></textarea>
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="showAddModal = false" class="btn-secondary flex-1">Cancel</button>
          <button @click="handleAdd" :disabled="!newLevel.name" class="btn-primary flex-1" :class="!newLevel.name ? 'opacity-50 cursor-not-allowed' : ''">Create Level</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal && editingLevel" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 border border-gray-100">
        <h2 class="text-xl font-extrabold text-gray-900 mb-6">Edit Level: {{ editingLevel.name }}</h2>
        <div class="space-y-4 mb-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Level Name</label>
              <input v-model="editingLevel.name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent outline-none" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">CEFR Mapping</label>
              <select v-model="editingLevel.cefrMap" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent outline-none">
                <option v-for="c in CEFR_OPTIONS" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Score Min</label>
              <input v-model.number="editingLevel.scoreMin" type="number" step="0.1" min="0" max="6" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent outline-none" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Score Max</label>
              <input v-model.number="editingLevel.scoreMax" type="number" step="0.1" min="0" max="6" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent outline-none" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Color</label>
              <div class="flex gap-1.5 flex-wrap pt-1">
                <button v-for="c in COLOR_OPTIONS" :key="c.name" @click="editingLevel.color = c.name" class="w-6 h-6 rounded-full transition-all border-2" :class="[c.class, editingLevel.color === c.name ? 'border-gray-700 scale-125' : 'border-transparent']"></button>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Goals & Outcomes</label>
            <textarea v-model="editingLevel.goals" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sg-purple-main)] focus:border-transparent outline-none"></textarea>
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
