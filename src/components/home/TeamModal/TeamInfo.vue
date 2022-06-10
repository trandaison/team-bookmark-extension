<template>
  <el-main>
    <div class="team">
      <el-image :src="team?.icon.url" fit="cover" class="team-icon" />
      <div class="team__info">
        <h1>{{ team?.name }}</h1>
        <p>{{ team?.description }}</p>
        <p>{{ createdTime }}</p>
      </div>
    </div>
    <div class="users">
      <section v-if="team?.owner">
        <h2 class="section-title">Owner</h2>
        <div class="img-stack">
          <el-image
            :src="team.owner.avatar.url"
            :alt="team.owner.name"
            :title="team.owner.name"
            fit="cover"
            class="user-avatar"
          />
        </div>
      </section>
      <section v-if="admins.length">
        <h2 class="section-title">Admin</h2>
        <div class="img-stack">
          <el-image
            v-for="user in firstAdmins.items"
            :key="user.id"
            :src="user?.avatar.url"
            :alt="user.name"
            :title="user.name"
            fit="cover"
            class="user-avatar"
          />
          <el-button
            v-if="firstAdmins.moreCount"
            class="user-avatar"
            type="primary"
            plain
            @click="emit('change-tab', 1)"
          >
            {{ `+${firstAdmins.moreCount}` }}
          </el-button>
        </div>
      </section>
      <section v-if="members.length">
        <h2 class="section-title">Members</h2>
        <div class="img-stack">
          <el-image
            v-for="user in firstMembers.items"
            :key="user.id"
            :src="user?.avatar.url"
            :alt="user.name"
            :title="user.name"
            fit="cover"
            class="user-avatar"
          />
          <el-button
            v-if="firstMembers.moreCount"
            class="user-avatar"
            type="primary"
            plain
            @click="emit('change-tab', 1)"
          >
            {{ `+${firstMembers.moreCount}` }}
          </el-button>
        </div>
      </section>
    </div>
    <div class="invitation-url">
      <h2 class="section-title">Invitation URL</h2>
      <el-link :href="invitationUrl" target="_blank" type="primary">
        {{ invitationUrl }}
      </el-link>
      &nbsp;<BtnCopy :text="invitationUrl" />
    </div>
  </el-main>
</template>

<script lang="ts" setup>
import { useTeamsStore } from '@/stores/teams';
import type { TeamUser } from '@/types/User';
import type { Axios } from 'axios';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { computed, inject, ref } from 'vue';
import BtnCopy from '../../common/BtnCopy.vue';

const emit = defineEmits<{ (e: 'change-tab', value: number): void }>();

const { team } = storeToRefs(useTeamsStore());

const createdTime = computed(() => {
  if (!team.value) return;

  return dayjs(team.value?.created_at).format('Since DD MMM, YYYY');
});

const members = ref<TeamUser[]>([]);
const admins = ref<TeamUser[]>([]);

const invitationUrl = computed(() => {
  return `https://teambookmark.io/teams/${team.value?.id}`;
});

const firstAdmins = computed(() => ({
  items: admins.value.length <= 5 ? admins.value : admins.value.slice(0, 4),
  moreCount: admins.value.length <= 5 ? 0 : admins.value.length - 4,
}));

const firstMembers = computed(() => ({
  items: members.value.length <= 5 ? members.value : members.value.slice(0, 4),
  moreCount: members.value.length <= 5 ? 0 : members.value.length - 4,
}));

const api = inject('api') as Axios;

const fetchUser = async () => {
  if (!team.value) {
    members.value = [];
    admins.value = [];
    return;
  }

  const params = { team_id: team.value?.id ?? '' };
  const { data } = await api.get(`/teams/${team.value.id}/users`, { params });
  members.value = data.filter((user: TeamUser) => !user.admin);
  admins.value = data.filter(
    (user: TeamUser) => user.admin && user.id !== team.value?.owner?.id
  );
};

await fetchUser();
</script>

<style lang="scss" scoped>
.el-main {
  --el-font-size-base: 12px;
  width: 100%;
  padding: 0 20px 20px;
  font-size: var(--el-font-size-base);
}

.team {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;

  &__info {
    display: flex;
    flex-direction: column;
    margin-left: 12px;

    h1 {
      font-weight: bold;
    }
  }
}

.section-title {
  font-size: 14px;
  line-height: 1.5;
  font-weight: bold;
  margin: 20px 0 10px;
}

.team-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  flex-shrink: 0;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-left: -20px;
  border: 2px solid #fff;

  &.el-button {
    z-index: 2;
  }
}

.img-stack {
  padding-left: 20px;
  display: flex;
}

.users {
  display: flex;
  justify-content: space-between;
}

.invitation-url {
  .section-title {
    margin-bottom: 0;
  }

  &:deep {
    .el-link {
      &__inner {
        white-space: nowrap;
        max-width: 353px;
        overflow: hidden;
        display: block;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
