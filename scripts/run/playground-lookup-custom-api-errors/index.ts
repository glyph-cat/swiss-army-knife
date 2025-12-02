import { writeFileSync } from 'fs'
import { DO_NOT_MODIFY_WARNING } from '../../../src/packages/core/src/scripting/constants'
import { Encoding } from '../../../src/packages/foundation/src/encoding'
import * as AllCustomAPIErrors from '../../../src/~services/api/errors/list'

const keyValuePairs: Array<string> = []

for (const errorName in AllCustomAPIErrors) {
  keyValuePairs.push(`[${errorName}.code]: ${errorName}`)
}

const fileBody: Array<string> = [
  DO_NOT_MODIFY_WARNING,
  '',
  `import {${Object.keys(AllCustomAPIErrors).join(', ')}} from '../list'`,
  '',
  `export const LookupDictionary = { ${keyValuePairs.join(', ')} }`,
  '',
]

writeFileSync(
  './src/~services/api/errors/try-parse/lookup.scripted.ts',
  fileBody.join('\n'),
  Encoding.UTF_8,
)
