<template>
  <v-app-bar
    app
    color="green-darken-1"
    dark
    elevation="2"
    class="navbar"
  >
    <!-- Logo / Title -->
    <v-toolbar-title class="font-weight-bold text-h6" @click="router.push('/')">
      🌿 EchoHub
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Center Nav Links -->
    <div class="nav-links d-none d-md-flex">
      <v-btn variant="text" class="nav-btn" @click="router.push('/')">Home</v-btn>
      <v-btn variant="text" class="nav-btn" @click="goToFeatures">Features</v-btn>
      <v-btn variant="text" class="nav-btn" @click="scrollTo('howitworks')">How It Works</v-btn>

      <!-- ✅ Updated: Go to /about route instead of scroll -->
      <v-btn variant="text" class="nav-btn" @click="goToAbout">About</v-btn>

      <v-btn variant="text" class="nav-btn" @click="scrollTo('contact')">Contact</v-btn>
    </div>

    <v-spacer></v-spacer>

    <!-- Auth Buttons / Profile -->
    <template v-if="!userStore.user">
      <v-btn to="/login" variant="text" class="ml-2">Login</v-btn>
      <v-btn to="/signup" variant="outlined" class="ml-2 text-white" rounded>Signup</v-btn>
    </template>

    <template v-else>
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-avatar size="38" color="white" class="elevation-2">
              <v-icon color="green-darken-2">mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title class="text-h6">{{ userStore.user.username }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="handleLogout" class="hoverable">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import api from '../api'

const userStore = useUserStore()
const router = useRouter()

// Smooth scroll to section
const scrollTo = (id) => {
  const section = document.getElementById(id)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  } else {
    router.push(`/#${id}`)
  }
}

// 👉 Navigate to /features
const goToFeatures = () => {
  router.push('/features')
}

// ✅ Navigate to /about
const goToAbout = () => {
  router.push('/about')
}

// Handle logout
const handleLogout = async () => {
  try {
    await api.post('/user/logout', {}, { withCredentials: true })
    userStore.logoutUser()
    router.push('/login')
  } catch (err) {
    console.error('Logout failed', err)
  }
}
</script>

<style scoped>
.navbar {
  backdrop-filter: blur(8px);
}

.nav-links {
  gap: 1rem;
}

.nav-btn {
  text-transform: none;
  font-size: 1rem;
  transition: color 0.2s ease;
}

.nav-btn:hover {
  color: #c8e6c9; /* light green hover */
}

.hoverable {
  cursor: pointer;
}
</style>
