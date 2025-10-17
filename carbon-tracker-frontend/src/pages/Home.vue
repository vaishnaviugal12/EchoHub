<template>
  <v-app>
    <!-- ================= NAVBAR ================= -->
    <v-app-bar app color="green-darken-2" dark elevation="2" class="px-6 navbar">
      <!-- Logo / Title -->
      <v-toolbar-title class="font-weight-bold text-h5 cursor-pointer" @click="router.push('/')">
        🌿 EchoHub
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Center Nav Links -->
      <div class="d-flex align-center nav-links">
        <v-btn variant="text" class="nav-btn" @click="router.push('/')">Home</v-btn>
        <v-btn variant="text" class="nav-btn" @click="router.push('/features')">Features</v-btn>
        <v-btn variant="text" class="nav-btn" @click="scrollTo('howitworks')">How It Works</v-btn>
        <v-btn variant="text" class="nav-btn" @click="router.push('/about')">About</v-btn>
        <v-btn variant="text" class="nav-btn" @click="scrollTo('contact')">Contact</v-btn>
      </div>

      <v-spacer></v-spacer>

      <!-- Auth Buttons / Profile -->
      <template v-if="!userStore.user">
        <v-btn color="white" text class="ml-2" @click="router.push('/login')">Login</v-btn>
        <v-btn color="white" outlined rounded class="ml-2" @click="router.push('/signup')">Signup</v-btn>
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

    <!-- ================= HERO SECTION ================= -->
    <v-container fluid class="hero-section py-16 text-center">
      <h1 class="text-h3 font-weight-bold mb-4">
        Empowering You to Build a Sustainable Planet 🌍
      </h1>
      <p class="text-h6 mb-8">
        Calculate, reduce, and take real action to live sustainably.
      </p>
      <div>
        <v-btn color="green-darken-1" class="me-4" large to="/calculator">
          Get Started
        </v-btn>
        <v-btn variant="outlined" color="green-darken-1" large to="/learn">
          Learn More
        </v-btn>
      </div>
    </v-container>

    <!-- ================= FEATURES SECTION ================= -->
    <v-container class="my-12 text-center">
      <h2 class="text-h4 font-weight-bold mb-8">
        🌱 Small Changes Can Create Big Impacts
      </h2>

      <v-row justify="center" align="stretch" class="text-center" dense>
        <!-- Card 1 -->
        <v-col cols="12" md="4" lg="4">
          <v-card elevation="4" class="pa-6 rounded-xl hover-card">
            <v-icon size="48" color="green-darken-1">mdi-lightbulb-on-outline</v-icon>
            <h3 class="text-h6 font-weight-bold mt-3">Save Energy</h3>
            <p class="mt-2">
              Switch to LED bulbs, unplug devices, and reduce electricity usage at home.
            </p>
          </v-card>
        </v-col>

        <!-- Card 2 -->
        <v-col cols="12" md="4" lg="4">
          <v-card elevation="4" class="pa-6 rounded-xl hover-card">
            <v-icon size="48" color="green-darken-1">mdi-bicycle</v-icon>
            <h3 class="text-h6 font-weight-bold mt-3">Eco Transport</h3>
            <p class="mt-2">
              Walk, bike, or use public transport instead of private vehicles.
            </p>
          </v-card>
        </v-col>

        <!-- Card 3 -->
        <v-col cols="12" md="4" lg="4">
          <v-card elevation="4" class="pa-6 rounded-xl hover-card">
            <v-icon size="48" color="green-darken-1">mdi-food-apple-outline</v-icon>
            <h3 class="text-h6 font-weight-bold mt-3">Mindful Eating</h3>
            <p class="mt-2">
              Reduce meat intake and prefer local, seasonal, or plant-based foods.
            </p>
          </v-card>
        </v-col>

        <!-- Card 4 -->
        <v-col cols="12" md="4" lg="4">
          <v-card elevation="4" class="pa-6 rounded-xl hover-card">
            <v-icon size="48" color="green-darken-1">mdi-recycle</v-icon>
            <h3 class="text-h6 font-weight-bold mt-3">Reduce Waste</h3>
            <p class="mt-2">
              Recycle, reuse, and compost to minimize household waste.
            </p>
          </v-card>
        </v-col>

        <!-- Card 5 -->
        <v-col cols="12" md="4" lg="4">
          <v-card elevation="4" class="pa-6 rounded-xl hover-card">
            <v-icon size="48" color="green-darken-1">mdi-shopping-outline</v-icon>
            <h3 class="text-h6 font-weight-bold mt-3">Conscious Shopping</h3>
            <p class="mt-2">
              Choose eco-friendly, sustainable products, and avoid single-use plastics.
            </p>
          </v-card>
        </v-col>

        <!-- Card 6 -->
        <v-col cols="12" md="4" lg="4">
          <v-card elevation="4" class="pa-6 rounded-xl hover-card">
            <v-icon size="48" color="green-darken-1">mdi-leaf</v-icon>
            <h3 class="text-h6 font-weight-bold mt-3">Plant Trees</h3>
            <p class="mt-2">
              Contribute to reforestation efforts and plant trees in your community.
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- ================= CTA SECTION ================= -->
    <v-container fluid class="cta-section py-12 text-center">
      <h2 class="text-h4 font-weight-bold mb-4">
        Ready to make a difference?
      </h2>
      <p class="mb-8">Start tracking your carbon footprint today.</p>
      <v-btn color="green-darken-1" large to="/signup">
        Sign Up Now
      </v-btn>
    </v-container>

    <!-- ================= FOOTER ================= -->
    <v-footer app color="green-darken-2" dark class="py-6">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <div class="font-weight-bold mb-2">🌿 EchoHub</div>
            <div>&copy; 2025 All rights reserved.</div>
          </v-col>
          <v-col cols="12" md="6" class="text-md-end">
            <v-btn icon href="#"><v-icon>mdi-facebook</v-icon></v-btn>
            <v-btn icon href="#"><v-icon>mdi-twitter</v-icon></v-btn>
            <v-btn icon href="#"><v-icon>mdi-instagram</v-icon></v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const scrollTo = (id) => {
  const section = document.getElementById(id)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  } else {
    router.push(`/#${id}`)
  }
}

const handleLogout = async () => {
  try {
    // Add your logout API logic here
    userStore.logoutUser()
    router.push('/login')
  } catch (err) {
    console.error('Logout failed', err)
  }
}
</script>

<style scoped>
/* ================= HERO ================= */
.hero-section {
  background: linear-gradient(
      rgba(0, 0, 0, 0.3),
      rgba(0, 0, 0, 0.3)
    ),
    url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1350&q=80')
      center/cover no-repeat;
  color: white;
  padding-top: 150px;
  padding-bottom: 150px;
}

/* ================= FEATURES ================= */
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

/* ================= CTA ================= */
.cta-section {
  background-color: #e8f5e9;
}

/* ================= NAVBAR ================= */
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
  color: #c8e6c9;
}
.hoverable {
  cursor: pointer;
}
</style>
