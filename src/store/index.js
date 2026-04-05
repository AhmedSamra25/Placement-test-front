import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api' // Our new axios instance

export const useAppStore = defineStore('app', () => {

    // --- Auth State ---
    const currentUser = ref(null) 
    const moderators = ref([])

    const initAuth = async () => {
        const token = localStorage.getItem('sg_auth_token')
        if (!token) return
        try {
            const { data } = await api.get('/me')
            currentUser.value = data.data || data
        } catch (e) {
            localStorage.removeItem('sg_auth_token')
            currentUser.value = null
        }
    }

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password })
            if (data.token) {
                localStorage.setItem('sg_auth_token', data.token)
            }
            currentUser.value = data.user || data.data || { role: 'admin', email }
            return true
        } catch (e) {
            console.error('Login failed', e)
            return false
        }
    }

    const logout = async () => {
        try {
            await api.post('/auth/logout')
        } catch(e) {}
        localStorage.removeItem('sg_auth_token')
        currentUser.value = null
    }

    // --- Team CRUD ---
    const fetchTeam = async () => {
        try {
            const { data } = await api.get('/team')
            moderators.value = data.data || data
        } catch(e) {}
    }
    const addModerator = async (mod) => {
        try { await api.post('/team', mod); await fetchTeam() } catch(e) {}
    }
    const updateModerator = async (id, updates) => {
        try { await api.put(`/team/${id}`, updates); await fetchTeam() } catch(e) {}
    }
    const removeModerator = async (id) => {
        try { await api.delete(`/team/${id}`); await fetchTeam() } catch(e) {}
    }

    // --- Org State ---
    const currentOrgId = ref(1)
    const organizations = ref([{ id: 1, name: 'Speaking Genie Placement', totalTests: 150, usedTests: 0 }])
    const students = ref([])
    const currentOrg = computed(() => organizations.value.find(o => o.id === currentOrgId.value))
    const orgStudents = computed(() => students.value)

    const fetchDashboardStats = async () => {
        try {
            const { data } = await api.get('/dashboard/stats')
            if (data.org) {
                organizations.value = [data.org]
                currentOrgId.value = data.org.id
            }
        } catch(e){}
    }

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/students')
            students.value = data.data || data
        } catch(e) {}
    }

    const sendInvitation = async (studentInfo) => {
        try {
            await api.post('/students/invite', studentInfo)
            await fetchStudents()
        } catch(e) {
            console.error(e)
        }
    }

    // --- CEFR Levels Configuration ---
    const cefrLevels = ref([
        { id: 1, name: 'Starter', cefrMap: 'A1', scoreMin: 1.0, scoreMax: 1.9, goals: 'Can understand...', color: 'blue' }
    ])

    const fetchCefrLevels = async () => {
        try {
            const { data } = await api.get('/settings/cefr')
            if (data && data.length > 0) cefrLevels.value = data
        } catch(e){}
    }
    const addCefrLevel = async (level) => {
        try { await api.post('/settings/cefr', level); await fetchCefrLevels() } catch(e){}
    }
    const updateCefrLevel = async (id, updates) => {
        try { await api.put(`/settings/cefr/${id}`, updates); await fetchCefrLevels() } catch(e){}
    }
    const removeCefrLevel = async (id) => {
        try { await api.delete(`/settings/cefr/${id}`); await fetchCefrLevels() } catch(e){}
    }

    // --- Test State ---
    const getInitialTestState = () => {
        const savedState = localStorage.getItem('sg_placement_test_state')
        return savedState ? JSON.parse(savedState) : {
            studentName: '', studentEmail: '', language: 'English', currentSection: 0, answers: {}
        }
    }
    const testState = ref(getInitialTestState())
    
    // Temporary storage for audio blobs before section upload (not saved to localizedStorage)
    const audioBlobs = ref({}) // key is promptId, value is blob

    const persistTestState = () => {
        localStorage.setItem('sg_placement_test_state', JSON.stringify(testState.value))
    }
    const clearTestState = () => {
        localStorage.removeItem('sg_placement_test_state')
        testState.value = { studentName: '', studentEmail: '', language: 'English', currentSection: 0, answers: {} }
        audioBlobs.value = {}
    }

    const registerForTest = async (payload) => {
        try {
            const { data } = await api.post('/test/register', payload)
            if (data.token) localStorage.setItem('sg_auth_token', data.token)
            return data
        } catch(e) { return null }
    }

    const saveSection = async (section, data) => {
        try { await api.post('/test/save-section', { section, data }) } catch(e){}
    }

    const submitTest = async (payload) => {
        try {
            await api.post('/test/submit', payload)
            clearTestState()
            return true
        } catch(e){ return false }
    }

    const saveTestResult = async (studentId, result) => {
        // Backwards compat shim for components assuming sync local mock
        await submitTest({ studentId, result })
    }

    return {
        // Auth
        currentUser,
        initAuth,
        login,
        logout,
        
        // Team
        moderators,
        fetchTeam,
        addModerator,
        updateModerator,
        removeModerator,

        // Org
        currentOrgId,
        organizations,
        students,
        currentOrg,
        orgStudents,
        fetchDashboardStats,
        fetchStudents,
        sendInvitation,

        // Settings
        cefrLevels,
        fetchCefrLevels,
        addCefrLevel,
        updateCefrLevel,
        removeCefrLevel,

        // Test Flow
        testState,
        audioBlobs,
        persistTestState,
        clearTestState,
        registerForTest,
        saveSection,
        submitTest,
        saveTestResult,

        // Mocks for components transitioning to APIs
        results: ref({})
    }
})
