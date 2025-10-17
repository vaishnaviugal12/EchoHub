<template>
  <v-app>
    <!-- ===================== NAVBAR ===================== -->
    <v-app-bar
      app
      color="green-darken-1"
      dark
      elevation="2"
      class="navbar"
    >
      <v-toolbar-title class="font-weight-bold text-h6" @click="router.push('/')">
        🌿 EchoHub
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Center Nav Links -->
      <div class="nav-links d-none d-md-flex">
        <v-btn variant="text" class="nav-btn" @click="scrollTo('home')">Home</v-btn>
        <v-btn variant="text" class="nav-btn" @click="goToFeatures">Features</v-btn>
        <v-btn variant="text" class="nav-btn" @click="scrollTo('howitworks')">How It Works</v-btn>
        <v-btn variant="text" class="nav-btn" @click="scrollTo('about')">About</v-btn>
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

    <!-- ===================== MAIN DASHBOARD ===================== -->
    <v-container class="py-6">
      <v-row>
        <v-col cols="12" class="text-center">
          <h1 class="text-h4 font-weight-bold text-green-darken-2">🌍 Carbon Footprint Dashboard</h1>
          <p class="text-grey-darken-1">Enter your daily details to calculate your footprint</p>
        </v-col>
      </v-row>

      <v-row>
        <!-- Input Form -->
        <v-col cols="12" md="5">
          <v-card elevation="4" class="pa-4">
            <h3 class="text-h6 mb-3">🧾 Daily Details</h3>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model.number="formData.electricity.billAmount"
                label="Electricity Bill Amount (₹)"
                type="number"
                prepend-icon="mdi-flash"
                required
              />
              <v-text-field
                v-model.number="formData.transport.distance"
                label="Transport Distance (km)"
                type="number"
                prepend-icon="mdi-car"
                required
              />
              <v-select
                v-model="formData.transport.mode"
                :items="['car', 'bus', 'bike', 'train']"
                label="Transport Mode"
                prepend-icon="mdi-bus"
                required
              />
              <v-text-field
                v-model.number="formData.water.litres"
                label="Water Usage (litres)"
                type="number"
                prepend-icon="mdi-water"
                required
              />
              <v-text-field
                v-model.number="formData.waste.kg"
                label="Waste Generated (kg)"
                type="number"
                prepend-icon="mdi-delete"
                required
              />
              <v-select
                v-model="formData.diet.type"
                :items="['vegetarian', 'non-vegetarian', 'vegan']"
                label="Diet Type"
                prepend-icon="mdi-food"
                required
              />

              <v-btn
                block
                color="green-darken-2"
                class="mt-3"
                @click="calculateFootprint"
                :loading="calculating"
                prepend-icon="mdi-leaf"
              >
                Calculate / Update Footprint
              </v-btn>
            </v-form>
          </v-card>
        </v-col>

        <!-- Today + Chart Section -->
        <v-col cols="12" md="7">
          <v-card elevation="4" class="pa-4 mb-4">
            <h3 class="text-h6 font-weight-medium mb-2">Today's Carbon Footprint</h3>
            <div v-if="loadingToday" class="text-center">
              <v-progress-circular indeterminate color="green"></v-progress-circular>
            </div>
            <div v-else>
              <p class="text-h5 font-weight-bold text-green-darken-2">
                {{ todayFootprint?.totalEmissions || 'Not calculated yet' }} kg CO₂
              </p>
              <p class="text-caption text-grey">Last updated: {{ todayFootprint?.date || '—' }}</p>
            </div>
          </v-card>

          <v-card elevation="4" class="pa-4">
            <h3 class="text-h6 font-weight-medium mb-3">📊 Historical Records</h3>
            <div v-if="loadingHistory" class="text-center">
              <v-progress-circular indeterminate color="green"></v-progress-circular>
            </div>
            <canvas v-else ref="chartCanvas" height="120"></canvas>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import api from '../api'
import Chart from 'chart.js/auto'

const userStore = useUserStore()
const router = useRouter()

// Smooth scroll
const scrollTo = (id) => {
  const section = document.getElementById(id)
  if (section) section.scrollIntoView({ behavior: 'smooth' })
  else router.push(`/#${id}`)
}

const goToFeatures = () => router.push('/features')

const handleLogout = async () => {
  try {
    await api.post('/user/logout', {}, { withCredentials: true })
    userStore.logoutUser()
    router.push('/login')
  } catch (err) {
    console.error('Logout failed', err)
  }
}

// Dashboard state
const todayFootprint = ref(null)
const history = ref([])
const loadingToday = ref(false)
const loadingHistory = ref(false)
const calculating = ref(false)
const valid = ref(false)
const chartCanvas = ref(null)
let chartInstance = null

const formData = ref({
  electricity: { billAmount: null },
  transport: { mode: '', distance: null },
  water: { litres: null },
  waste: { kg: null },
  diet: { type: '' },
})

// Fetch today's footprint
const fetchTodayFootprint = async () => {
  try {
    loadingToday.value = true
    const res = await api.get('/carbon/today')
    todayFootprint.value = res.data
  } catch (err) {
    console.error('Error fetching today footprint:', err)
    todayFootprint.value = null
  } finally {
    loadingToday.value = false
  }
}

// Fetch history
const fetchHistory = async () => {
  try {
    loadingHistory.value = true
    const res = await api.get('/carbon/history')
    history.value = res.data || []
  } catch (err) {
    console.error('Error fetching history:', err)
    history.value = []
  } finally {
    loadingHistory.value = false
  }
}

// Calculate footprint
const calculateFootprint = async () => {
  try {
    calculating.value = true
    const res = await api.post('/carbon/calculate', formData.value)
    todayFootprint.value = res.data
    await fetchHistory()
  } catch (err) {
    console.error('Error calculating footprint:', err)
  } finally {
    calculating.value = false
  }
}

// Chart
const renderChart = () => {
  if (!chartCanvas.value) return
  const labels = history.value.map(h => h.date)
  const data = history.value.map(h => h.totalEmissions)
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: { labels, datasets: [{ label: 'Daily Footprint (kg CO₂)', data, borderColor: '#2e7d32', backgroundColor: 'rgba(46,125,50,0.2)', fill: true, tension: 0.4 }] },
    options: { responsive: true, scales: { y: { beginAtZero: true, title: { display: true, text: 'kg CO₂' } } } }
  })
}

watch(history, renderChart)

onMounted(async () => {
  await fetchTodayFootprint()
  await fetchHistory()
})
</script>

<style scoped>
.navbar {
  backdrop-filter: blur(8px);
}
.nav-links { gap: 1rem; }
.nav-btn { text-transform: none; font-size: 1rem; transition: color 0.2s ease; }
.nav-btn:hover { color: #c8e6c9; }
.hoverable { cursor: pointer; }

.v-card { border-radius: 12px; }
h1 { letter-spacing: 0.5px; }
</style>
