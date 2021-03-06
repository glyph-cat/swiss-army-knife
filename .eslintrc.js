const { configs } = require('@glyph-cat/eslint-config')

const strictConfig = configs.strict

module.exports = {
  root: true,
  ...strictConfig,
  rules: {
    ...strictConfig.rules,
    'no-restricted-imports': [
      strictConfig.rules['no-restricted-imports'][0],
      (function () {
        const paths = [...strictConfig.rules['no-restricted-imports'][1].paths]
        const index = paths.findIndex((item) => {
          return item.name === 'react' &&
            item.importNames.includes('useRef') &&
            item.importNames.includes('useLayoutEffect')
        })
        if (index >= 0) {
          paths[index] = {
            name: 'react',
            importNames: ['useRef', 'useLayoutEffect'],
            message: 'Please import the custom hooks from this project instead.',
          }
        }
        return { paths }
      })(),
    ],
  }
}
