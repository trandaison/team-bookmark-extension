<template>
  <div class="list-item--new-folder" @dblclick="onDoubleClick">
    <el-icon><IconFolder /></el-icon>
    <span
      ref="inputRef"
      style="margin-left: 10px"
      class="name"
      :class="{ editable }"
      :contenteditable="editable"
      @keydown.enter.stop.prevent="onEnter"
      @mouseup="onMouseUp"
      @blur="onBlur"
      @focus="onFocus"
    >
      {{ folder.name }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { inject, nextTick, onMounted, ref, type PropType } from 'vue';
import { Folder as IconFolder } from '@element-plus/icons-vue';
import type { Folder } from '@/types/Folder';
import { selectText } from '@/utils/dom';
import type { Axios } from 'axios';
import { useTeamsStore } from '@/stores/teams';
import { storeToRefs } from 'pinia';
import { useFolderStackStore } from '@/stores/folderStack';

const defaultFolderName = 'untitled folder';

const props = defineProps({
  folder: {
    type: Object as PropType<Partial<Folder>>,
    default: () => ({ name: 'untitled folder' }),
  },
});

const api = inject('api') as Axios;
const { team } = storeToRefs(useTeamsStore());
const folderStackStore = useFolderStackStore();
const { currentFolder } = storeToRefs(folderStackStore);

const emit = defineEmits<{
  (e: 'updated', value: Folder): void;
  (e: 'renamed', value: string): void;
  (e: 'dblclick', value: Event): void;
  (e: 'focus', value: Event): void;
  (e: 'blur', value: Event): void;
  (e: 'updated-and-blur', value: Folder): void;
}>();

const inputRef = ref<HTMLSpanElement | null>(null);
const editable = ref(false);
const isSubmitting = ref(false);
const isSaved = ref(false);

onMounted(async () => {
  if (props.folder.id) return;

  // New folder
  editable.value = true;
  await nextTick();
  selectText(inputRef.value as HTMLElement);
});

const onMouseUp = (event: Event) => {
  const target = event.target as HTMLElement;
  setTimeout(async () => {
    editable.value = true;
    await nextTick();
    if (target && target.closest('.name')) {
      selectText(target);
      isSaved.value = false;
    }
  }, 500);
};

const onDoubleClick = (event: Event) => {
  if (!editable.value) {
    emit('dblclick', event);
  }
};

const submit = (name: string) => {
  const data = new FormData();
  data.append('folder[name]', name);
  data.append('folder[sharing_mode]', 'shared');
  if (currentFolder.value) {
    data.append('folder[parent_id]', String(currentFolder.value.id));
  }
  return props.folder.id ? renameFolder(data) : createFolder(data);
};

const createFolder = (data: FormData) => {
  if (!team.value) return;

  return api.post(`/teams/${team.value.id}/folders`, data);
};

const renameFolder = (data: FormData) => {
  if (!team.value) return;

  return api.put(`/folders/${props.folder.id}`, data);
};

const onEnter = async (event: Event) => {
  if (isSubmitting.value || isSaved.value) return;

  const el = event.target as HTMLElement;
  const name = el.innerText.trim() || props.folder.name || defaultFolderName;
  let data: any = null;
  if (!props.folder.id || name !== props.folder.name) {
    const res = await submit(name);
    data = res?.data;
    emit('updated', { ...props.folder, ...data } as Folder);
    emit('renamed', name);
  }
  isSaved.value = true;
  editable.value = false;
  el.innerText = name;

  return data;
};

const onBlur = async (event: Event) => {
  editable.value = false;
  if (isSaved.value) return;

  const folder = await onEnter(event);
  if (folder) {
    emit('updated-and-blur', folder);
  } else {
    emit('blur', event);
  }
};

const onFocus = (event: Event) => {
  emit('focus', event);
};
</script>

<style lang="scss" scoped>
.list-item--new-folder {
  display: inline-flex;
  align-items: flex-start;
  padding: 0 4px;
  transition: 0.1s ease-in-out;
  font-size: 14px;

  .el-icon {
    flex-shrink: 0;
  }

  .name {
    max-width: 390px;

    &:not(.editable) {
      user-select: none;
    }

    &:focus {
      color: var(--el-text-color-regular);
      background-color: #fff;
    }
  }

  &.highlight {
    color: #fff;
    background-color: var(--c-primary);
    border-radius: 4px;
  }
}
</style>
