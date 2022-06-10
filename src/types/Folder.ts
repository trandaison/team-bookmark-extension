import type { Image } from './Image';

export type Folder = {
  created_at: string;
  icon: Image;
  id: number | null;
  name: string;
  position: null;
  updated_at: string;
};

export type TreeSelectFolder = {
  value: number | null;
  label: string;
  children?: TreeSelectFolder[];
  isLeaf?: boolean;
};
