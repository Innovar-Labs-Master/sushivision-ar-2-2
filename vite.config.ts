import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Support both VITE_GEMINI_API_KEY (for client) and GEMINI_API_KEY (for server)
    const geminiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY;
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        headers: {
          'Content-Security-Policy': mode === 'development' 
            ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https: http: ws: wss:; connect-src 'self' https: http: ws: wss: localhost:* 127.0.0.1:*; style-src 'self' 'unsafe-inline' https://www.gstatic.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://ajax.googleapis.com https://aistudiocdn.com; img-src 'self' data: blob: https: http:;"
            : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://ajax.googleapis.com https://aistudiocdn.com; style-src 'self' 'unsafe-inline' https://www.gstatic.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https: http: ws: wss:; img-src 'self' data: blob: https:;"
        },
        proxy: {
          '/api': {
            target: 'http://localhost:3002',
            changeOrigin: true,
            secure: false,
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(geminiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(geminiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});