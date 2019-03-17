import typescript from 'rollup-plugin-typescript2'

export default {
  input: './src/index.ts',
  plugins: [
    typescript({
      tslib: require('tslib'),
      declaration: true,
    }),
  ],
  external: id => true,
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
