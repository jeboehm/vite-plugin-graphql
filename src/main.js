import { createHash } from 'crypto';
import { promises as fs } from 'fs';

const FILE_REGEX = /\.graphql$/;
const queryHashMap = {};
const config = {
  hashMap: {
    enabled: true,
    path: './queryHashMap.json',
  },
  queries: {
    usePersistentQuery: true,
    addTypename: true,
  },
};

/**
 * @param {String} string
 * @returns {String}
 */
const normalizeGraphQLDocument = (string) => string.replace(/[\s,]+/g, ' ').trim();

const addTypenameToDocument = async (doc) => {
  const apolloUtils = await import('apollo-utilities');

  return apolloUtils.addTypenameToDocument(doc);
};

/**
 * @param {String} query
 * @returns {String}
 */
const createPersistentQuery = (sha256Hash) => {
  const version = 1;

  const queryObj = {
    extensions: {
      persistedQuery: {
        version,
        sha256Hash,
      },
    },
  };

  return JSON.stringify(queryObj);
};

/**
 * Parses a *.graphql file and returns either a persistent query or a normal query.
 *
 * import GetUsers from './graphql/getUsers.graphql'; => GetUsers is a persistent or just normalized query
 * import {query, queryId} from './graphql/getUsers.graphql'; => query is a persistent or just normalized query, queryId is the persistent query id
 *
 * The hash map is written every time a new persistent query is created. (If enabled)
 *
 * @param {String} src
 * @returns {String}
 */
const getCode = async (src) => {
  const graphql = await import('graphql');

  const ast = config.queries.addTypename ? await addTypenameToDocument(graphql.parse(src)) : graphql.parse(src);
  const queryAsString = normalizeGraphQLDocument(graphql.print(ast));
  const sha256Hash = createHash('sha256').update(queryAsString).digest('hex');

  if (config.hashMap.enabled) {
    if (!queryHashMap[sha256Hash]) {
      queryHashMap[sha256Hash] = queryAsString;

      await fs.writeFile(config.hashMap.path, JSON.stringify(queryHashMap));
    }
  }

  if (config.queries.usePersistentQuery) {
    return `
    export const query = Object.freeze(JSON.parse('${createPersistentQuery(sha256Hash)}'));
    export const queryId = '${sha256Hash}';

    export default query;
    `;
  }

  return `
  export const query = \`${queryAsString}\`;
  export const queryId = '${sha256Hash}';

  export default query;
  `;
};

/**
 * Transform a GraphQL query into a string object.
 *
 * @param {String} src
 * @param {String} id
 * @returns {Object<code: String, map: Null>}
 */
const transform = async (src, id) => {
  if (!FILE_REGEX.test(id)) {
    return null;
  }

  const code = await getCode(src);

  return { code, map: null };
};

module.exports = function VitePluginGraphQL(overrideConfig = config) {
  Object.assign(config.hashMap, overrideConfig.hashMap);
  Object.assign(config.queries, overrideConfig.queries);

  return {
    name: 'vite-plugin-graphql',
    transform,
  };
}
