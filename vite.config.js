import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      //'@': fileURLToPath(new URL('./src', import.meta.url))
      '@':path.resolve(__dirname,'./src')
    }
  },
  server:{
    port:1024,
    hmr:true,
    proxy:{
      "/api":{
        target:"http://localhost:8000",
        changeOrigin:true,
        PathRewrite:{
          "^api":"/api"
        }
      }
    }
  }
})
