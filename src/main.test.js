const VitePluginGraphQL = require('../bundle.js');
const fs = require('fs');
const path = require('path');

async function transformFile(plugin) {
    const filename = path.join(__dirname, 'getUsers.graphql');
    const file = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });

    return plugin.transform(file, filename);
}

test('VitePluginGraphQL is a function', () => {
    expect(typeof VitePluginGraphQL).toBe('function');
});

test('Can transform a file to persisted query', async () => {
    const plugin = VitePluginGraphQL({
        hashMap: {
            enabled: true,
            path: './queryHashMap.json',
        },
        queries: {
            usePersistentQuery: true,
            addTypename: true,
        },
    });

    const transformedResult = await transformFile(plugin);

    expect(transformedResult.code).toMatch(/export const query = Object.freeze/);
    expect(transformedResult.code).toMatch(/f5c98ffe87857f531ba053f6fc311404be292d10e22b499089e795599deadf7d/);
});

test('Can transform a file query with typenames', async () => {
    const plugin = VitePluginGraphQL({
        hashMap: {
            enabled: true,
            path: './queryHashMap.json',
        },
        queries: {
            usePersistentQuery: false,
            addTypename: true,
        },
    });

    const transformedResult = await transformFile(plugin);

    expect(transformedResult.code).toMatch(/id name amountBooked amountPerformed notes bookings/);
    expect(transformedResult.code).toMatch(/__typename/);
});

test('Can build a hash map', async () => {
    const plugin = VitePluginGraphQL({
        hashMap: {
            enabled: true,
            path: './queryHashMap.json',
        },
        queries: {
            usePersistentQuery: false,
            addTypename: true,
        },
    });

    const generatedFile = fs.readFileSync('./queryHashMap.json', { encoding: 'utf8', flag: 'r' });

    expect(generatedFile).toMatch(/f5c98ffe87857f531ba053f6fc311404be292d10e22b499089e795599deadf7d/);
    expect(generatedFile).toMatch(/id name amountBooked amountPerformed notes bookings/);
});
