<template>
  <el-dialog
    :model-value="visible"
    :before-close="closeModal"
    width="480px"
    title="Create new team"
    custom-class="create-team-modal"
    append-to-body
    destroy-on-close
    @closed="resetData"
  >
    <el-form :model="team" label-width="90px" @submit.prevent="createTeam">
      <div class="d-flex gap-20">
        <label class="icon-preview">
          <input
            v-show="false"
            type="file"
            accept="image/png,jpg,jpeg,gif"
            @change="onFileChange"
          />
          <transition name="slide-up">
            <el-image v-if="team.icon?.url" :src="team.icon.url" fit="cover" />
            <el-icon v-else>
              <Picture />
            </el-icon>
          </transition>
        </label>
        <div class="form-fields">
          <el-form-item label="Name">
            <el-input v-model="team.name" maxlength="30" show-word-limit />
            <span v-show="!team.name.trim()" class="invalid-feedback">
              Error
            </span>
          </el-form-item>
          <el-form-item label="Description" style="margin-bottom: 0">
            <el-input
              v-model="team.description"
              type="textarea"
              rows="3"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
        </div>
      </div>
      <span class="dialog-footer">
        <el-button
          :loading="isCreating"
          :disabled="!team.name || isCreating"
          native-type="submit"
          type="primary"
        >
          Create
        </el-button>
      </span>
    </el-form>

    <template #footer>
      <span></span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { Team } from '@/types/Team';
import { computed, inject, reactive, ref } from 'vue';
import { Picture } from '@element-plus/icons-vue';
import { readFileAsDataUrl } from '@/utils/file';
import type { Axios } from 'axios';
import { useTeamsStore } from '@/stores/teams';

const initializeTeam = (partial?: Partial<Team>) =>
  ({
    name: '',
    description: '',
    icon: {
      file: null as File | null,
      url: '',
    },
    ...partial,
  } as Pick<Team, 'name' | 'description' | 'icon'>);

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const api = inject('api') as Axios;

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'created', team: Team): void;
}>();

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(val: boolean) {
    emit('update:modelValue', val);
  },
});

const closeModal = () => emit('update:modelValue', false);

let team = reactive(initializeTeam());

const onFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    team.icon.file = file;
    team.icon.url = await readFileAsDataUrl(file);
  }
};

const resetData = () => {
  team = initializeTeam();
};

const buildFormData = () => {
  const { name, description, icon } = team;
  const formData = new FormData();
  formData.append('team[name]', name.trim());
  formData.append('team[description]', description.trim());
  if (icon.file) formData.append('team[icon]', icon.file);

  return formData;
};

const teamStore = useTeamsStore();
const isCreating = ref(false);

const createTeam = async () => {
  if (isCreating.value) return;

  if (!team.name) return;

  isCreating.value = true;
  api
    .post('/teams', buildFormData())
    .then((res) => {
      const newTeam = res.data as Team;
      teamStore.teams.push(newTeam);
      emit('created', newTeam);
      isCreating.value = false;
      closeModal();
    })
    .catch((error) => {
      console.log('error', error); // eslint-disable-line
      isCreating.value = false;
    });
};
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.icon-preview {
  position: relative;
  flex-basis: 123px;
  height: 123px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  transition: var(--el-transition-box-shadow);
  border: 1px dashed var(--el-input-border-color, var(--el-border-color));
  font-size: 32px;
  color: #8c939d;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    border-color: var(--c-primary);
  }

  .el-image,
  .el-icon {
    position: absolute;
  }
}

.form-fields {
  flex: 1;
}
</style>

<style lang="scss">
.el-dialog {
  &.create-team-modal {
    .el-dialog__body {
      padding: 20px;
    }

    .el-dialog__footer {
      padding: 0;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;

      .el-button {
        min-width: 100px;
      }
    }
  }
}
</style>
