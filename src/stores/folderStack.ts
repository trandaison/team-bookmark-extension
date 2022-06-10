import { defineStore } from 'pinia';
import type { Folder, TreeSelectFolder } from '@/types/Folder';

export const useFolderStackStore = defineStore({
  id: 'folderStack',
  state: () => ({
    stack: [] as Folder[],
  }),
  getters: {
    currentFolder: (state) => state.stack[state.stack.length - 1] || null,
    currentFolderId: (state) => state.stack[state.stack.length - 1]?.id || null,
    isEmpty: (state) => state.stack.length === 0,
    tree: (state) =>
      state.stack.reverse().reduce((children, folder) => {
        return {
          value: folder.id,
          label: folder.name,
          children: children ? [children] : [],
          isLeaf: children === null,
        } as TreeSelectFolder;
      }, null as TreeSelectFolder | null),
  },
  actions: {
    pop() {
      return this.stack.pop();
    },

    jumpTo(folder: Folder) {
      const index = this.stack.findIndex((f) => f.id === folder.id);
      if (index === -1) {
        this.stack.push(folder);
      } else {
        this.stack = this.stack.slice(0, index + 1);
      }
    },

    clear() {
      this.stack = [];
    },

    push(folder: Folder) {
      this.stack.push(folder);
    },
  },
});
