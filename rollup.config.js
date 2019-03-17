import typescript from 'rollup-plugin-typescript2'
import alias from 'rollup-plugin-alias'
import path from 'path'

const external = ['path', 'graphql-tag', 'express', 'body-parser', 'graphql']

export default {
  input: './src/index.ts',
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
      file: 'dist/index.js',
      format: 'cjs',
      name: 'graphql-fullstack',
      sourcemap: true,
    },
    {
      file: 'dist/index.es.js',
      format: 'es',
      sourcemap: true,
    },
  ],
}
