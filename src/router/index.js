import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
       {
            path: '/',
            name: 'index',
            component: () => import('@/views/IndexView.vue'),
			children: [
				{
					path: '/',
					name: 'index-首页',
					component: () => import('@/views/indexViweItem/HomeView.vue')
				} ,{
					path: 'employee',
					name: 'index-员工管理',
					component: () => import('@/views/indexViweItem/employee/EmployeeView.vue')
				}
			]
        }
    ]
})

router.beforeEach((to, from, next) => {
	next()
})

export default router
