import * as esbuild from 'esbuild';
import { glob, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });

const entryPoints = await Array.fromAsync(glob('src/**/*.ts'));

await esbuild.build({
  entryPoints,
  outbase: 'src',
  outdir: 'dist/src',
  bundle: true,
  splitting: true,
  platform: 'node',
  format: 'esm',
  external: ['@azure/functions', '@azure/cosmos', '@azure/identity', '@microsoft/applicationinsights-web', '@azure/msal-browser'],
});
