/* eslint-disable no-undef */
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
