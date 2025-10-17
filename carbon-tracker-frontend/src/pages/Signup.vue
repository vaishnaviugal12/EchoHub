<template>
  <v-container fluid class="d-flex align-center justify-center" style="min-height: 100vh; background: #f5f5f5;">
    <v-card
      class="pa-8"
      max-width="500"
      elevation="10"
      rounded="xl"
    >
      <v-card-title class="text-h4 text-center mb-6">Create Account ✨</v-card-title>

      <v-alert
        v-if="error"
        type="error"
        dense
        variant="tonal"
        class="mb-4"
      >
        {{ error }}
      </v-alert>

      <v-form @submit.prevent="handleSignup">
        <v-text-field
          v-model="username"
          label="Username"
          variant="outlined"
          required
          density="comfortable"
          class="mb-4"
        />
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
          Sign Up
        </v-btn>
      </v-form>

      <div class="text-center mt-4">
        <span class="text-body-2">
          Already have an account?
          <router-link to="/login" class="text-green-darken-2 font-weight-medium">Login</router-link>
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

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const userStore = useUserStore()

const handleSignup = async () => {
  error.value = ''
  try {
    const res = await api.post('/user/signup', {
      username: username.value,
      email: email.value,
      password: password.value,
    })
    if (res.status === 201) {
      // Fetch user from backend (using cookie)
      await userStore.fetchUser()
      router.push('/dashboard') // redirect after signup
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Something went wrong'
  }
}
</script>


<style scoped>
.v-card {
  width: 90%;
  max-width: 500px;
}
</style>
