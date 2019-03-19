import typescript from 'rollup-plugin-typescript2'
import alias from 'rollup-plugin-alias'
import path from 'path'
import fs from 'fs'

const external = [
  'path',
  'graphql-tag',
  'express',
  'body-parser',
  'graphql',
  'fs',
  'util',
  'commander',
]

const directiveFiles = fs
  .readdirSync('./src/directives')
  .filter(f => !f.startsWith('_'))
  .map(f => `./src/directives/${f}`)

export default {
  input: ['./src/index.ts', ...directiveFiles],
  plugins: [
    alias({
      resolve: ['.ts'],
      '@app': path.resolve(__dirname, './src'),
    }),
    typescript({
      tslib: require('tslib'),
      declaration: true,
      tsconfig: 'tsconfig.build.json',
    }),
  ],
  external,
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      name: 'graphql-fullstack',
      sourcemap: true,
    },
  ],
}
