import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Suppress WSL EIO errors caused by Windows-mounted drives (/mnt/c/ etc.)
// Vite uses multiple internal chokidar watchers; this catches crashes from all of them.
process.on('uncaughtException', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EIO') return;
  throw error;
});

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
});
