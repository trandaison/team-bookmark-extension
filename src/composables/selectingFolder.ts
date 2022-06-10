import type { Folder } from '@/types/Folder';
import { ref } from 'vue';

export function useSelectingFolder() {
  const selectingFolder = ref<Folder | null>(null);

  const selectFolder = (folder: Folder | null) => {
    selectingFolder.value = folder;
  };

  return { selectingFolder, selectFolder };
}
