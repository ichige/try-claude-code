import * as esbuild from 'esbuild';
import { glob } from 'node:fs/promises';

const entryPoints = await Array.fromAsync(glob('src/**/*.ts'));

await esbuild.build({
  entryPoints,
  outbase: 'src',
  outdir: 'dist/src',
  bundle: true,
  platform: 'node',
  format: 'esm',
  external: ['@azure/functions'],
});
