<template>
  <el-dropdown
    v-if="user"
    trigger="click"
    @command="userCommand"
    @visible-change="onVisibleChange"
  >
    <el-image :src="user.avatar.url" fit="cover" class="cursor-pointer" />

    <template #dropdown>
      <div class="user-card">
        <div class="user">
          <el-image :src="user.avatar.url" fit="cover" class="user__img" />
          <div class="user__info">
            <strong>{{ user.name }}</strong>
            <span>{{ user.email }}</span>
          </div>
        </div>
        <div class="teams">
          <UserMenuTeams />
        </div>
        <div class="footer">
          <el-button @click="logout" :icon="SwitchButton">Logout</el-button>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { SwitchButton } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';
import { logout } from '@/services/authService';
import UserMenuTeams from './UserMenuTeams.vue';

const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const visible = ref(false);

const userCommand = async (command: string) => {
  switch (command) {
    case 'logout':
      logout();
      break;
    case 'settings':
      router.push({ name: 'settings' });
      break;
    default:
      break;
  }
};

const onVisibleChange = (isVisible: boolean) => {
  visible.value = isVisible;
};
</script>

<style lang="scss" scoped>
.el-icon,
.el-image {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 4px;
}

.cursor-pointer {
  cursor: pointer;
}

.user-card {
  min-width: 260px;
  padding: 8px;
}

.user {
  display: flex;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  &__img {
    width: 38px;
    height: 38px;
    margin-right: 8px;
  }

  &__info {
    display: flex;
    flex-direction: column;

    strong {
      font-size: 14px;
      font-weight: 500;
    }

    span {
      color: var(--el-color-info);
    }
  }
}

.teams {
  &:deep {
    .el-dropdown-menu {
      &__item {
        padding: 6px;
      }
    }
  }
}

.footer {
  padding-top: 8px;
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--el-border-color-lighter);
  white-space: nowrap;
}
</style>
