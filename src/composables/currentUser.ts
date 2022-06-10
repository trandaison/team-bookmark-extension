import { storeToRefs } from 'pinia';
import createApiClient from '@/clients/api';
import { isLoggedIn, resetAuth } from '@/services/authStorage';
import { useAuthStore } from '@/stores/auth';

export function useCurrentUser() {
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);
  const api = createApiClient();

  const fetchMe = () =>
    new Promise((resolve, reject) => {
      api
        .get('/me')
        .then((res) => {
          authStore.setUser(res.data.data);
          resolve(res);
        })
        .catch((error) => {
          resetAuth();
          reject(error);
        });
    });

  return { fetchMe, isLoggedIn, user };
}
