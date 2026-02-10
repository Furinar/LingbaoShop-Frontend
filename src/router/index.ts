import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('../views/WelcomeView.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
  ],
})

// 首次访问未访问过则跳转到介绍页
router.beforeEach((to) => {
  const visited = localStorage.getItem('lingbao_visited')
  if (!visited && to.name !== 'welcome') {
    return { name: 'welcome' }
  }
})

export default router
