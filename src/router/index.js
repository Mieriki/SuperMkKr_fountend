import { createRouter, createWebHistory } from 'vue-router'
import { unauthorized } from "@/net";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/welcome',
            name: 'welcome',
            component: () => import('@/views/WelcomeView.vue'),
            children: [
               {
                   path: '',
                   name: 'welcome-form',
                   component: () => import('@/views/welcome/FormView.vue'),
				   children: [
					    {
							path: 'login',
					        name: 'welcome-login',
					        component: () => import('@/views/welcome/LoginPage.vue')
					    },
				   ]
               }
            ]
        }, {
            path: '/',
            name: 'index',
            component: () => import('@/views/IndexView.vue'),
			children: [
				{
					path: '',
				    name: 'index',
				    component: () => import('@/views/indexViweItem/HomeView.vue')
				}, {
					path: 'account',
					name: 'index-用户管理',
					component: () => import('@/views/indexViweItem/account/AccountView.vue')
				}, {
					path: 'provider',
					name: 'index-供应商管理',
					component: () => import('@/views/indexViweItem/provider/ProviderView.vue')
				}, {
					path: 'bill',
					name: 'index-商品管理',
					component: () => import('@/views/indexViweItem/bill/BillView.vue')
				}
			]
        }
    ]
})

router.beforeEach((to, from, next) => {
    const isUnauthorized = unauthorized()
    if(to.name.startsWith('welcome') && !isUnauthorized) {
        next('/')
    } else if(to.name.startsWith('index') && isUnauthorized) {
        next('/welcome/login')
    } else {
        next()
    }
})

export default router
