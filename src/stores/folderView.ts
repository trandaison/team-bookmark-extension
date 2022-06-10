import { defineStore } from 'pinia';
import type { Folder } from '@/types/Folder';

export const useFolderViewStore = defineStore({
  id: 'folderView',
  state: () => ({
    selectingFolder: null as Folder | null,
  }),
  getters: {},
  actions: {
    select(folder: Folder) {
      this.selectingFolder = folder;
    },
  },
});
