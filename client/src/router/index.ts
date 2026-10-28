import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'explorer',
      component: () => import('../views/OrganExplorerView.vue'),
    },
    {
      path: '/organ/:organId',
      name: 'organ',
      component: () => import('../views/OrganExplorerView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

export default router;
