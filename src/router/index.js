import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/test'
    },
    {
        path: '/org/login',
        component: () => import('../views/org/OrgLogin.vue')
    },
    {
        path: '/org',
        component: () => import('../views/org/OrgLayout.vue'),
        meta: { requiresOrgAuth: true },
        children: [
            {
                path: '',
                component: () => import('../views/org/OrgDashboard.vue')
            },
            {
                path: 'students',
                component: () => import('../views/org/OrgStudents.vue')
            },
            {
                path: 'submissions',
                component: () => import('../views/org/OrgSubmissions.vue')
            },
            {
                path: 'settings',
                component: () => import('../views/org/OrgSettings.vue')
            },
            {
                path: 'team',
                component: () => import('../views/org/OrgTeam.vue')
            },
            {
                path: 'results/:id',
                component: () => import('../views/org/OrgResults.vue')
            }
        ]
    },
    {
        path: '/test',
        component: () => import('../views/test/TestIntro.vue')
    },
    {
        path: '/test/quiz',
        component: () => import('../views/test/TestQuiz.vue')
    },
    {
        path: '/test/complete',
        component: () => import('../views/test/TestComplete.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

import { useAppStore } from '../store'

router.beforeEach((to, from, next) => {
    const store = useAppStore()
    if (to.meta.requiresOrgAuth && !store.currentUser) {
        next('/org/login')
    } else if (to.path === '/org/login' && store.currentUser) {
        next('/org')
    } else {
        next()
    }
})

export default router
