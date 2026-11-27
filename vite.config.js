import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    // Android 5.0+ (Chrome 63+), iOS 12+, 구형 브라우저 지원
    target: ['es2015', 'chrome63', 'firefox67', 'safari12', 'edge79'],
    cssTarget: 'chrome63',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
          'vendor-utils': ['date-fns', 'uuid']
        }
      }
    }
  },
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
        scope: "/",
        lang: "ko-KR",
        categories: ["entertainment", "utilities"],
        icons: [
          {
            src: "/icons/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any"
          },
          {
            src: "/icons/icon.svg",
            sizes: "192x192 512x512",
            type: "image/svg+xml",
            purpose: "maskable"
          }
        ],
        screenshots: [
          {
            src: "/icons/icon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            form_factor: "wide",
            label: "BaroTube - 광고 없이 YouTube 시청"
          }
        ],
        // Android 구버전 호환성
        prefer_related_applications: false,
        related_applications: [],
        // iOS 지원
        apple_itunes_app: undefined,
        // Windows 타일 지원
        shortcuts: [
          {
            name: "최근 영상 재생",
            url: "/?action=recent",
            description: "최근 시청한 영상 재생"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        // Android 구버전 호환성
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/www\.youtube\.com\/embed\/.*/,
            handler: "NetworkFirst",
            options: {
              cacheName: "youtube-embeds",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 86400
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/img\.youtube\.com\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "youtube-thumbnails",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 604800 // 7 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 31536000 // 1 year
              }
            }
          }
        ],
        // 구형 브라우저 지원
        skipWaiting: false,
        clientsClaim: true
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
