import * as fs from 'fs'
import { name as PACKAGE_NAME } from '../../package.json'
import { forEachChild } from '../../src/data/object/for-each/for-each-child'

// Example usage:
// /**
//  * @example
//  * import { example } from '{:PACKAGE_NAME:}'
//  *
//  * example()
//  */
// function example(): void {
//   return undefined
// }

const REPLACEMENTS = {
  'PACKAGE_NAME': PACKAGE_NAME,
  'ColorFormatIgnoreAlphaDescription': '// Note: If alpha is not equals to `1`, then it will be included anyway.',
}

const FILES_TO_PROCESS = [
  './lib/types/index.d.ts',
]

console.log('Post-processing docs...')
for (const filePath of FILES_TO_PROCESS) {
  console.log(` * ${filePath}`)
  let fileContents = fs.readFileSync(filePath, 'utf-8')
  forEachChild(REPLACEMENTS, (replacementKey, replacementValue) => {
    fileContents = fileContents.replace(
      new RegExp(`{:${replacementKey}:}`, 'g'),
      replacementValue
    )
  })
  // console.log(fileContents)
  fs.writeFileSync(filePath, fileContents, 'utf-8')
}
