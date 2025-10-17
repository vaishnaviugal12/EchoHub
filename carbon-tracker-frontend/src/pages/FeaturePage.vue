<template>
  <v-app>
    <!-- ================= NAVBAR ================= -->
    <Navbar />

    <!-- HERO SECTION -->
    <v-container fluid class="feature-hero text-center">
      <div>
        <h1 class="text-h3 font-weight-bold mb-4">
          Powerful Features to Drive Sustainability 🌱
        </h1>
        <p class="text-h6">
          Explore the tools that help you track, learn, and act — all in one place.
        </p>
      </div>
    </v-container>

    <!-- FEATURE CARDS -->
    <v-container class="my-12">
      <v-row justify="center" align="stretch" dense>
        <!-- Activity Tracking -->
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-6 rounded-xl text-center feature-card"
            elevation="4"
            style="cursor: pointer;"
            @click="$router.push('/activity')"
          >
            <v-icon size="48" color="green-darken-1">mdi-run</v-icon>
            <h3 class="text-h6 font-weight-bold mt-3">Activity Tracking</h3>
            <p class="mt-2">
              Log your daily activities and transport to track real-time carbon emissions.
            </p>
          </v-card>
        </v-col>

        <!-- Calculate Your Footprint -->
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-6 rounded-xl text-center feature-card"
            elevation="4"
            style="cursor: pointer;"
            @click="$router.push('/dashboard')"
          >
            <v-icon size="48" color="green-darken-1">mdi-calculator</v-icon>
            <h3 class="text-h6 font-weight-bold mt-3">Calculate Your Footprint</h3>
            <p class="mt-2">
              Use our smart calculator to estimate your carbon footprint with accuracy.
            </p>
          </v-card>
        </v-col>

        <!-- EchoNews -->
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-6 rounded-xl text-center feature-card"
            elevation="4"
            style="cursor: pointer;"
            @click="$router.push('/eco-news')"
          >
            <v-icon size="48" color="green-darken-1">mdi-newspaper</v-icon>
            <h3 class="text-h6 font-weight-bold mt-3">EchoNews</h3>
            <p class="mt-2">
              Stay updated with the latest environmental news, disaster alerts, and sustainability insights.
            </p>
          </v-card>
        </v-col>

        <!-- Community Hub -->
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-6 rounded-xl text-center feature-card"
            elevation="4"
            style="cursor: pointer;"
            @click="$router.push('/community')"
          >
            <v-icon size="48" color="green-darken-1">mdi-account-group</v-icon>
            <h3 class="text-h6 font-weight-bold mt-3">Community Hub</h3>
            <p class="mt-2">
              Connect with others, share tips, and participate in sustainability discussions.
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- CTA SECTION -->
    <v-container fluid class="cta-section py-12 text-center">
      <h2 class="text-h4 font-weight-bold mb-4">
        Start Your Eco Journey Today 🌍
      </h2>
      <p class="mb-8">Join the Carbon Tracker community and make a real impact.</p>
      <v-btn color="green-darken-1" large to="/signup">
        Get Started
      </v-btn>
    </v-container>

    <!-- FOOTER -->
    <v-footer app color="green-darken-1" dark class="py-6">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <div class="font-weight-bold mb-2">🌿 Carbon Tracker</div>
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
import Navbar from '@/components/Navbar.vue'
</script>

<style scoped>
.feature-hero {
  background-color: #e8f5e9;
  padding-top: 8rem;  
  padding-bottom: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.feature-card {
  border: 1px solid #c8e6c9;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  border-color: #4caf50;
}

.cta-section {
  background-color: #f1f8e9;
}
</style>
