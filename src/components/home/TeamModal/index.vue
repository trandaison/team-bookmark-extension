<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-dialog
    v-model="visible"
    :title="modalTitle"
    width="480px"
    custom-class="team-modal"
    append-to-body
    destroy-on-close
  >
    <el-menu :default-active="index" collapse @select="setIndex">
      <el-menu-item index="1">
        <el-icon><Plus /></el-icon>
        <template #title>Invite user</template>
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><InfoFilled /></el-icon>
        <template #title>Details</template>
      </el-menu-item>
      <el-menu-item index="3">
        <el-icon><SetUp /></el-icon>
        <template #title>Edit information</template>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><TurnOff /></el-icon>
        <template #title>Leave team</template>
      </el-menu-item>
      <el-menu-item index="5" class="danger">
        <el-icon><Delete /></el-icon>
        <template #title>Delete team</template>
      </el-menu-item>
    </el-menu>
    <el-container>
      <Transition :name="transitionName" mode="out-in">
        <component
          :is="currentView"
          :key="index"
          class="team-modal-view"
          @change-tab="setIndex"
        />
      </Transition>
    </el-container>

    <template #footer>
      <span class="dialog-footer"></span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  Plus,
  InfoFilled,
  SetUp,
  TurnOff,
  Delete,
} from '@element-plus/icons-vue';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import MemberList from './MemberList.vue';
import TeamInfo from './TeamInfo.vue';
import EditTeam from './EditTeam.vue';
import LeaveTeam from './LeaveTeam.vue';
import DeleteTeam from './DeleteTeam.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(val: boolean) {
    emit('update:modelValue', val);
  },
});

const route = useRoute();
const index = ref(route.hash.replace('#', '') || '1');
const transitionName = ref('slide-up');

watch(index, (val, prevVal) => {
  transitionName.value = val > prevVal ? 'slide-up' : 'slide-down';
});

const currentView = computed(() => {
  switch (index.value) {
    case '1':
      return MemberList;
    case '2':
      return TeamInfo;
    case '3':
      return EditTeam;
    case '4':
      return LeaveTeam;
    case '5':
      return DeleteTeam;
    default:
      return TeamInfo;
  }
});

const modalTitle = computed(() => {
  switch (index.value) {
    case '1':
      return 'Members';
    case '2':
      return 'Details';
    case '3':
      return 'Edit Information';
    case '4':
      return 'Leave Team';
    case '5':
      return 'Delete Team';
    default:
      return 'Details';
  }
});

const setIndex = (val: string) => {
  index.value = String(val);
};
</script>

<style lang="scss">
.team-modal {
  display: flex;
  flex-direction: column;
  height: 400px;

  .el-dialog__body {
    flex: 1;
    display: flex;
    padding: 10px 0 0;
  }

  .el-dialog__footer {
    padding: 0;
  }

  .el-container {
    position: relative;
  }

  .team-modal-view {
    position: absolute;
  }

  .el-menu-item {
    &.is-active {
      background-color: var(--el-color-primary-light-8);
    }

    &.danger {
      color: var(--el-color-danger-dark-2);

      &.is-active,
      &:hover {
        background-color: var(--el-color-danger-light-8);
      }
    }
  }
}
</style>
