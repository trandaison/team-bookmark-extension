<script lang="ts" setup>
import { useTeamsStore } from '@/stores/teams';
import { ArrowLeftBold, FolderAdd, DocumentAdd } from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';
import { ref, type PropType } from 'vue';
import { useRouter } from 'vue-router';
import HeaderBarToggleBookmark from './HeaderBarToggleBookmark.vue';
import { useFolderStackStore } from '@/stores/folderStack';
import HeaderBarViewMode from './HeaderBarViewMode.vue';
import UserMenu from './UserMenu.vue';
import TeamModal from './TeamModal/index.vue';

enum ActionEnum {
  addFolder,
  addNote,
  addBookmark,
  editBookmark,
}

const props = defineProps({
  mainViewRef: {
    type: Function as PropType<() => any>,
    required: true,
  },
});

const router = useRouter();

const folderStack = useFolderStackStore();

const teamsStore = useTeamsStore();
const { team } = storeToRefs(teamsStore);

const teamModalVisible = ref(false);

const actionHandler = (action: ActionEnum) => {
  switch (action) {
    case ActionEnum.addBookmark:
      router.push({ name: 'bookmarks-new' });
      break;
    case ActionEnum.editBookmark:
      break;
    case ActionEnum.addFolder:
      props.mainViewRef().addNewFolder();
      break;
    case ActionEnum.addNote:
      break;
    default:
      break;
  }
};
</script>

<template>
  <el-header>
    <div class="header-item">
      <el-link
        class="link-back"
        :underline="false"
        :disabled="folderStack.isEmpty"
        @click="folderStack.pop"
      >
        <el-icon>
          <ArrowLeftBold />
        </el-icon>
      </el-link>
    </div>

    <div v-if="team" class="header-item">
      <el-button link @click="teamModalVisible = true">
        <el-image :src="team.icon.url" fit="cover" />
        <span class="current-team-name">{{ team.name }}</span>
      </el-button>
      <TeamModal v-model="teamModalVisible" />
    </div>

    <div class="spacer"></div>
    <div id="action-more" class="header-item"></div>
    <el-radio-group class="header-item" @change="actionHandler">
      <el-radio-button :label="ActionEnum.addFolder">
        <div class="header-item__tool">
          <el-icon>
            <FolderAdd />
          </el-icon>
        </div>
      </el-radio-button>
      <el-radio-button :label="ActionEnum.addNote">
        <div class="header-item__tool">
          <el-icon>
            <DocumentAdd />
          </el-icon>
        </div>
      </el-radio-button>
      <el-radio-button :label="ActionEnum.addBookmark">
        <HeaderBarToggleBookmark />
      </el-radio-button>
    </el-radio-group>

    <HeaderBarViewMode class="header-item" />

    <div class="header-item">
      <UserMenu />
    </div>
  </el-header>
</template>

<style scoped lang="scss">
.el-header {
  position: sticky;
  z-index: 10;
  background-color: rgba(240, 240, 240, 30%);
  border-bottom: 1px solid var(--c-gray-2);
  top: 0;
  backdrop-filter: blur(5px);
  height: auto;
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-item {
  margin-right: 8px;

  &:deep {
    .el-tooltip {
      &__trigger {
        display: flex;
        align-items: center;
      }
    }

    .header-item__tool {
      font-size: 20px;
      display: flex;
      align-items: center;
    }
  }
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.el-image {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 4px;
}

:deep {
  .el-radio-button {
    &__inner {
      padding: 4px 8px;
    }
  }
}

.spacer {
  flex: 1;
}

.link-back {
  padding: 8px;
}

.current-team-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
