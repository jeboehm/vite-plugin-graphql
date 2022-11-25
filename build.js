require('esbuild').buildSync({
  entryPoints: ['src/main.js'],
  bundle: true,
  platform: 'node',
  outfile: 'bundle.js',
});
