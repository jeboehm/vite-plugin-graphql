import { defineConfig } from 'vite';
import VitePluginGraphQL from '../bundle.js';

console.log(VitePluginGraphQL);

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
