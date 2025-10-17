<template>
  <v-app>
    <!-- ===================== Navbar ===================== -->
    <v-app-bar app color="green-darken-1" dark elevation="2">
      <v-toolbar-title class="font-weight-bold text-h6" @click="$router.push('/')">
        🌿 EchoHub Admin
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Logout Button -->
      <v-btn color="red lighten-1" dark @click="logout">
        <v-icon left>mdi-logout</v-icon>
        Logout
      </v-btn>
    </v-app-bar>

    <!-- ===================== Main Content ===================== -->
    <v-main>
      <v-container fluid class="admin-dashboard">
        <!-- Header Section -->
        <v-row class="mb-6">
          <v-col cols="12">
            <div class="d-flex align-center justify-space-between">
              <div>
                <h1 class="text-h4 font-weight-bold primary--text mb-2">
                  👑 Admin Dashboard
                </h1>
                <p class="text-body-1 text-medium-emphasis">
                  Manage EcoLeader requests and platform activities
                </p>
              </div>
              <v-chip color="primary" variant="flat" class="ml-2">
                <v-icon start>mdi-shield-account</v-icon>
                Admin Panel
              </v-chip>
            </div>
          </v-col>
        </v-row>

        <!-- Stats Cards (Pending, Approved, Rejected, Total) -->
        <v-row class="mb-6">
          <v-col cols="12" sm="6" md="3" v-for="(card, index) in statsCards" :key="index">
            <v-card class="stats-card" elevation="2" rounded="lg">
              <v-card-text class="d-flex align-center">
                <v-avatar :color="card.colorLight" size="56" class="mr-4">
                  <v-icon :color="card.colorDark" size="28">{{ card.icon }}</v-icon>
                </v-avatar>
                <div>
                  <div class="text-h5 font-weight-bold">{{ card.count }}</div>
                  <div class="text-caption text-medium-emphasis">{{ card.label }}</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Leader Requests Table -->
        <v-card class="elevation-3 rounded-lg" :loading="loading">
          <v-card-title class="d-flex align-center pa-6">
            <v-icon color="primary" class="mr-3">mdi-account-supervisor</v-icon>
            <span class="text-h5 font-weight-medium">EcoLeader Requests</span>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              variant="tonal"
              @click="fetchLeaderRequests"
              :loading="loading"
              class="mr-2"
            >
              <v-icon start>mdi-refresh</v-icon>
              Refresh
            </v-btn>
            <v-chip color="primary" variant="flat">
              {{ leaderRequests.length }} Requests
            </v-chip>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="leaderRequests"
              :loading="loading"
              loading-text="Loading leader requests..."
              no-data-text="🎉 No pending leader requests found. All clear!"
              class="requests-table"
              item-value="_id"
            >
              <!-- Username with Avatar -->
              <template v-slot:item.username="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="32" color="primary-lighten-4" class="mr-3">
                    <span class="text-caption font-weight-medium">
                      {{ getInitials(item.username) }}
                    </span>
                  </v-avatar>
                  <div>
                    <div class="font-weight-medium">{{ item.username }}</div>
                    <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
                  </div>
                </div>
              </template>

              <!-- Status -->
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  :variant="item.status === 'pending' ? 'flat' : 'elevated'"
                  size="small"
                  class="font-weight-medium"
                >
                  <v-icon start small>{{ getStatusIcon(item.status) }}</v-icon>
                  {{ item.status }}
                </v-chip>
              </template>

              <!-- Actions -->
              <template v-slot:item.actions="{ item }">
                <div class="d-flex align-center" style="gap: 8px;">
                  <v-btn
                    v-if="item.status === 'pending'"
                    color="success"
                    variant="flat"
                    size="small"
                    @click="handleRequest(item._id, 'approve')"
                  >
                    <v-icon start size="18">mdi-check</v-icon>
                    Approve
                  </v-btn>

                  <v-btn
                    v-if="item.status === 'pending'"
                    color="error"
                    variant="outlined"
                    size="small"
                    @click="handleRequest(item._id, 'reject')"
                  >
                    <v-icon start size="18">mdi-close</v-icon>
                    Reject
                  </v-btn>

                  <div v-else class="text-center">
                    <v-icon 
                      :color="item.status === 'approved' ? 'success' : 'error'" 
                      size="24"
                    >
                      {{ item.status === 'approved' ? 'mdi-check-circle' : 'mdi-cancel' }}
                    </v-icon>
                    <div class="text-caption text-medium-emphasis mt-1">
                      {{ item.status === 'approved' ? 'Approved' : 'Rejected' }}
                    </div>
                  </div>
                </div>
              </template>

              <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useUserStore } from "@/stores/user";
import axios from "axios";

export default {
  name: "AdminLeaderRequests",
  data() {
    return {
      loading: true,
      leaderRequests: [],
      headers: [
        { title: "User", key: "username", sortable: true, width: "300px" },
        { title: "Status", key: "status", sortable: true, align: "center", width: "150px" },
        { title: "Actions", key: "actions", sortable: false, align: "center", width: "200px" },
      ],
    };
  },
  computed: {
    statsCards() {
      return [
        { label: "Pending Requests", count: this.leaderRequests.filter(r => r.status === 'pending').length, icon: "mdi-account-clock", colorLight: "blue-lighten-5", colorDark: "blue-darken-2" },
        { label: "Approved Leaders", count: this.leaderRequests.filter(r => r.status === 'approved').length, icon: "mdi-account-check", colorLight: "green-lighten-5", colorDark: "green-darken-2" },
        { label: "Rejected Requests", count: this.leaderRequests.filter(r => r.status === 'rejected').length, icon: "mdi-account-cancel", colorLight: "red-lighten-5", colorDark: "red-darken-2" },
        { label: "Total Requests", count: this.leaderRequests.length, icon: "mdi-account-group", colorLight: "orange-lighten-5", colorDark: "orange-darken-2" },
      ];
    }
  },
  methods: {
    async fetchLeaderRequests() {
      this.loading = true;
      try {
        const res = await axios.get("http://localhost:3000/api/user/leader/requests", {
          withCredentials: true,
        });
        this.leaderRequests = res.data.requests.map(r => ({
          _id: r._id,
          username: r.username,
          email: r.email,
          status: r.leaderRequestStatus || "pending"
        }));
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async handleRequest(userId, action) {
      try {
        await axios.post("http://localhost:3000/api/user/leader/handle", { userId, action }, { withCredentials: true });
        this.fetchLeaderRequests();
      } catch (err) {
        console.error(err);
      }
    },
    getStatusColor(status) {
      const colors = { approved: 'success', rejected: 'error', pending: 'warning' };
      return colors[status] || 'grey';
    },
    getStatusIcon(status) {
      const icons = { approved: 'mdi-check-circle', rejected: 'mdi-cancel', pending: 'mdi-clock' };
      return icons[status] || 'mdi-help-circle';
    },
    getInitials(username) {
      return username.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    },
    logout() {
      const userStore = useUserStore();
      userStore.logoutUser();
      // Optional: call backend logout route
      axios.post("http://localhost:3000/api/user/logout", {}, { withCredentials: true })
      .finally(() => {
        this.$router.push('/login');
      });
    }
  },
  mounted() {
    this.fetchLeaderRequests();
  }
};
</script>

<style scoped>
.admin-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}
.stats-card { transition: all 0.3s ease; border: 1px solid rgba(0,0,0,0.08); }
.stats-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.15)!important; }
</style>
