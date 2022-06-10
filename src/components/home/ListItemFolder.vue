<template>
  <FolderRename
    v-if="isFocused"
    :key="`rename-folder-${folder.id}`"
    :folder="folder"
    :class="{ highlight }"
    @dblclick="openFolder"
    @updated="onUpdated"
    @focus="onEdit"
    @blur="onBlur"
    @update-and-blur="onEditedAndBlur"
  />
  <el-link
    v-else
    :key="`view-folder-${folder.id}`"
    :underline="false"
    :class="{ highlight }"
    class="list-item--folder"
    @click="onClick"
    @dblclick="openFolder"
  >
    <el-icon><IconFolder /></el-icon>
    <span style="margin-left: 10px">{{ folder.name }}</span>
  </el-link>
</template>

<script lang="ts" setup>
import { watch, ref, type PropType, onMounted } from 'vue';
import { Folder as IconFolder } from '@element-plus/icons-vue';
import type { Folder } from '@/types/Folder';
import { useFolderStackStore } from '@/stores/folderStack';
import FolderRename from './FolderRename.vue';
import { unselectText } from '@/utils/dom';

const props = defineProps({
  folder: {
    type: Object as PropType<Folder>,
    required: true,
  },
  highlight: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'select', folder: Folder): void;
  (e: 'update:folder', folder: Partial<Folder>): void;
  (e: 'unselect'): void;
}>();

const folderStack = useFolderStackStore();

const isFocused = ref(false);
const isEditing = ref(false);

onMounted(() => {
  if (!props.folder.id) {
    isFocused.value = true;
    isEditing.value = true;
  }
});

const openFolder = () => {
  folderStack.push(props.folder);
};

const onClick = () => {
  isFocused.value = true;
  emit('select', props.folder);
};

const unselectFolder = () => {
  isFocused.value = false;
  unselectText();
  setTimeout(() => emit('unselect'));
};

const onClickOutside = (e: Event) => {
  if (isEditing.value) return;

  const target = e.target as Element;
  if (!target) return;

  if (
    !target.closest(
      '.list-item--folder, #action-more, .menu-action-more, .list-item--new-folder'
    )
  ) {
    unselectFolder();
  }
};

const onEdit = () => {
  isEditing.value = true;
  document.removeEventListener('click', onClickOutside, true);
};

const onUpdated = (folder: Partial<Folder>) => {
  isEditing.value = false;
  emit('update:folder', folder);
};

const onBlur = () => {
  isFocused.value = false;
  isEditing.value = false;
  unselectFolder();
};

const onEditedAndBlur = (folder: Folder) => {
  onUpdated(folder);
  onBlur();
};

watch(
  () => props.highlight,
  (highlighted) => {
    if (highlighted) {
      document.addEventListener('click', onClickOutside, true);
    } else {
      document.removeEventListener('click', onClickOutside, true);
    }
  }
);
</script>

<style lang="scss" scoped>
.el-link {
  display: inline-flex;
  align-items: center;
  padding: 0 4px;
  transition: 0.1s ease-in-out;

  &.highlight {
    color: #fff;
    background-color: var(--c-primary);
    border-radius: 4px;
  }

  &:deep {
    .el-link__inner {
      user-select: none;
    }
  }
}
</style>
