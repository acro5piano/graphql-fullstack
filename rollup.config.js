import typescript from 'rollup-plugin-typescript2'
import babel from 'rollup-plugin-babel'

export default {
  input: './src/index.ts',
  plugins: [
    typescript({
      tslib: require('tslib'),
      declaration: true,
      tsconfig: 'tsconfig.build.json',
    }),
    babel(),
  ],
  external: id => false,
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
