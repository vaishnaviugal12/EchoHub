<template>
  <v-app>
    <!-- 🌿 Themed Navbar -->
    <v-app-bar app color="green-darken-2" dark elevation="2" class="px-6">
      <v-toolbar-title class="font-weight-bold text-h5 cursor-pointer" @click="router.push('/')">
        🌿 EchoHub
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="d-flex align-center">
        <v-btn variant="text" class="nav-btn" @click="router.push('/')">Home</v-btn>
        <v-btn variant="text" class="nav-btn" @click="router.push('/features')">Features</v-btn>
        <v-btn variant="text" class="nav-btn active">About</v-btn>
        <v-btn variant="text" class="nav-btn" @click="router.push('/community')">Community</v-btn>
        <v-btn variant="outlined" color="white" rounded @click="router.push('/login')">
          Login
        </v-btn>
      </div>
    </v-app-bar>

    <!-- 🌱 Main Content -->
    <v-container class="py-12 mt-10 about-container">
      <!-- Header -->
      <v-row justify="center" class="text-center mb-8">
        <v-col cols="12" md="8">
          <h1 class="text-h4 font-weight-bold mb-3 text-green-darken-2">
            About EchoHub
          </h1>
          <p class="text-body-1 text-grey-darken-2">
            EchoHub is an eco-awareness and community-driven platform built to inspire and empower people
            to take sustainable actions in their everyday lives. Our goal is to create a connected network
            of individuals and communities working together for a greener tomorrow.
          </p>
        </v-col>
      </v-row>

      <!-- Vision, Mission, Goals -->
      <v-row justify="center" align="stretch" class="px-4">
        <v-col
          v-for="(card, i) in infoCards"
          :key="i"
          cols="12"
          md="4"
          class="d-flex"
        >
          <v-card elevation="4" class="pa-6 about-card">
            <v-icon size="42" color="green-darken-2" class="mb-3">{{ card.icon }}</v-icon>
            <h3 class="text-h6 font-weight-bold mb-2">{{ card.title }}</h3>
            <p class="text-body-2 text-grey-darken-2">
              {{ card.text }}
            </p>
          </v-card>
        </v-col>
      </v-row>

      <!-- Call to Action -->
      <v-row justify="center" class="text-center mt-12">
        <v-col cols="12" md="8">
          <v-card elevation="3" class="pa-8 join-card">
            <h2 class="text-h6 font-weight-bold mb-3 text-green-darken-3">
              Join Our Eco Community
            </h2>
            <p class="text-body-2 text-grey-darken-2 mb-4">
              Together, we can make an impact. Connect with like-minded individuals,
              share ideas, and take collective steps toward sustainability.
            </p>
            <v-btn color="green-darken-2" class="text-white" rounded @click="router.push('/community')">
              Get Involved
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 🌍 Footer -->
    <v-footer padless color="green-darken-3" class="text-white py-6 mt-10">
      <v-col class="text-center">
        © 2025 EchoHub — Building a Greener Tomorrow 🌱
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const infoCards = [
  {
    title: 'Our Vision',
    text: 'To create a digital space where individuals can learn, act, and inspire each other to lead sustainable lives that positively impact the planet.',
    icon: 'mdi-earth',
  },
  {
    title: 'Our Mission',
    text: 'To promote awareness and actionable insights through community engagement, carbon tracking, and educational initiatives.',
    icon: 'mdi-leaf',
  },
  {
    title: 'Our Goals',
    text: 'To nurture an interconnected eco-community that values responsibility, collaboration, and long-term commitment to environmental health.',
    icon: 'mdi-target',
  },
]
</script>

<style scoped>
.about-container {
  background-color: #f9fbe7;
  min-height: 100vh;
}

.nav-btn {
  text-transform: none;
  font-weight: 500;
  color: white !important;
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

.nav-btn:hover {
  opacity: 1;
}

.nav-btn.active {
  border-bottom: 2px solid white;
}

.about-card {
  border-radius: 12px;
  background-color: #ffffff;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.about-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.join-card {
  border-radius: 16px;
  background-color: #f1f8e9;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
