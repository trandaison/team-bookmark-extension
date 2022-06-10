<template>
  <el-main>
    <el-form
      :model="form"
      :disabled="isSaving"
      label-width="80px"
      @submit.prevent="onSubmit"
    >
      <el-form-item label="Name">
        <el-input v-model="form.name" maxlength="30" />
        <span v-show="nameError" class="invalid-feedback">{{ nameError }}</span>
      </el-form-item>
      <el-form-item label="Description">
        <el-input
          v-model="form.description"
          type="textarea"
          rows="3"
          maxlength="100"
        />
      </el-form-item>
      <el-form-item label="Icon">
        <label class="icon-preview">
          <input
            v-show="false"
            type="file"
            accept="image/png,jpg,jpeg,gif"
            @change="onFileChange"
          />
          <transition name="slide-up">
            <el-image v-if="form.icon?.url" :src="form.icon.url" fit="cover" />
            <el-icon v-else>
              <Picture />
            </el-icon>
          </transition>
        </label>
      </el-form-item>

      <div class="d-flex justify-content-end">
        <el-button
          :loading="isSaving"
          :disabled="nameError || isSaving"
          native-type="submit"
          type="primary"
        >
          Save
        </el-button>
      </div>
    </el-form>
  </el-main>
</template>

<script lang="ts" setup>
import { inject, ref, watchEffect } from 'vue';
import { Picture } from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';
import type { Team } from '@/types/Team';
import { useTeamsStore } from '@/stores/teams';
import { readFileAsDataUrl } from '@/utils/file';
import type { Axios } from 'axios';
import { ElMessage } from 'element-plus';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const api = inject('api') as Axios;

const teamsStore = useTeamsStore();
const { team } = storeToRefs(teamsStore);

const validationSchema = yup.object({
  name: yup.string().required(),
});

const { handleSubmit } = useForm({ validationSchema });

const { errorMessage: nameError } = useField('name');

const form = ref<Pick<Team, 'name' | 'description' | 'icon'>>({
  name: '',
  description: '',
  icon: {
    url: '',
    file: null,
  },
});
const isSaving = ref(false);

watchEffect(() => {
  if (team.value) {
    form.value.name = team.value.name;
    form.value.description = team.value.description;
    form.value.icon = {
      url: team.value.icon?.url,
      file: null,
    };
  }
});

const onFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    form.value.icon.file = file;
    form.value.icon.url = await readFileAsDataUrl(file);
  }
};

const buildFormData = () => {
  const { name, description, icon } = form.value;
  const formData = new FormData();
  formData.append('team[name]', name.trim());
  formData.append('team[description]', description.trim());
  if (icon.file) formData.append('team[icon]', icon.file);

  return formData;
};

const onSubmit = () => {
  if (!team.value || isSaving.value) return;

  isSaving.value = true;
  api
    .put(`/teams/${team.value.id}`, buildFormData())
    .then(({ data }) => {
      teamsStore.$patch({ team: { ...team.value, ...data } });
    })
    .catch((error) => {
      const message = error.response?.data?.message ?? error.message ?? error;
      ElMessage.error(message);
    })
    .finally(() => {
      isSaving.value = false;
    });
};
</script>

<style lang="scss" scoped>
.el-main {
  --el-font-size-base: 12px;
  width: 100%;
  padding: 0 20px 20px;
  font-size: var(--el-font-size-base);
}

.icon-preview {
  position: relative;
  flex-basis: 100px;
  height: 100px;
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

  .el-image {
    width: 100%;
    height: 100%;
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
