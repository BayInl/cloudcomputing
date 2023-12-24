import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                ws: true, // 是否启用websockets
                changeOrigin: true,  // 代理时是否更改host
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})
