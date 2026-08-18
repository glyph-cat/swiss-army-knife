/** @type {import('@babel/core').TransformOptions} */
module.exports = {
  env: {
    test: {
      presets: [
        '@babel/preset-typescript',
      ],
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
  },
}
