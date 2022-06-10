import type { TeamUser } from '@/types/User';

export const teamUserMapper = (user: any): Partial<TeamUser> => {
  return {
    ...user,
    role: user.role ?? user.admin ? 'admin' : 'member',
    admin: user.role === 'owner' || user.role === 'admin',
  };
};
