import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
  plugins: [tailwindcss(), cloudflare()],
  environments: {
    client: {
      build: {
        rollupOptions: {
          input: {
            main: 'index.html',
            admin: 'admin.html',
          },
        },
      },
    },
  },
});
