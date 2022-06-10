import type { Bookmark } from './Bookmark';
import type { Folder } from './Folder';
import type { Image } from './Image';
import type { User } from './User';

export type Team = {
  id: number;
  name: string;
  description: string;
  icon: Image;
  pinned: boolean;
  position: number | null;
  created_at: string;
  updated_at: string;
  bookmarks?: Bookmark[];
  folders?: Folder[];
  owner?: User;
};
