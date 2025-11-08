import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'

// Reference: https://eslint.org/docs/latest/use/configure/migration-guide#using-eslintrc-configs-in-flat-config

const __dirname = path.dirname(__filename)

export const compat = new FlatCompat({
  baseDirectory: __dirname
})
