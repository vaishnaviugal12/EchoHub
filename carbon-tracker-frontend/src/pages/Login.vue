<template>
  <v-container fluid class="d-flex align-center justify-center" style="min-height: 100vh; background: #f5f5f5;">
    <v-card
      class="pa-8"
      max-width="500"
      elevation="10"
      rounded="xl"
    >
      <v-card-title class="text-h4 text-center mb-6">Welcome Back 👋</v-card-title>

      <v-alert
        v-if="error"
        type="error"
        dense
        variant="tonal"
        class="mb-4"
      >
        {{ error }}
      </v-alert>

      <v-form @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          variant="outlined"
          required
          density="comfortable"
          class="mb-4"
        />
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          variant="outlined"
          required
          density="comfortable"
          class="mb-6"
        />
        <v-btn
          type="submit"
          color="green-darken-1"
          block
          size="large"
          class="text-white"
        >
          Login
        </v-btn>
      </v-form>

      <div class="text-center mt-4">
        <span class="text-body-2">
          Don’t have an account?
          <router-link to="/signup" class="text-green-darken-2 font-weight-medium">Sign up</router-link>
        </span>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { useUserStore } from '@/stores/user'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  error.value = ''
  try {
    const res = await api.post('/user/login', {
      email: email.value,
      password: password.value,
    }, { withCredentials: true })

    if (res.status === 200) {
      await userStore.fetchUser()  // fetch profile info

      // 🔹 Redirect based on role
      if (userStore.user?.role === 'Admin') {
        router.push('/admin/leader-requests') // admin dashboard
      } else {
        router.push('/') // normal user homepage
      }
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Login failed'
  }
}
</script>


<style scoped>
.v-card {
  width: 90%;
  max-width: 500px;
}
</style>
