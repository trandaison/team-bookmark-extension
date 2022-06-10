<template>
  <div>
    <el-dropdown trigger="click" @command="commandHandler">
      <span class="action-more-trigger header-item__tool">
        <el-icon>
          <IconMore />
        </el-icon>
        <el-icon class="el-icon--right"><CaretBottom /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu class="menu-action-more">
          <el-dropdown-item command="open">Open</el-dropdown-item>
          <el-dropdown-item command="copy">Copy</el-dropdown-item>
          <el-dropdown-item command="cut">Cut</el-dropdown-item>
          <el-dropdown-item command="rename" divided>Rename</el-dropdown-item>
          <el-dropdown-item command="edit">Edit</el-dropdown-item>
          <el-dropdown-item command="delete">Delete</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { inject, markRaw, type PropType } from 'vue';
import type { Axios } from 'axios';
import { CaretBottom, WarningFilled } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import IconMore from '@/components/icons/IconMore.vue';
import type { Folder } from '@/types/Folder';

markRaw(WarningFilled);

const props = defineProps({
  folder: {
    type: Object as PropType<Folder>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'deleted', folder?: Folder): void;
  (e: 'update:folder', folder: Partial<Folder>): void;
  (e: 'unselect'): void;
}>();

const api = inject('api') as Axios;

const deleteFolder = () => {
  ElMessageBox.confirm(
    'Delete this folder permanently. Are you sure?',
    'Delete folder',
    {
      type: 'error',
      icon: WarningFilled,
    }
  )
    .then(async () => {
      await api.delete(`/folders/${props.folder.id}`);
      emit('deleted', props.folder);
    })
    .catch();
};

const commandHandler = (command: string) => {
  switch (command) {
    case 'open':
      break;
    case 'copy':
      break;
    case 'cut':
      break;
    case 'rename':
      break;
    case 'edit':
      break;
    case 'delete':
      deleteFolder();
      break;
    default:
      break;
  }
};
</script>

<style scoped lang="scss">
.el-dropdown {
  font-size: inherit;
}

.action-more-trigger {
  cursor: pointer;
  display: flex;
  align-items: center;

  .el-icon--right {
    font-size: 12px;
  }
}
</style>
