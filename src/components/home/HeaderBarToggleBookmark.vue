<template>
  <div class="header-item__tool" @click="toggleBookmark()">
    <el-icon>
      <StarFilled v-if="isBookmarked" key="filled" class="primary-color" />
      <Star v-else key="none" />
    </el-icon>
  </div>
</template>

<script lang="ts" setup>
import { Star, StarFilled } from '@element-plus/icons-vue';
import { ref } from 'vue';
const isBookmarked = ref(false);

const toggleBookmark = (force?: boolean) => {
  force
    ? (isBookmarked.value = true)
    : (isBookmarked.value = !isBookmarked.value);
};
</script>

<style lang="scss" scoped>
.header-item {
  &__tool {
    height: auto;
    font-size: 20px;
    display: flex;
    align-items: center;
  }
}

.primary-color {
  color: #409eff;
}
</style>
