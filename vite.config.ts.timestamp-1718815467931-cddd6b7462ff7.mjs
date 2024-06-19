// vite.config.ts
import { vitePlugin as remix } from "file:///C:/Users/danim/Desktop/FINAL/node_modules/@remix-run/dev/dist/index.js";
import { installGlobals } from "file:///C:/Users/danim/Desktop/FINAL/node_modules/@remix-run/node/dist/index.js";
import { defineConfig } from "file:///C:/Users/danim/Desktop/FINAL/node_modules/vite/dist/node/index.js";
import dns from "node:dns";
import tsconfigPaths from "file:///C:/Users/danim/Desktop/FINAL/node_modules/vite-tsconfig-paths/dist/index.mjs";
dns.setDefaultResultOrder("verbatim");
installGlobals();
var vite_config_default = defineConfig({
  plugins: [
    remix(),
    tsconfigPaths()
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5173",
        // Your web server address
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    },
    hmr: {
      clientPort: 5173,
      port: 5173,
      overlay: true
    },
    strictPort: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkYW5pbVxcXFxEZXNrdG9wXFxcXEZJTkFMXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkYW5pbVxcXFxEZXNrdG9wXFxcXEZJTkFMXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9kYW5pbS9EZXNrdG9wL0ZJTkFML3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peCB9IGZyb20gXCJAcmVtaXgtcnVuL2RldlwiO1xuaW1wb3J0IHsgaW5zdGFsbEdsb2JhbHMgfSBmcm9tIFwiQHJlbWl4LXJ1bi9ub2RlXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IGRucyBmcm9tICdub2RlOmRucyc7XG5cbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XG5kbnMuc2V0RGVmYXVsdFJlc3VsdE9yZGVyKCd2ZXJiYXRpbScpO1xuaW5zdGFsbEdsb2JhbHMoKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlbWl4KCksIFxuICAgIHRzY29uZmlnUGF0aHMoKSxcbiAgXSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNTE3MyxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTE3MycsIC8vIFlvdXIgd2ViIHNlcnZlciBhZGRyZXNzXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKVxuICAgICAgfVxuICB9LFxuICBobXI6IHtcbiAgICBjbGllbnRQb3J0OiA1MTczLFxuICAgIHBvcnQ6IDUxNzMsXG4gICAgb3ZlcmxheTogdHJ1ZVxuICB9LFxuICBzdHJpY3RQb3J0OiB0cnVlLFxufX0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnUixTQUFTLGNBQWMsYUFBYTtBQUNwVCxTQUFTLHNCQUFzQjtBQUMvQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFFaEIsT0FBTyxtQkFBbUI7QUFDMUIsSUFBSSxzQkFBc0IsVUFBVTtBQUNwQyxlQUFlO0FBRWYsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQUMsTUFBTTtBQUFBLElBQ2QsY0FBYztBQUFBLEVBQ2hCO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxNQUM5QztBQUFBLElBQ0o7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILFlBQVk7QUFBQSxNQUNaLE1BQU07QUFBQSxNQUNOLFNBQVM7QUFBQSxJQUNYO0FBQUEsSUFDQSxZQUFZO0FBQUEsRUFDZDtBQUFDLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
