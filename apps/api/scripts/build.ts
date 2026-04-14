import { build } from 'esbuild';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const functionsDir = 'src/functions';
const entryPoints = readdirSync(functionsDir)
  .filter((f) => f.endsWith('.ts'))
  .map((f) => join(functionsDir, f));

await build({
  entryPoints,
  bundle: true,
  platform: 'node',
  target: 'node22',
  outdir: 'dist/src/functions',
  format: 'esm',
  // @azure/functions はランタイムが提供するため外部扱いにする
  external: ['@azure/functions'],
});
