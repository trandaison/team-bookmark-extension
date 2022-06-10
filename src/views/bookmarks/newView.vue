<template>
  <el-form
    :model="bookmark"
    label-width="60px"
    label-position="left"
    class="form"
  >
    <h2 class="form__title">Bookmark added</h2>

    <el-form-item label="Name">
      <el-input v-model="bookmark.name" ref="nameRef" maxlength="255" />
    </el-form-item>
    <el-form-item label="Folder">
      <el-tree-select
        v-model="bookmark.folder_id"
        lazy
        check-strictly
        :data="folders"
        :load="loadFolder"
        :props="{ label: 'label', children: 'children', isLeaf: 'isLeaf' }"
      />
    </el-form-item>
    <div class="form__footer">
      <el-button>More...</el-button>
      <span>
        <el-button @click="router.back()">Remove</el-button>
        <el-button type="primary" @click="onSubmit">Done</el-button>
      </span>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import type { Axios } from 'axios';
import { inject, nextTick, onMounted, reactive, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import type { Resolve } from 'element-plus';
import { useTeamsStore } from '@/stores/teams';
import { useFolderStackStore } from '@/stores/folderStack';
import type { Bookmark } from '@/types/Bookmark';
import type { Folder, TreeSelectFolder } from '@/types/Folder';

const { team } = storeToRefs(useTeamsStore());
const folderStack = useFolderStackStore();
const { currentFolderId } = storeToRefs(folderStack);

const router = useRouter();
const api = inject('api') as Axios;

const bookmark = reactive({
  name: '',
  content: '',
  folder_id: currentFolderId.value || 0,
  sharing_mode: 'shared',
  bookmark_type: 'url',
} as Partial<Bookmark>);

const nameRef = ref(null as HTMLInputElement | null);

const folders = ref([
  { value: 0, label: '<root>', isLeaf: true },
] as TreeSelectFolder[]);

watchEffect(async () => {
  const { data } = await api.get(`/teams/${team.value?.id}/folders`);
  folders.value.push(
    ...data.map((folder: Folder) => ({
      value: folder.id,
      label: folder.name,
      children: [],
    }))
  );
});

const loadFolder = async (node: any, resolve: Resolve) => {
  let nodeData: TreeSelectFolder = { ...node }.data;
  if (Array.isArray(nodeData)) nodeData = nodeData[0];

  if (nodeData.isLeaf) {
    return resolve([]);
  }

  const params = { folder_id: nodeData.value };
  const path = `/teams/${team.value?.id}/folders`;
  const { data } = await api.get(path, { params });

  return resolve(
    data.map((folder: Folder) => ({
      value: folder.id,
      label: folder.name,
      children: [],
    }))
  );
};

const getTabInfo = (): Promise<chrome.tabs.Tab> =>
  new Promise((resolve) => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
        resolve(tab[0]);
      });
    } catch (error) {
      resolve({
        url: window.location.href,
        title: document.title,
      } as chrome.tabs.Tab);
    }
  });

onMounted(async () => {
  const tabInfo = await getTabInfo();
  bookmark.content = tabInfo.url;
  bookmark.name = tabInfo.title;
  await nextTick();
  nameRef.value?.select();
});

const onSubmit = () => {
  bookmark.folder_id = bookmark.folder_id ? bookmark.folder_id : null;
  api.post(`/teams/${team.value?.id}/bookmarks`, { bookmark }).then(() => {
    router.back();
  });
};
</script>

<style lang="scss" scoped>
.form {
  padding: 16px;
  width: 400px;
  background-color: var(--vt-c-white);

  &__title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 16px;
  }

  &__footer {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .el-button {
      min-width: 90px;
    }
  }

  .el-select {
    width: 100%;
  }
}
</style>
