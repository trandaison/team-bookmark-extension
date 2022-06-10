<template>
  <el-container class="layout-container-demo">
    <el-container direction="vertical">
      <Suspense>
        <HeaderBar />
      </Suspense>

      <el-main v-if="route.params.id">
        <Suspense>
          <ListViewFolder :folder-id="Number(route.params.id)" />

          <template #fallback>Loading...</template>
        </Suspense>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import HeaderBar from '@/components/home/HeaderBar.vue';
import ListViewFolder from '@/components/home/ListViewFolder.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style lang="scss" scoped>
.el-main {
  background-color: var(--vt-c-white);
  padding: 0.5rem;
}
</style>
