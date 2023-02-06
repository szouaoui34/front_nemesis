import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import { config } from './config';
export default defineConfig({
    server: { // <-- this object is added
        port: 5173,
        host: true,
        hmr: {
            port: 8636,
        },
        watch: {
            usePolling: true
        },
        proxy: {
            '/task': {
                target: config.NEMESIS_URL,
                changeOrigin: true,
                configure: (proxy, options) => {
                    const username = config.NEMESIS_LOG;
                    const password = config.NEMESIS_PSW;
                    options.auth = `${username}:${password}`;
                },
            },
            '/get_report': {
                target: config.NEMESIS_URL,
                changeOrigin: true,
                configure: (proxy, options) => {
                    const username = config.NEMESIS_LOG;
                    const password = config.NEMESIS_PSW;
                    options.auth = `${username}:${password}`;
                },
            },

        },
    },

    plugins: [vue()]
})