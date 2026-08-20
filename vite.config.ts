import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({plugins:[react(),VitePWA({registerType:'prompt',includeAssets:['favicon.svg','brand/mark.svg'],manifest:{name:'StillDue',short_name:'StillDue',description:'Keep your deadlines in view.',theme_color:'#183e36',background_color:'#f5f6f3',display:'standalone',start_url:'/',icons:[{src:'/icons/icon-192.png',sizes:'192x192',type:'image/png'},{src:'/icons/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}]},workbox:{navigateFallback:'index.html',navigateFallbackDenylist:[/^\/api\//,/^\/.netlify\//],globPatterns:['**/*.{js,css,html,svg,png,woff2}']}})],test:{include:['tests/**/*.test.ts'],environment:'node'}});
