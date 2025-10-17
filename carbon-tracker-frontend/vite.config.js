import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path' // <-- add this

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }), // 👈 this line is important
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // <-- add this alias
    },
  },
})
