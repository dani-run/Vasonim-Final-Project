import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import dns from 'node:dns';

import tsconfigPaths from "vite-tsconfig-paths";
dns.setDefaultResultOrder('verbatim');
installGlobals();

export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5173', // Your web server address
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
  },
  hmr: {
    clientPort: 5173,
    port: 5173,
    overlay: true
  },
  strictPort: true,
}});
