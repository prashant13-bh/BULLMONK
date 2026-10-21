import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// High-Performance Vite Configuration with Vendor Code-Splitting for Sub-Second FCP
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'icons';
          }
          if (id.includes('node_modules/@supabase/')) {
            return 'supabase';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true
  }
})
