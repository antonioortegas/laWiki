// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///E:/Users/Nacho/Desktop/UMA/4o/Ingenieria%20web/Practica/laWiki/frontend/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/Users/Nacho/Desktop/UMA/4o/Ingenieria%20web/Practica/laWiki/frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueDevTools from "file:///E:/Users/Nacho/Desktop/UMA/4o/Ingenieria%20web/Practica/laWiki/frontend/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import dotenv from "file:///E:/Users/Nacho/Desktop/UMA/4o/Ingenieria%20web/Practica/laWiki/frontend/node_modules/dotenv/lib/main.js";
var __vite_injected_original_import_meta_url = "file:///E:/Users/Nacho/Desktop/UMA/4o/Ingenieria%20web/Practica/laWiki/frontend/vite.config.js";
dotenv.config();
var env = process.env.VITE_NODE_ENV || "development";
var usersApiHost = env === "local" ? "http://localhost:3001/" : process.env.VITE_USERS_API_HOST;
var wikisApiHost = env === "local" ? "http://localhost:3002/" : process.env.VITE_WIKIS_API_HOST;
var entriesApiHost = env === "local" ? "http://localhost:3003/" : process.env.VITE_ENTRIES_API_HOST;
var versionsApiHost = env === "local" ? "http://localhost:3004/" : process.env.VITE_VERSIONS_API_HOST;
var picturesApiHost = env === "local" ? "http://localhost:4000/" : process.env.VITE_PICTURES_API_HOST;
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueDevTools()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    proxy: {
      // users
      "/api/users": {
        target: usersApiHost,
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
      // wikis
      "/api/wikis": {
        target: wikisApiHost,
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
      // entries
      "/api/entries": {
        target: entriesApiHost,
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
      // versions
      "/api/versions": {
        target: versionsApiHost,
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
      // pictures
      "/api/cloudinary": {
        target: picturesApiHost,
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxVc2Vyc1xcXFxOYWNob1xcXFxEZXNrdG9wXFxcXFVNQVxcXFw0b1xcXFxJbmdlbmllcmlhIHdlYlxcXFxQcmFjdGljYVxcXFxsYVdpa2lcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFVzZXJzXFxcXE5hY2hvXFxcXERlc2t0b3BcXFxcVU1BXFxcXDRvXFxcXEluZ2VuaWVyaWEgd2ViXFxcXFByYWN0aWNhXFxcXGxhV2lraVxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovVXNlcnMvTmFjaG8vRGVza3RvcC9VTUEvNG8vSW5nZW5pZXJpYSUyMHdlYi9QcmFjdGljYS9sYVdpa2kvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcclxuXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgdnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJ1xyXG5pbXBvcnQgZG90ZW52IGZyb20gJ2RvdGVudic7XHJcbmRvdGVudi5jb25maWcoKTtcclxuXHJcbmNvbnN0IGVudiA9IHByb2Nlc3MuZW52LlZJVEVfTk9ERV9FTlYgfHwgJ2RldmVsb3BtZW50JztcclxuLy8gaWYgZW52IGlzICdsb2NhbCcsIHVzZSBsb2NhbGhvc3QsIG90aGVyd2lzZSB1c2UgdGhlIHZhbHVlIGZyb20gLmVudiBmaWxlXHJcbmNvbnN0IHVzZXJzQXBpSG9zdCA9IGVudiA9PT0gJ2xvY2FsJyA/ICdodHRwOi8vbG9jYWxob3N0OjMwMDEvJyA6IHByb2Nlc3MuZW52LlZJVEVfVVNFUlNfQVBJX0hPU1Q7XHJcbmNvbnN0IHdpa2lzQXBpSG9zdCA9IGVudiA9PT0gJ2xvY2FsJyA/ICdodHRwOi8vbG9jYWxob3N0OjMwMDIvJyA6IHByb2Nlc3MuZW52LlZJVEVfV0lLSVNfQVBJX0hPU1Q7XHJcbmNvbnN0IGVudHJpZXNBcGlIb3N0ID0gZW52ID09PSAnbG9jYWwnID8gJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMy8nIDogcHJvY2Vzcy5lbnYuVklURV9FTlRSSUVTX0FQSV9IT1NUO1xyXG5jb25zdCB2ZXJzaW9uc0FwaUhvc3QgPSBlbnYgPT09ICdsb2NhbCcgPyAnaHR0cDovL2xvY2FsaG9zdDozMDA0LycgOiBwcm9jZXNzLmVudi5WSVRFX1ZFUlNJT05TX0FQSV9IT1NUO1xyXG5jb25zdCBwaWN0dXJlc0FwaUhvc3QgPSBlbnYgPT09ICdsb2NhbCcgPyAnaHR0cDovL2xvY2FsaG9zdDo0MDAwLycgOiBwcm9jZXNzLmVudi5WSVRFX1BJQ1RVUkVTX0FQSV9IT1NUO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICB2dWVEZXZUb29scygpLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgIH0sXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHByb3h5OiB7XHJcbiAgICAgIC8vIHVzZXJzXHJcbiAgICAgICcvYXBpL3VzZXJzJzoge1xyXG4gICAgICAgIHRhcmdldDogdXNlcnNBcGlIb3N0LFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogZmFsc2UsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcclxuICAgICAgfSxcclxuICAgICAgLy8gd2lraXNcclxuICAgICAgJy9hcGkvd2lraXMnOiB7XHJcbiAgICAgICAgdGFyZ2V0OiB3aWtpc0FwaUhvc3QsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiBmYWxzZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxyXG4gICAgICB9LFxyXG4gICAgICAvLyBlbnRyaWVzXHJcbiAgICAgICcvYXBpL2VudHJpZXMnOiB7XHJcbiAgICAgICAgdGFyZ2V0OiBlbnRyaWVzQXBpSG9zdCxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IGZhbHNlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIHZlcnNpb25zXHJcbiAgICAgICcvYXBpL3ZlcnNpb25zJzoge1xyXG4gICAgICAgIHRhcmdldDogdmVyc2lvbnNBcGlIb3N0LFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogZmFsc2UsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcclxuICAgICAgfSxcclxuICAgICAgLy8gcGljdHVyZXNcclxuICAgICAgJy9hcGkvY2xvdWRpbmFyeSc6IHtcclxuICAgICAgICB0YXJnZXQ6IHBpY3R1cmVzQXBpSG9zdCxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IGZhbHNlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVosU0FBUyxlQUFlLFdBQVc7QUFFMWIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sWUFBWTtBQUxrUCxJQUFNLDJDQUEyQztBQU10VCxPQUFPLE9BQU87QUFFZCxJQUFNLE1BQU0sUUFBUSxJQUFJLGlCQUFpQjtBQUV6QyxJQUFNLGVBQWUsUUFBUSxVQUFVLDJCQUEyQixRQUFRLElBQUk7QUFDOUUsSUFBTSxlQUFlLFFBQVEsVUFBVSwyQkFBMkIsUUFBUSxJQUFJO0FBQzlFLElBQU0saUJBQWlCLFFBQVEsVUFBVSwyQkFBMkIsUUFBUSxJQUFJO0FBQ2hGLElBQU0sa0JBQWtCLFFBQVEsVUFBVSwyQkFBMkIsUUFBUSxJQUFJO0FBQ2pGLElBQU0sa0JBQWtCLFFBQVEsVUFBVSwyQkFBMkIsUUFBUSxJQUFJO0FBR2pGLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFlBQVk7QUFBQSxFQUNkO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBO0FBQUEsTUFFTCxjQUFjO0FBQUEsUUFDWixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUEsTUFDOUM7QUFBQTtBQUFBLE1BRUEsY0FBYztBQUFBLFFBQ1osUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLE1BQzlDO0FBQUE7QUFBQSxNQUVBLGdCQUFnQjtBQUFBLFFBQ2QsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLE1BQzlDO0FBQUE7QUFBQSxNQUVBLGlCQUFpQjtBQUFBLFFBQ2YsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLE1BQzlDO0FBQUE7QUFBQSxNQUVBLG1CQUFtQjtBQUFBLFFBQ2pCLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxNQUM5QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
