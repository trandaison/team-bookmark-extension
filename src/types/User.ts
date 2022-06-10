import type { Image } from './Image';

export type User = {
  id: number;
  avatar: Image;
  created_at: string;
  email: string;
  name: string;
  updated_at: string;
};

export type TeamUser = User & {
  admin: boolean;
  active: boolean;
};
