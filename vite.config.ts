// vite.config.ts

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // ÖNEMLİ: GitHub Pages için base path'i repository adınıza göre ayarlandı.
    base: '/hesap-makinesi/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
                            VitePWA({
                              registerType: 'autoUpdate',
                              includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
                              manifest: {
                                name: 'Gemini AI Calculator',
                                short_name: 'AI Calculator',
                                description: 'Modern, zengin özelliklere sahip bir bilimsel hesap makinesi ve birim dönüştürücü.',
                                theme_color: '#191022', // Koyu tema arkaplan rengi
                                background_color: '#191022',
                                display: 'standalone',
                                scope: '/hesap-makinesi/',
                                start_url: '/hesap-makinesi/',
                                icons: [
                                  {
                                    src: 'pwa-192x192.png',
                                    sizes: '192x192',
                                    type: 'image/png'
                                  },
                                  {
                                    src: 'pwa-512x512.png',
                                    sizes: '512x512',
                                    type: 'image/png'
                                  },
                                  {
                                    src: 'pwa-512x512.png',
                                    sizes: '512x512',
                                    type: 'image/png',
                                    purpose: 'any maskable'
                                  }
                                ]
                              }
                            })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
                            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
                            // Geliştirme ortamını kontrol etmek için bu satırı ekliyoruz
                            'process.env.NODE_ENV': JSON.stringify(mode),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
