import * as fs from 'fs'
import { name as PACKAGE_NAME } from '../../../package.json'
import { ENCODING_UTF_8 } from '../../constants'

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

function run(): void {

  const REPLACEMENTS = {
    'PACKAGE_NAME': PACKAGE_NAME,
  }

  const FILES_TO_PROCESS = [
    './lib/types/index.d.ts',
  ]

  console.log('Post-processing docs...')
  for (const filePath of FILES_TO_PROCESS) {
    console.log(` * ${filePath}`)
    let fileContents = fs.readFileSync(filePath, ENCODING_UTF_8)
    for (const replacementKey in REPLACEMENTS) {
      const replacementValue = REPLACEMENTS[replacementKey]
      fileContents = fileContents.replace(
        new RegExp(`{:${replacementKey}:}`, 'g'),
        replacementValue
      )
    }
    // console.log(fileContents)
    fs.writeFileSync(filePath, fileContents, ENCODING_UTF_8)
  }


}

// run()
