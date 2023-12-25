import { createRouter, createWebHistory } from 'vue-router'
const _routes = [
    {
        path: '/home',
        component: () => import('../components/home/Home.vue'),
        children: [
            {
                path: '', // home的默认孩子路由
                name: 'home-default',
                component: () => import('../components/home/Home.vue'),
            },
            {
                path: 'overview',
                name: 'home-overview',
                component: () => import('../components/home/Overview.vue'),
            },
            {
                path: 'purchase',
                name: 'home-purchase',
                component: () => import('../components/upload/purchase.vue'),
            },
            {
                path: 'goods',
                name: 'home-upload',
                component: () => import('../components/upload/Upload.vue'),
            },
        ],
    },
    {
        path: '/login',
        component: () => import('../components/Login.vue'),
    },
    {
        path: '/register',
        component: () => import('../components/Register.vue'),
    },
]
const router = createRouter({
    routes: _routes,
    history: createWebHistory()
})
export default router