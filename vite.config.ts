import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import handler from './api/enquire';

// Suppress WSL EIO errors caused by Windows-mounted drives (/mnt/c/ etc.)
// Vite uses multiple internal chokidar watchers; this catches crashes from all of them.
process.on('uncaughtException', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EIO') return;
  throw error;
});

const enquiryApiPlugin = (): Plugin => ({
  name: 'enquiry-api-dev-middleware',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url && req.url.startsWith('/api/enquire')) {
        try {
          await handler(req, res);
        } catch (err) {
          console.error('[DEV_API_ERROR]', err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
          }
        }
      } else {
        next();
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), enquiryApiPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
