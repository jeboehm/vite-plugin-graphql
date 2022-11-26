# vite-plugin-graphql
[![Node.js CI](https://github.com/jeboehm/vite-plugin-graphql/actions/workflows/test.yaml/badge.svg)](https://github.com/jeboehm/vite-plugin-graphql/actions/workflows/test.yaml)

This plugin is used to import GraphQL queries.

## Features
- Import normalized queries as string type
- Collect all used queries / mutation in the application and transmit only hashes to save bandwidth using persistent queries
- Builds a persistent query hash map for use on server side
- Automatically add `__typename` to requested types in queries

## Getting started
Install the plugin:

```bash
npm install --save-dev @jeboehm/vite-plugin-graphql
```

Add the plugin to your `vite.config.js`:

```js
import { defineConfig } from 'vite';
import VitePluginGraphQL from '@jeboehm/vite-plugin-graphql';

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
