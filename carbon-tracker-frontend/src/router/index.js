import { createRouter, createWebHistory } from 'vue-router'

// ======= USER PAGES =======
import Login from '../pages/Login.vue'
import Signup from '../pages/Signup.vue'
import Dashboard from '../pages/Dashboard.vue'
import Home from '../pages/Home.vue'
import FeaturePage from '../pages/FeaturePage.vue'
import CommunityHub from '../pages/CommunityHub.vue'
import ActivityTracker from '../pages/ActivityTracker.vue'

import About from '../pages/About.vue'
import EcoNewsHub from '../pages/EcoNewsHub.vue' // ✅ Added new page import

// ======= ADMIN PAGES =======
import AdminLeaderRequests from '../pages/AdminLeaderRequests.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/features', name: 'Features', component: FeaturePage },
  { path: '/community', name: 'CommunityHub', component: CommunityHub },
  { path: '/activity', name: 'ActivityTracker', component: ActivityTracker },
  { path: '/eco-news', name: 'EcoNewsHub', component: EcoNewsHub }, // ✅ New route added
  { path: '/about', name: 'About', component: About },

  // ======= ADMIN ROUTES =======
  {
    path: '/admin/leader-requests',
    name: 'AdminLeaderRequests',
    component: AdminLeaderRequests,
    meta: { requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
