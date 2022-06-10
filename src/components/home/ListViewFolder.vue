<template>
  <div>
    <el-table
      :data="bookmarksAndFolders"
      :default-sort="{ prop: 'created_at', order: 'descending' }"
      :row-key="(item: any) => `${item.type}_${item.id || item._id}`"
      stripe
      height="500"
      style="width: 100%"
    >
      <el-table-column label="Name" sortable>
        <template #default="{ row }">
          <div class="d-flex align-center">
            <component
              :is="row.type === 'folder' ? ListItemFolder : 'el-link'"
              :folder="row"
              :underline="false"
              v-bind="row.linkAttrs"
              class="el-link el-link--default lis-item--link"
              rel="noopener noreferrer"
              style="display: inline-flex; align-items: center"
              @select="onClickFolder"
              @unselect="onClickFolder"
              @update:folder="updateFolder"
            >
              <span class="el-link__inner">
                <el-icon v-if="row.bookmark_type">
                  <Link />
                </el-icon>
                <el-icon v-else>
                  <IconFolder />
                </el-icon>
                <span style="margin-left: 10px">{{ row.name }}</span>
              </span>
            </component>
            <BtnCopy v-if="row.type === 'url'" :text="row.content" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="Date added"
        width="160"
        sortable
        :formatter="formatDate"
      />
    </el-table>

    <Teleport v-if="readyForTeleporting" to="#action-more">
      <HeaderBarActionMore
        v-if="selectingFolder"
        :folder="selectingFolder"
        @deleted="refresh"
      />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, watchEffect, onMounted, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { dayjs } from 'element-plus';
import { Folder as IconFolder, Link } from '@element-plus/icons-vue';
import type { Axios } from 'axios';
import { useTeamsStore } from '@/stores/teams';
import { useFolderStackStore } from '@/stores/folderStack';
import BtnCopy from '../common/BtnCopy.vue';
import ListItemFolder from './ListItemFolder.vue';
import type { Folder } from '@/types/Folder';
import type { Bookmark } from '@/types/Bookmark';
import { useSelectingFolder } from '@/composables/selectingFolder';
import HeaderBarActionMore from './HeaderBarActionMore.vue';

const teamsStore = useTeamsStore();
const { team } = storeToRefs(teamsStore);
const folderStack = useFolderStackStore();
const { currentFolder } = storeToRefs(folderStack);
const { selectingFolder, selectFolder } = useSelectingFolder();

const api = inject('api') as Axios;

const folders = ref([] as Folder[]);
const bookmarks = ref([] as Bookmark[]);
const readyForTeleporting = ref(false);

const teamId = computed(() => team.value?.id);

onMounted(() => {
  setTimeout(() => {
    readyForTeleporting.value = true;
  }, 1000);
});

const bookmarksAndFolders = computed(() => [
  ...folders.value.map((item) => ({
    ...item,
    type: 'folder',
    linkAttrs: {
      highlight: selectingFolder.value && selectingFolder.value.id === item.id,
    },
  })),
  ...bookmarks.value.map((item) => ({
    ...item,
    linkAttrs: {
      href: item.content,
      target: '_blank',
    },
    type: 'url',
  })),
]);

const formatDate = (row: any) =>
  dayjs(row.created_at).format('HH:mm, D MMM YYYY');

const onClickFolder = (row: any = null) => {
  selectFolder(row);
};

const addNewFolder = async () => {
  const newFolder: any = {
    _id: Date.now(),
    name: 'untitled folder',
    created_at: new Date().toString(),
    updated_at: new Date().toString(),
  };
  folders.value.unshift(newFolder);
  await nextTick();
  selectFolder(newFolder);
};

const updateFolder = (folder: Partial<Folder>) => {
  const index = folders.value.findIndex((item) => item.id === folder.id);
  if (index !== -1) {
    folders.value[index] = {
      ...folders.value[index],
      ...folder,
    };
  }
};

const refresh = async () => {
  if (currentFolder.value) {
    selectFolder(null);
    const { data } = await api.get(`/folders/${currentFolder.value.id}`);
    folders.value = data.folders;
    bookmarks.value = data.bookmarks;
  } else if (teamId.value) {
    selectFolder(null);
    const { data } = await api.get(`/teams/${teamId.value}`);
    folders.value = data.folders;
    bookmarks.value = data.bookmarks;
    teamsStore.$patch({ team: data });
  }
};

watchEffect(refresh);

defineExpose({
  addNewFolder,
});
</script>

<style lang="scss" scoped>
.el-link {
  margin-right: 8px;
}

.d-flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.lis-item {
  &--link {
    padding: 0 4px;
  }
}
</style>
