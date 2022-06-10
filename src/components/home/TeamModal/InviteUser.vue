<template>
  <div class="invite-user">
    <el-autocomplete
      v-if="method === 'search'"
      ref="autocompleteRef"
      v-model="search"
      popper-class="list-bordered"
      type="search"
      class="input"
      label="name"
      value-key="email"
      :debounce="500"
      :placeholder="placeholder"
      :prefix-icon="Plus"
      :fetch-suggestions="queryUser"
      :trigger-on-focus="false"
      @select="resetSearch"
    >
      <template #default="{ item }">
        <UserItem :model-value="item" class="members__item" tag="div">
          <template #actions>
            <el-button
              type="primary"
              size="small"
              plain
              @mousedown.prevent.stop="addUser(item)"
            >
              <el-icon><Plus /></el-icon>
            </el-button>
          </template>
        </UserItem>
      </template>
    </el-autocomplete>
    <form
      v-if="method === 'emails'"
      class="input-emails"
      @submit.prevent="parseEmails"
    >
      <el-input
        ref="inputRef"
        v-model="emailsString"
        :placeholder="placeholder"
        class="input"
      />
      <el-button plain native-type="submit">
        <el-icon><Plus /></el-icon>
      </el-button>
    </form>
    <el-select
      v-model="method"
      popper-class="font-size-normal"
      @change="focusOnInput"
    >
      <el-option label="Search" value="search" />
      <el-option label="Emails" value="emails" />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import type { Axios } from 'axios';
import { useTeamsStore } from '@/stores/teams';
import { storeToRefs } from 'pinia';
import { computed, inject, nextTick, ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import type { AutocompleteInstance, InputInstance } from 'element-plus';
import type { User, TeamUser } from '@/types/User';
import UserItem from './UserItem.vue';

const emit = defineEmits<{ (e: 'submit', users: Partial<TeamUser>[]): void }>();

const { team } = storeToRefs(useTeamsStore());

const api = inject('api') as Axios;

const autocompleteRef = ref<AutocompleteInstance | null>(null);
const inputRef = ref<InputInstance | null>(null);
const users = ref<User[]>([]);
const method = ref('search');
const search = ref('');
const emailsString = ref('');
const addedUsers = ref<Partial<TeamUser>[]>([]);

const placeholder = computed(() => {
  return method.value === 'search'
    ? 'Find email or name'
    : 'Enter emails (separated by comma)';
});

const focusOnInput = async () => {
  await nextTick();
  if (method.value === 'search') {
    autocompleteRef.value?.focus();
  } else if (method.value === 'emails') {
    inputRef.value?.focus();
  }
};

const resetSearch = async () => {
  if (method.value === 'search') {
    search.value = '';
  } else if (method.value === 'emails') {
    emailsString.value = '';
  }

  await nextTick();
  focusOnInput();
};

const queryUser = async (q: string, cb: (users: User[]) => void) => {
  const params = { q, team_id: team.value?.id ?? '' };
  const { data } = await api.get(`/users`, { params });
  users.value = data
    .filter((user: User) =>
      addedUsers.value.every(({ email }) => user.email !== email)
    )
    .map((user: User) => ({ ...user, value: user.id }));
  cb(users.value);
};

const parseEmails = () => {
  if (!emailsString.value.trim()) return;

  const EMAIL_REGX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const validEmails = emailsString.value
    .split(',')
    .reduce((acc: Partial<TeamUser>[], val: string) => {
      const email = val.trim();
      if (EMAIL_REGX.test(email)) acc.push({ email, admin: false });
      return acc;
    }, []);

  addedUsers.value.push(...validEmails);
  emit('submit', validEmails);
  resetSearch();
};

const addUser = (user: TeamUser) => {
  addedUsers.value.push(user);
  emit('submit', [{ ...user, admin: false }]);
  resetSearch();
};
</script>

<style lang="scss" scoped>
.invite-user {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  width: 100%;
  position: relative;

  &:deep {
    .input {
      flex: 1;

      .el-input__wrapper {
        padding-left: 90px;
      }
    }
  }
}

.el-select {
  width: 85px;
  position: absolute;

  &:deep {
    .el-input__wrapper {
      box-shadow: 0 0 0 1px transparent inset;
      background-color: transparent;
      border-right: 1px solid var(--el-input-border-color);
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}

.input-emails {
  position: relative;
  width: 100%;

  .el-button {
    padding: 8px 12px;
    position: absolute;
    right: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background: transparent;
    border-color: transparent;
    border-left-color: var(--el-border-color);
  }
}
</style>
