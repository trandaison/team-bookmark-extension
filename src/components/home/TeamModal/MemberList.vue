<template>
  <el-main>
    <InviteUser @submit="addUserToList" />

    <div class="card">
      <div class="controls">
        <el-input
          v-model="search"
          type="search"
          placeholder="Find user"
          style="width: 100%"
          :suffix-icon="isSearching ? Loading : Search"
          @input="debounceSearch"
        />
        <Transition name="fade">
          <el-button
            v-if="newUsers.length"
            type="primary"
            :loading="isSaving"
            @click="createTeamUsers"
          >
            Save
          </el-button>
        </Transition>
      </div>

      <div class="members">
        <div class="members__header">
          <span class="name">Name</span>
          <span class="role">Admin</span>
        </div>
        <ul v-if="hasUsers" class="members__list">
          <template v-if="!search">
            <UserItem
              v-for="(user, index) in newUsers"
              :key="user.email"
              v-model="newUsers[index]"
              class="members__item members__item--new"
            />
            <li v-if="newUsers.length" class="members__item--divider"></li>
          </template>
          <UserItem
            v-for="(user, index) in users"
            :key="user.id"
            v-model="users[index]"
            class="members__item"
          />
        </ul>
        <el-empty v-else description="No users" />
      </div>
    </div>
  </el-main>
</template>

<script lang="ts" setup>
import { useTeamsStore } from '@/stores/teams';
import { storeToRefs } from 'pinia';
import { computed, inject, nextTick, ref } from 'vue';
import { Search, Loading } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { TeamUser } from '@/types/User';
import type { Axios } from 'axios';
import UserItem from './UserItem.vue';
import InviteUser from './InviteUser.vue';
import { debounce } from 'lodash';

const { team } = storeToRefs(useTeamsStore());

const api = inject('api') as Axios;

const users = ref<TeamUser[]>([]);
const newUsers = ref<Partial<TeamUser>[]>([]);
const search = ref('');
const isSearching = ref(false);
const isSaving = ref(false);

const hasUsers = computed(() => {
  if (search.value) {
    return users.value.length > 0;
  }

  return users.value.length > 0 || newUsers.value.length > 0;
});

const fetchUser = async () => {
  if (isSearching.value) return;

  if (!team.value) {
    users.value = [];
    return;
  }

  isSearching.value = true;
  const params = { q: search.value, team_id: team.value?.id ?? '' };
  const { data } = await api.get(`/teams/${team.value.id}/users`, { params });
  users.value = data;
  isSearching.value = false;
};

const debounceSearch = debounce(fetchUser, 500);

await fetchUser();

const addUserToList = (data: Partial<TeamUser>[]) => {
  const uniqUsers = data.filter((user) =>
    [...newUsers.value, ...users.value].every((u) => u.email !== user.email)
  );
  newUsers.value.push(...uniqUsers);
};

const createTeamUsers = () => {
  isSaving.value = true;

  api
    .post(`/teams/${team.value?.id}/users`, {
      users: newUsers.value,
    })
    .then(async ({ data }) => {
      search.value = '';
      newUsers.value = [];
      users.value = data;
      await nextTick();
      isSearching.value = false;
      isSaving.value = false;
    })
    .catch((error) => {
      isSearching.value = false;
      isSaving.value = false;
      const message = error.response?.data?.message ?? error.message ?? error;
      ElMessage.error(message);
    });
};
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
}

.mt-sm {
  margin-top: 8px;
}

.el-main {
  --el-font-size-base: 12px;
  width: 100%;
  padding: 0 20px 20px;
  font-size: var(--el-font-size-base);
}

.controls {
  display: flex;
  gap: 10px;

  .el-input {
    flex-basis: 264px;
  }

  .el-button {
    min-width: 80px;
    flex: 1;
  }
}

.members {
  &__header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .name {
      padding-top: 8px;
      padding-left: 50px;
      font-weight: bold;
    }

    .role {
      font-weight: bold;
      padding-top: 8px;
      padding-right: 24px;
    }
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    height: 192px;
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__item {
    &--divider {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        background-color: var(--el-color-danger);
      }

      &::after {
        content: 'NEW (Unsaved)';
        font-size: 10px;
        color: var(--el-color-danger);
        position: relative;
        padding: 0 4px;
        background: #fff;
      }
    }

    &:hover {
      background-color: var(--el-color-primary-light-9);
    }
  }
}

.el-empty {
  --el-empty-padding: 32px 0;
  --el-empty-image-width: 80px;
}
</style>
