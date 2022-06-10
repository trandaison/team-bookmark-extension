<template>
  <div class="status-bar">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item
        :class="{ 'is-link': !folderStack.isEmpty }"
        @click="openFolder(null)"
      >
        root
      </el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="folder in stack"
        :key="folder.id"
        :class="
          folder.id === currentFolderId ? 'pointer-events-none' : 'is-link'
        "
        @click="openFolder(folder)"
      >
        {{ folder.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-icon v-show="!ready" class="is-loading font-size-medium"
      ><IconRefresh
    /></el-icon>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ArrowRight } from '@element-plus/icons-vue';
import { useFolderStackStore } from '@/stores/folderStack';
import type { Folder } from '@/types/Folder';
import IconRefresh from '../icons/IconRefresh.vue';
import { onMounted, ref } from 'vue';

const folderStack = useFolderStackStore();
const { stack, currentFolderId } = storeToRefs(folderStack);

const ready = ref(false);

onMounted(() => {
  setTimeout(() => (ready.value = true), 1000);
});

const openFolder = (folder: Folder | null) => {
  if (folder == null) {
    folderStack.clear();
    return;
  }
  if (folder.id === currentFolderId.value) return;

  folderStack.jumpTo(folder);
};
</script>

<style lang="scss" scoped>
.status-bar {
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .el-breadcrumb {
    font-size: 11px;
    line-height: 1.728;
  }
}

.is-link {
  &:deep {
    .el-breadcrumb__inner {
      cursor: pointer !important;

      &:hover {
        color: #409eff !important;
      }
    }
  }
}

.pointer-events-none {
  pointer-events: none;
}
</style>
