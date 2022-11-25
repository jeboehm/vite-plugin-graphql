import { defineConfig } from 'vite';
import VitePluginGraphQL from '../bundle.js';

export default defineConfig({
  plugins: [
    VitePluginGraphQL({
      queries: {
        usePersistentQuery: true,
        addTypename: false,
      },
    }),
  ],
});
