<template>
  <component :is="tag" class="item">
    <span class="user" :class="{ active: modelValue.active }">
      <el-image :src="modelValue.avatar?.url">
        <template #error>
          <div class="image-slot">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
      <div class="user__info">
        <span class="user__name">{{ modelValue.name }}</span>
        <span class="user__email">{{ modelValue.email }}</span>
      </div>
    </span>
    <span class="actions">
      <slot name="actions">
        <el-switch v-model="isAdmin" size="small" />

        <el-popconfirm
          :icon="Warning"
          title="Do you want to remove this user?"
          icon-color="var(--el-color-danger)"
          confirm-button-type="danger"
        >
          <template #reference>
            <el-button type="danger" link>
              <el-icon><CloseBold /></el-icon>
            </el-button>
          </template>
        </el-popconfirm>
      </slot>
    </span>
  </component>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue';
import type { TeamUser } from '@/types/User';
import { CloseBold, Warning, Picture } from '@element-plus/icons-vue';

const props = defineProps({
  modelValue: {
    type: Object as PropType<Partial<TeamUser>>,
    required: true,
  },
  tag: {
    type: String,
    default: 'li',
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: Partial<TeamUser>): void;
}>();

const isAdmin = computed({
  get() {
    return !!props.modelValue.admin;
  },
  set(admin: boolean) {
    emit('update:modelValue', { ...props.modelValue, admin });
  },
});
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  line-height: 1.3;

  & + .item {
    border-top: 1px solid var(--el-border-color-lighter);
  }
}

.actions {
  &:deep {
    .el-switch {
      padding: 0 8px;
    }
  }
}

.user {
  display: flex;
  align-items: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 22px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid white;
    background: var(--el-color-info-light-7);
  }

  .el-image {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 4px;
  }

  &__info {
    margin-left: 8px;
    max-width: 230px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__name {
    font-size: 12px;
    line-height: 1.3;
    display: block;
    color: var(--el-text-color-primary);
  }

  &__email {
    font-size: 11px;
    line-height: 1.3;
    color: var(--el-color-text-secondary);
  }

  &.active {
    &::after {
      background: var(--el-color-primary);
    }
  }
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-color-info-light-7);
  color: var(--el-color-info-dark-2);
  font-size: 16px;
}
</style>
