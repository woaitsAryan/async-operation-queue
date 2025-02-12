import type { BuildConfig } from 'bun'
import dts from 'bun-plugin-dts'

const defaultBuildConfig: BuildConfig = {
  entrypoints: ['./src/index.ts', './src/types.ts'],
  outdir: './dist',
  target: 'node',
  minify: true,
  sourcemap: 'none',
}

await Promise.all([
  Bun.build({ 
    ...defaultBuildConfig,
    plugins: [dts()],
    format: 'esm',
  }),
  Bun.build({
    ...defaultBuildConfig,
    format: 'cjs',
  })
])
