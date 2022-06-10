import { defineStore } from 'pinia';
import type { User } from '@/types/User';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null as null | User,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    setUser(user: User) {
      this.user = user;
    },
  },
});
