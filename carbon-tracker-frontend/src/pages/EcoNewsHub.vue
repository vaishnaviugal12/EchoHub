<template>
  <v-app>
    <!-- 🌿 Navbar -->
    <v-app-bar app color="green-darken-1" dark flat>
      <v-toolbar-title class="font-weight-bold">🌿 EchoHub | Eco News Hub</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="$router.push('/')">Home</v-btn>
      <v-btn text @click="$router.push('/about')">About</v-btn>
    </v-app-bar>

    <v-main class="mt-10">
      <v-container>
        <!-- 🌍 Global & Local Sections -->
        <v-row class="text-center mb-8">
          <v-col cols="12">
            <h1 class="font-weight-bold text-h4 mb-2">📰 Latest Disaster & Environmental News</h1>
            <p class="text-subtitle-1 grey--text">
              Stay updated with the latest floods, wildfires, climate changes, and sustainability efforts across the world.
            </p>
          </v-col>
        </v-row>

        <v-row>
          <!-- 🌍 GDELT News -->
          <v-col cols="12" md="6">
            <v-card class="pa-4 rounded-lg elevation-2">
              <h2 class="text-h5 font-weight-bold mb-4">🌍 Global Alerts (GDELT)</h2>

              <v-row>
                <v-col
                  v-for="(item, index) in gdeltNews.slice(0, 6)"
                  :key="index"
                  cols="12"
                >
                  <v-card outlined class="pa-3 mb-3 rounded-lg hover-card">
                    <v-card-title class="text-h6 font-weight-medium">
                      {{ item.title || 'Untitled Article' }}
                    </v-card-title>
                    <v-card-subtitle class="text-caption grey--text">
                      {{ item.source || 'Unknown Source' }}
                    </v-card-subtitle>
                    <v-card-text class="text-body-2">
                      {{ item.seendate ? new Date(item.seendate).toLocaleString() : '' }}
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        color="green-darken-1"
                        text
                        :href="item.url || item.documentIdentifier"
                        target="_blank"
                      >
                        Read More
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- 🇮🇳 NewsData.io -->
          <v-col cols="12" md="6">
            <v-card class="pa-4 rounded-lg elevation-2">
              <h2 class="text-h5 font-weight-bold mb-4">🇮🇳 Environmental News (India)</h2>

              <v-row>
                <v-col
                  v-for="(article, index) in newsData.slice(0, 6)"
                  :key="index"
                  cols="12"
                >
                  <v-card outlined class="pa-3 mb-3 rounded-lg hover-card">
                    <v-img
                      v-if="article.image_url"
                      :src="article.image_url"
                      height="160"
                      class="rounded-lg mb-2"
                      cover
                    ></v-img>
                    <v-card-title class="text-h6 font-weight-medium">
                      {{ article.title }}
                    </v-card-title>
                    <v-card-subtitle class="text-caption grey--text">
                      {{ article.source }}
                    </v-card-subtitle>
                    <v-card-text class="text-body-2">
                      {{ article.description || 'No description available.' }}
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        color="green-darken-1"
                        text
                        :href="article.link"
                        target="_blank"
                      >
                        Read More
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Loading State -->
        <v-row v-if="loading" class="justify-center my-10">
          <v-progress-circular indeterminate color="green-darken-1" size="64"></v-progress-circular>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app color="green-darken-1" dark class="text-center py-3">
      <v-col cols="12">
        © 2025 EchoHub — Building a Greener, Aware Community 🌍
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "EcoNewsHub",
  data() {
    return {
      gdeltNews: [],
      newsData: [],
      loading: true,
    };
  },
  async created() {
    try {
      const [gdeltRes, newsRes] = await Promise.all([
        axios.get("http://localhost:3000/api/news/gdelt"),
        axios.get("http://localhost:3000/api/news/newsdata"),
      ]);

      this.gdeltNews = gdeltRes.data.data || [];
      this.newsData = newsRes.data.data || [];
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #e0e0e0;
}
.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 4px 16px rgba(0, 128, 0, 0.2);
}

.v-application {
  background-color: #f5f8f5 !important;
}

h1, h2 {
  color: #2e7d32;
}
</style>
