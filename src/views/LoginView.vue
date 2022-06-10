<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import {
  createAccessToken,
  type LoginCredentials,
} from '@/services/authService';
import { useCurrentUser } from '@/composables/currentUser';

const router = useRouter();

const currentUser = useCurrentUser();

const credentials = reactive({
  email: 'sontd.it@gmail.com',
  password: 'Aa@123456',
} as LoginCredentials);

const message = ref('');
const isError = ref(false);
const isSubmitting = ref(false);

const isValid = computed(() => {
  return credentials.email.length > 0 && credentials.password.length > 0;
});

const login = () =>
  new Promise((resolve, reject) => {
    createAccessToken(credentials)
      .then(resolve)
      .catch((error) => {
        reject(error);
      });
  });

const handleSubmit = async () => {
  if (!isValid.value) {
    message.value = 'Invalid email or password!';
    isError.value = true;
    return;
  }
  message.value = '';
  isError.value = false;
  isSubmitting.value = true;
  try {
    await login();
    await currentUser.fetchMe();
    router.push('/');
  } catch (error: any) {
    message.value = error.message;
    isError.value = true;
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="container">
    <el-row :gutter="20" class="align-items-center">
      <el-col :xs="18" :sm="12" :md="10" :lg="6" class="mx-auto">
        <el-form :model="credentials" @submit.prevent="handleSubmit">
          <div class="text-center mb-3">
            <h1>Login</h1>
          </div>

          <el-alert
            v-if="message"
            :title="message"
            :closable="false"
            type="error"
          />

          <el-form-item>
            <el-input
              v-model="credentials.email"
              class="m-2"
              placeholder="Email"
              autofocus
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="credentials.password"
              class="m-2"
              placeholder="Password"
              type="password"
              show-password
              :prefix-icon="Lock"
            />
            <el-link
              to="/fotgot-password"
              type="primary"
              :underline="false"
              class="font-size-normal"
            >
              Forgot password?
            </el-link>
          </el-form-item>
          <el-form-item>
            <el-button
              native-type="submit"
              type="primary"
              :loading="isSubmitting"
            >
              Sign in
            </el-button>
          </el-form-item>
          <div
            class="d-flex align-items-center justify-content-center font-size-normal"
          >
            Not registered?&nbsp;
            <el-link
              to="/register"
              type="primary"
              :underline="false"
              class="font-size-normal"
            >
              Sign up
            </el-link>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 400px;
  min-height: 300px;
}

.el-row {
  min-height: inherit;
}

.el-button {
  margin: 0 auto;
}

.el-alert {
  margin-bottom: 1.5rem;
}
</style>
