const config = require('./eslint-config/configs/strict')

module.exports = {
  root: true,
  ...config,
  rules: {
    ...config.rules,
    'no-restricted-imports': [
      config.rules['no-restricted-imports'][0],
      (function () {
        const paths = [...config.rules['no-restricted-imports'][1].paths]
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
