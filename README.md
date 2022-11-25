# vite-plugin-graphql
This plugin is used to import GraphQL queries.

It will transform the query into a string, either as a persisted query or a raw, normalized query. To use persisted queries server side
a hash map is written to a file.
If needed, the magic field __typename can be added to all query fields.

## Getting started
Install the plugin:

```bash
npm install --save-dev @jeboehm/vite-plugin-graphql
```

Add the plugin to your `vite.config.js`:

```js
import { defineConfig } from 'vite';
import VitePluginGraphQL from 'vite-plugin-graphql';

export default defineConfig(({mode}) => {
  return {
    plugins: [
        VitePluginGraphQL({
            hashMap: {
                enabled: mode === 'production',
                path: './queryHashMap.json',
            },
            queries: {
                usePersistentQuery: mode === 'production',
                addTypename: true,
            }
        }),
    ],
  };
});
```

## Usage

```js
// query is the default export
import {query, queryId} from './graphql/getUsers.graphql';

// query is either an object or string
console.log('Query:', query);
console.log('Query ID:', queryId);
```
