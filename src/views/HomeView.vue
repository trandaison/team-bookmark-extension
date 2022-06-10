<template>
  <el-container class="layout-home">
    <el-container direction="vertical">
      <Suspense>
        <HeaderBar :main-view-ref="() => mainViewRef" />
      </Suspense>

      <el-main v-if="team">
        <Suspense :key="team.id">
          <ListViewFolder ref="mainViewRef" />

          <template #fallback>Loading...</template>
        </Suspense>
      </el-main>

      <StatusBar />
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useTeamsStore } from '@/stores/teams';
import HeaderBar from '@/components/home/HeaderBar.vue';
import ListViewFolder from '@/components/home/ListViewFolder.vue';
import StatusBar from '@/components/home/StatusBar.vue';
import { ref } from 'vue';

const { team } = storeToRefs(useTeamsStore());

const mainViewRef = ref<any>(null);
</script>

<style lang="scss" scoped>
.layout-home {
  width: 600px;
  height: 578px;
}

.el-main {
  background-color: var(--vt-c-white);
  padding: 6px 6px 0;
}
</style>
