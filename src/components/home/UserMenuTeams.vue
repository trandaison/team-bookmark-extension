<template>
  <div>
    <el-dropdown-menu class="team-menu team-menu--add">
      <el-dropdown-item :icon="ElementPlus" @click="openCreateTeamModal">
        Create new team
      </el-dropdown-item>
    </el-dropdown-menu>
    <el-dropdown-menu class="team-menu team-menu--list">
      <el-dropdown-item
        v-for="_team in teams"
        :key="_team.id"
        :command="_team.id"
        :disabled="team && _team.id === team.id"
        @click="selectTeam(_team.id, true)"
      >
        <el-image :src="_team.icon.url" fit="cover" />
        {{ _team.name }}
      </el-dropdown-item>
    </el-dropdown-menu>

    <CreateTeamModal
      v-model="newTeamModalVisible"
      @created="selectTeam($event.id, true)"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Axios } from 'axios';
import { storeToRefs } from 'pinia';
import { inject, onMounted, ref } from 'vue';
import { ElementPlus } from '@element-plus/icons-vue';
import { useTeamsStore } from '@/stores/teams';
import { useFolderStackStore } from '@/stores/folderStack';
import CreateTeamModal from './CreateTeamModal.vue';

const teamsStore = useTeamsStore();
const { team, teams } = storeToRefs(teamsStore);

const folderStack = useFolderStackStore();

const api = inject('api') as Axios;

await api.get('/teams').then((res) => {
  teams.value = res.data.data.items;
});

const newTeamModalVisible = ref(false);

onMounted(() => {
  if (!teams.value.length) return;

  const localTeamId = localStorage.getItem('team_id');
  let [{ id: teamId }] = teams.value;
  if (localTeamId) teamId = Number(localTeamId);
  selectTeam(teamId);
});

const selectTeam = (teamId: number, clearStack = false) => {
  if (!teamId) return;

  const activeTeam = teams.value.find(({ id }) => id === Number(teamId));
  if (activeTeam) {
    team.value = activeTeam;
    localStorage.setItem('team_id', String(teamId));
    if (clearStack) folderStack.clear();
  }
};

const openCreateTeamModal = () => {
  newTeamModalVisible.value = true;
};
</script>

<style lang="scss" scoped>
.el-image {
  border-radius: 50%;
  margin-right: 8px;
}

.team-menu {
  &--add {
    border-bottom: 1px solid var(--el-border-color-lighter) !important;
  }

  &--list {
    max-height: 210px;
    overflow-y: auto;
  }
}
</style>

<style lang="scss">
$team-icon-size: 28px;

.team-menu {
  .el-image,
  .el-icon {
    width: $team-icon-size;
    height: $team-icon-size;
    font-size: $team-icon-size;
    border-radius: 50%;
    margin-right: 8px;
  }
}
</style>
