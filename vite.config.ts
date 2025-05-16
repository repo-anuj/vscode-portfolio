import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],

    // Define aliases for cleaner imports
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },

    // Optimize build
    build: {
      // Generate source maps for better debugging
      sourcemap: true,

      // Optimize chunk size
      chunkSizeWarningLimit: 1000,

      // Minify output
      minify: 'terser',

      // Terser options
      terserOptions: {
        compress: {
          drop_console: false, // Keep console logs for debugging
          drop_debugger: true,
        },
      },

      // Rollup options
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor chunks for better caching
            vendor: ['react', 'react-dom'],
            ui: ['lucide-react', 'framer-motion'],
            socket: ['socket.io-client'],
          },
        },
      },
    },

    // Optimize dev server
    server: {
      port: 5173,
      strictPort: false,
      open: false,
      cors: true,
    },

    // Handle environment variables
    define: {
      // Make environment variables available to the client
      // This ensures that import.meta.env.VITE_* variables are properly replaced
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  }
})
