// import { recommended as baseRecommended } from './src/bundle-entry-point/base'
// import { recommended as jestRecommended } from './src/bundle-entry-point/jest'
// import { recommended as reactRecommended } from './src/bundle-entry-point/react'
import { recommended as baseRecommended } from './base/lib/index.js'
import { recommended as jestRecommended } from './jest/lib/index.js'
import { recommended as reactRecommended } from './react/lib/index.js'

// TODO: Find out why `rules` is undefined when using CJS syntax, even when the export is `[]`

export default [
  ...baseRecommended,
  ...jestRecommended,
  ...reactRecommended,
  // baseRecommended[0],
  // baseRecommended[1],
  // baseRecommended[2],
  // baseRecommended[3],
]
