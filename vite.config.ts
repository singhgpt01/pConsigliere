import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

const fixWslWatcher: Plugin = {
  name: 'fix-wsl-watcher',
  configureServer(server) {
    server.watcher.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EIO' || error.code === 'ENOENT') {
        // Suppress I/O errors from WSL-mounted Windows drives (/mnt/c/, etc.)
        return;
      }
      throw error;
    });
  }
};

export default defineConfig({
  plugins: [react(), fixWslWatcher],
  server: {
    port: 5173,
    host: true,
    watch: {
      ignored: (path: string) => path.startsWith('/mnt/')
    }
  }
});
