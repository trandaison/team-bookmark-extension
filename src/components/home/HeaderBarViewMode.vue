<template>
  <el-radio-group v-model="viewMode">
    <el-radio-button label="list">
      <div class="header-item__tool">
        <el-icon><IconList /></el-icon>
      </div>
    </el-radio-button>
    <el-radio-button label="grid">
      <div class="header-item__tool">
        <el-icon><IconGrid /></el-icon>
      </div>
    </el-radio-button>
    <el-radio-button label="cols">
      <div class="header-item__tool">
        <el-icon><IconCols /></el-icon>
      </div>
    </el-radio-button>
  </el-radio-group>
</template>

<script lang="ts" setup>
import IconList from '../icons/IconList.vue';
import IconGrid from '../icons/IconGrid.vue';
import IconCols from '../icons/IconCols.vue';
import { ref } from 'vue';

const viewMode = ref('list');
</script>
