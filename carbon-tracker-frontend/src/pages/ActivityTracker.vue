<template>
  <Navbar />
  <v-container class="py-8">
    <h2 class="text-h4 font-weight-bold mb-6 text-green-darken-2">🌱 Your Activity Tracker</h2>

    <v-row>
      <!-- Line Chart: Daily Emissions -->
      <v-col cols="12" md="8">
        <v-card elevation="6" class="pa-4">
          <h3 class="text-h6 font-weight-medium mb-3">📈 Daily Carbon Emissions</h3>
          <canvas ref="lineChart" height="140"></canvas>
        </v-card>
      </v-col>

      <!-- Pie Chart: Today’s Breakdown -->
      <v-col cols="12" md="4">
        <v-card elevation="6" class="pa-4">
          <h3 class="text-h6 font-weight-medium mb-3">🧩 Today’s Breakdown</h3>
          <canvas ref="pieChart" height="180"></canvas>
        </v-card>
      </v-col>
    </v-row>

    <!-- Insights Section -->
    <v-row class="mt-6">
      <v-col cols="12" md="4" v-for="(card, i) in insights" :key="i">
        <v-card elevation="4" class="pa-4 text-center">
          <v-icon :color="card.color" size="40">{{ card.icon }}</v-icon>
          <h4 class="text-h6 font-weight-medium mt-2">{{ card.title }}</h4>
          <p class="text-body-2 text-grey">{{ card.subtitle }}</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'  // Make sure the path is correct
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import api from '../api';

const lineChart = ref(null);
const pieChart = ref(null);

let lineChartInstance = null;
let pieChartInstance = null;

const todayFootprint = ref({});
const history = ref([]);
const insights = ref([]);

// Fetch data from backend
const fetchData = async () => {
  try {
    const [todayRes, historyRes] = await Promise.all([
      api.get('/carbon/today'),
      api.get('/carbon/history')
    ]);

    todayFootprint.value = todayRes.data || {};
    history.value = (historyRes.data || []).sort((a, b) => new Date(a.date) - new Date(b.date));

    renderLineChart();
    renderPieChart();
    generateInsights();
  } catch (err) {
    console.error("Error fetching carbon data:", err);
  }
};

// Render line chart
const renderLineChart = () => {
  if (!lineChart.value || !history.value.length) return;

  const labels = history.value.map(h => h.date);
  const data = history.value.map(h => h.totalEmissions);

  if (lineChartInstance) lineChartInstance.destroy();

  lineChartInstance = new Chart(lineChart.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Total Emissions (kgCO₂e)',
        data,
        backgroundColor: '#4caf50aa',
        borderColor: '#2e7d32',
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => `${ctx.formattedValue} kg CO₂` }
        }
      },
      scales: { y: { beginAtZero: true, title: { display: true, text: 'kg CO₂e' } } }
    }
  });
};

// Render pie chart
const renderPieChart = () => {
  if (!pieChart.value || !todayFootprint.value?.details) return;

  const categories = Object.keys(todayFootprint.value.details);
  const values = Object.values(todayFootprint.value.details).map(d => d.co2e);

  if (pieChartInstance) pieChartInstance.destroy();

  pieChartInstance = new Chart(pieChart.value, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [{ data: values, backgroundColor: ['#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9', '#4caf50', '#2e7d32'] }]
    },
    options: {
      plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.formattedValue} kg CO₂` } } },
      cutout: '50%'
    }
  });
};

// Generate insights
const generateInsights = () => {
  if (!history.value.length) return;

  const avg = history.value.reduce((sum, h) => sum + h.totalEmissions, 0) / history.value.length;
  const latest = history.value[history.value.length - 1].totalEmissions;
  const trend = latest < avg ? 'down' : 'up';

  let topCategory = null;
  if (todayFootprint.value.details) {
    const sorted = Object.entries(todayFootprint.value.details).sort(([, a], [, b]) => b.co2e - a.co2e);
    if (sorted.length) topCategory = sorted[0][0];
  }

  insights.value = [
    { title: trend === 'down' ? 'You’re improving!' : 'Emission rising!', subtitle: trend === 'down' ? 'Lower than average footprint' : 'Try reducing high sources', icon: trend === 'down' ? 'mdi-trending-down' : 'mdi-trending-up', color: trend === 'down' ? 'green' : 'red' },
    { title: `${avg.toFixed(1)} kg CO₂ avg/day`, subtitle: 'Overall average footprint', icon: 'mdi-chart-line', color: 'teal' },
    { title: topCategory ? `${topCategory} is highest today` : 'No data yet', subtitle: 'Top contributor today', icon: 'mdi-leaf', color: 'green-darken-2' }
  ];
};

onMounted(fetchData);
</script>

<style scoped>
.v-card { border-radius: 12px; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.v-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
</style>
