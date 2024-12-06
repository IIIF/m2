import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';
import * as packageJson from './package.json';

/**
* Vite configuration
*/
export default defineConfig({
  ...(
    process.env.NETLIFY ? {
      build: {
        rollupOptions: {
          external: ['__tests__/*', '__mocks__/*'],
          input: Object.fromEntries(
            globSync('./__tests__/integration/mirador/*.html').map((file) => [
              // This remove `src/` as well as the file extension from each
              // file, so e.g. src/nested/foo.js becomes nested/foo
              path.relative(
                '__tests__/integration/mirador',
                file.slice(0, file.length - path.extname(file).length),
              ),
              // This expands the relative paths to absolute paths, so e.g.
              // src/nested/foo becomes /project/src/nested/foo.js
              fileURLToPath(new URL(file, import.meta.url)),
            ]),
          ),
        },
        sourcemap: true,
      },
    } : {
      build: {
        lib: {
          entry: './src/index.js',
          fileName: (format) => (format === 'umd' ? 'mirador.js' : 'mirador.es.js'),
          formats: ['es', 'umd'],
          name: 'Mirador',
        },
        rollupOptions: {
          external: [
            ...Object.keys(packageJson.peerDependencies),
            '__tests__/*',
            '__mocks__/*',
          ],
          output: {
            assetFileNames: 'mirador.[ext]',
            exports: 'named',
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
        sourcemap: true,
      },
    }
  ),
  define: {
    'process.env': {},
  },
  esbuild: {
    exclude: [],
    // Matches .js and .jsx in __tests__ and .jsx in src
    include: [/__tests__\/.*\.(js|jsx)$/, /src\/.*\.jsx?$/],
    loader: 'jsx',
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          // TODO: rename all our files to .jsx ...
          /** */
          setup(build) {
            build.onLoad({ filter: /(src|__tests__)\/.*\.js$/ }, async (args) => ({
              contents: await fs.readFile(args.path, 'utf8'),
              loader: 'jsx',
            }));
          },
        },
      ],
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@tests/': fileURLToPath(new URL('./__tests__', import.meta.url)),
    },
  },
  server: {
    open: '/__tests__/integration/mirador/index.html',
    port: '4444',
  },
});
