import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  // Set user manually
  function setUser(userData) {
    user.value = userData
  }

  // Logout user
  async function logoutUser() {
    try {
      await api.post('/user/logout', {}, { withCredentials: true })
    } catch (err) {
      console.error('Logout failed:', err)
    }
    user.value = null
    localStorage.removeItem('userId')
  }

  // Fetch logged-in user from backend (persistent login)
  async function fetchUser() {
    try {
      const res = await api.get('/user/me', { withCredentials: true })
      user.value = res.data.user

      // Optional: store userId for quick access
      localStorage.setItem('userId', res.data.user._id)
    } catch (err) {
      user.value = null
      localStorage.removeItem('userId')
    }
  }

  return { user, setUser, logoutUser, fetchUser }
})
