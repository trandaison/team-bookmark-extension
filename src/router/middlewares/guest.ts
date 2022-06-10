import { isLoggedIn } from '@/services/authStorage';

export default () => {
  if (isLoggedIn()) {
    return { name: 'home' };
  }
};
