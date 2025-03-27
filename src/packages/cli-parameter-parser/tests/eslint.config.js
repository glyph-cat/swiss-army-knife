const { Severity } = require('@glyph-cat/eslint-config')

module.exports = {
  rules: {
    '@typescript-eslint/no-unused-vars': Severity.WARN,
    'no-console': Severity.WARN,
  }
}
