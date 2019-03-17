/*
 * Babel is only used in build.
 */
module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@app': './src',
        },
      },
    ],
  ],
}
