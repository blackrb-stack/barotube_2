import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon.svg"],
      manifest: {
        name: "BaroTube - 광고 없이 YouTube 시청",
        short_name: "BaroTube",
        description: "YouTube 영상을 광고 없이 빠르게 시청하는 테스트 도구",
        theme_color: "#dc2626",
        background_color: "#0f0f0f",
        display: "standalone",
        orientation: "any",
        start_url: "/",
        lang: "ko-KR",
        icons: [
          {
            src: "/icons/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/www\.youtube\.com\/embed\/.*/,
            handler: "NetworkFirst",
            options: {
              cacheName: "youtube-embeds",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 86400
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
