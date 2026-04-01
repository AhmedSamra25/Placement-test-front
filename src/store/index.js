import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Mock Data
const MOCK_ORGS = [
    { id: 1, name: 'Global Language School', totalTests: 150, usedTests: 45 }
]

const MOCK_STUDENTS = [
    { id: 1, orgId: 1, name: 'Alice Smith', email: 'alice@example.com', status: 'completed', score: 3.6, testDate: '2026-03-01' },
    { id: 2, orgId: 1, name: 'Bob Jones', email: 'bob@example.com', status: 'pending', score: null, testDate: null },
    { id: 3, orgId: 1, name: 'Charlie Brown', email: 'charlie@example.com', status: 'completed', score: 5.3, testDate: '2026-03-10' },
]

const MOCK_RESULTS = {
    1: { studentId: 1, reading: 4, writing: 3, speaking: 3, listening: 4, vocabulary: 4, grammar: 3, pronunciation: 4 }, // Alice (avg 3.6 - B2)
    3: { studentId: 3, reading: 6, writing: 5, speaking: 6, listening: 5, vocabulary: 5, grammar: 5, pronunciation: 5 }, // Charlie (avg 5.3 - C1/C2)
}

export const useAppStore = defineStore('app', () => {

    // --- Auth State ---
    const currentUser = ref(null) // null, { role: 'admin' | 'moderator', name: 'John Doe' }
    const moderators = ref([
        { id: 1, name: 'Alice Smith', email: 'alice@school.edu', status: 'active' }
    ])

    const login = (email, password) => {
        // Mock login logic
        if (email === 'admin@school.edu' && password === 'admin') {
            currentUser.value = { role: 'admin', name: 'School Admin', email }
            return true
        }
        const mod = moderators.value.find(m => m.email === email && m.status === 'active')
        if (mod && password === 'mod') {
            currentUser.value = { role: 'moderator', name: mod.name, email }
            return true
        }
        return false
    }

    const logout = () => {
        currentUser.value = null
    }

    // --- Team CRUD ---
    const addModerator = (mod) => {
        const id = moderators.value.length > 0 ? Math.max(...moderators.value.map(m => m.id)) + 1 : 1
        moderators.value.push({ id, ...mod, status: 'active' })
    }

    const updateModerator = (id, updates) => {
        const idx = moderators.value.findIndex(m => m.id === id)
        if (idx !== -1) moderators.value[idx] = { ...moderators.value[idx], ...updates }
    }

    const removeModerator = (id) => {
        moderators.value = moderators.value.filter(m => m.id !== id)
    }
    // --- Org State ---
    const currentOrgId = ref(1)
    const organizations = ref([...MOCK_ORGS])
    const students = ref([...MOCK_STUDENTS])
    const results = ref({ ...MOCK_RESULTS })

    const currentOrg = computed(() => organizations.value.find(o => o.id === currentOrgId.value))
    const orgStudents = computed(() => students.value.filter(s => s.orgId === currentOrgId.value))

    const sendInvitation = (studentInfo) => {
        const newStudent = {
            id: students.value.length > 0 ? Math.max(...students.value.map(s => s.id)) + 1 : 1,
            orgId: currentOrgId.value,
            name: studentInfo.name,
            email: studentInfo.email,
            targetLanguage: studentInfo.targetLanguage || 'English',
            status: 'pending',
            score: null,
            testDate: null,
            completionTime: null
        }
        students.value.push(newStudent)
    }

    // --- CEFR Levels Configuration ---
    const cefrLevels = ref([
        { id: 1, name: 'Starter', cefrMap: 'A1', scoreMin: 1.0, scoreMax: 1.9, goals: 'Can understand and use familiar everyday expressions and very basic phrases.', color: 'blue' },
        { id: 2, name: 'Elementary', cefrMap: 'A2', scoreMin: 2.0, scoreMax: 2.9, goals: 'Can communicate simple and direct exchanges of information on familiar topics.', color: 'cyan' },
        { id: 3, name: 'Intermediate', cefrMap: 'B1', scoreMin: 3.0, scoreMax: 3.9, goals: 'Can deal with most situations likely to arise while travelling in target language area.', color: 'green' },
        { id: 4, name: 'Upper Intermediate', cefrMap: 'B2', scoreMin: 4.0, scoreMax: 4.9, goals: 'Can understand the main ideas of complex text on both concrete and abstract topics.', color: 'yellow' },
        { id: 5, name: 'Advanced', cefrMap: 'C1', scoreMin: 5.0, scoreMax: 5.9, goals: 'Can express ideas fluently and spontaneously without much obvious searching for expressions.', color: 'orange' },
        { id: 6, name: 'Mastery', cefrMap: 'C2', scoreMin: 6.0, scoreMax: 6.0, goals: 'Can understand with ease virtually everything heard or read.', color: 'purple' }
    ])

    const addCefrLevel = (level) => {
        const id = cefrLevels.value.length + 1
        cefrLevels.value.push({ id, ...level })
    }

    const updateCefrLevel = (id, updates) => {
        const idx = cefrLevels.value.findIndex(l => l.id === id)
        if (idx !== -1) cefrLevels.value[idx] = { ...cefrLevels.value[idx], ...updates }
    }

    const removeCefrLevel = (id) => {
        cefrLevels.value = cefrLevels.value.filter(l => l.id !== id)
    }
    // --- Test State ---
    const getInitialTestState = () => {
        const savedState = localStorage.getItem('sg_placement_test_state')
        return savedState ? JSON.parse(savedState) : {
            studentName: '',
            studentEmail: '',
            language: 'English',
            currentSection: 0,
            answers: {}
        }
    }

    const testState = ref(getInitialTestState())

    const persistTestState = () => {
        localStorage.setItem('sg_placement_test_state', JSON.stringify(testState.value))
    }

    const clearTestState = () => {
        localStorage.removeItem('sg_placement_test_state')
        testState.value = {
            studentName: '',
            studentEmail: '',
            language: 'English',
            currentSection: 0,
            answers: {}
        }
    }

    const saveTestResult = (studentId, result) => {
        results.value[studentId] = { studentId, ...result }
        const student = students.value.find(s => s.id === studentId)
        if (student) {
            student.status = 'completed'

            let total = 0
            const skills = ['reading', 'writing', 'speaking', 'listening', 'vocabulary', 'grammar', 'pronunciation']
            skills.forEach(s => total += result[s] || 0)

            student.score = (total / skills.length).toFixed(1)
            student.testDate = new Date().toISOString().split('T')[0]

            const org = organizations.value.find(o => o.id === student.orgId)
            if (org) {
                org.usedTests++
            }
        }
        // Clear saved test data upon completion
        clearTestState()
    }

    return {
        currentUser,
        moderators,
        login,
        logout,
        addModerator,
        updateModerator,
        removeModerator,

        currentOrgId,
        organizations,
        students,
        results,
        currentOrg,
        orgStudents,
        sendInvitation,

        cefrLevels,
        addCefrLevel,
        updateCefrLevel,
        removeCefrLevel,

        testState,
        persistTestState,
        clearTestState,
        saveTestResult
    }
})
