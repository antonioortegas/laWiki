import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import dotenv from 'dotenv';
dotenv.config();

const env = process.env.VITE_NODE_ENV || 'development';
// if env is 'local', use localhost, otherwise use the value from .env file
const usersApiHost = env === 'local' ? 'http://localhost:3001/' : process.env.VITE_USERS_API_HOST;
const wikisApiHost = env === 'local' ? 'http://localhost:3002/' : process.env.VITE_WIKIS_API_HOST;
const entriesApiHost = env === 'local' ? 'http://localhost:3003/' : process.env.VITE_ENTRIES_API_HOST;
const versionsApiHost = env === 'local' ? 'http://localhost:3004/' : process.env.VITE_VERSIONS_API_HOST;
const picturesApiHost = env === 'local' ? 'http://localhost:4000/' : process.env.VITE_PICTURES_API_HOST;
const translationApiHost = env === 'local' ? 'http://localhost:4001/' : process.env.VITE_TRANSLATION_API_HOST;
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // users
      '/api/users': {
        target: usersApiHost,
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // wikis
      '/api/wikis': {
        target: wikisApiHost,
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // entries
      '/api/entries': {
        target: entriesApiHost,
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // versions
      '/api/versions': {
        target: versionsApiHost,
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // pictures
      '/api/cloudinary': {
        target: picturesApiHost,
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api/translation': {
        target: translationApiHost,
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
