import { createRouter, createWebHashHistory } from 'vue-router';
import { useCurrentUser } from '@/composables/currentUser';
import HomeView from '../views/HomeView.vue';
import guestMiddleware from './middlewares/guest';
import authMiddleware from './middlewares/auth';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: authMiddleware,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      beforeEnter: guestMiddleware,
    },
    {
      path: '/folders/:id',
      name: 'folders-id',
      component: () => import('../views/folders/_idView.vue'),
      beforeEnter: authMiddleware,
    },
    {
      path: '/bookmarks/new',
      name: 'bookmarks-new',
      component: () => import('../views/bookmarks/newView.vue'),
      beforeEnter: authMiddleware,
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('../views/ErrorView.vue'),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const currentUser = useCurrentUser();

  if (currentUser.isLoggedIn() && !currentUser.user.value) {
    await currentUser.fetchMe();
    next();
  } else {
    next();
  }
});

export default router;
