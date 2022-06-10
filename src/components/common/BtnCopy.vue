<template>
  <el-tooltip :content="title" :auto-close="3000" placement="top">
    <el-button text @mouseenter="onMouseEnter" @click="executeCopy">
      <el-icon>
        <CopyDocument />
      </el-icon>
    </el-button>
  </el-tooltip>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { CopyDocument } from '@element-plus/icons-vue';

const props = defineProps({
  text: {
    type: [String, Number],
    default: '',
  },
});

const isClicked = ref(false);
const title = computed(() => {
  return isClicked.value ? 'Copied!' : 'Copy';
});

const executeCopy = () => {
  isClicked.value = true;
  navigator.clipboard.writeText(props.text as string);
};

const onMouseEnter = () => {
  isClicked.value = false;
};
</script>

<style lang="scss" scoped>
.el-button {
  padding: 2px;
  height: auto;
  border-radius: 50%;
}
</style>
