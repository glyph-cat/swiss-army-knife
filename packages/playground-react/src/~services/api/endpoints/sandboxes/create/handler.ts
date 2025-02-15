import { Encoding, HttpMethod } from '@glyph-cat/swiss-army-knife'
import { writeFileSync } from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import { VALID_SANDBOX_NAME_PATTERN } from '~constants'
import { InvalidSandboxNameError } from '~services/api/errors'
import { validateHeaders } from '~services/api/utils/header-validation'
import {
  emptyResponse,
  genericTryCatchErrorResponseHandler,
} from '~services/api/utils/response-handlers'
import { APICreateSandboxParams } from './abstractions'

export default async function APICreateSandboxHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    validateHeaders(req, [HttpMethod.POST])
    const { name } = req.body as APICreateSandboxParams
    if (!VALID_SANDBOX_NAME_PATTERN.test(name)) {
      throw new InvalidSandboxNameError(name)
    }
    writeFileSync(`./src/~sandboxes/${name}/index.tsx`, [
      'import { c } from \'@glyph-cat/swiss-army-knife\'',
      'import { JSX } from \'react\'',
      'import { SandboxStyle } from \'~constants\'',
      'import { View } from \'~core-ui\'',
      'import styles from \'./index.module.css\'',
      '',
      'export default function (): JSX.Element {',
      '  return (',
      '    <View className={c(SandboxStyle.NORMAL, styles.container)}>',
      '      { /* ... */ }',
      '    </View>',
      '  )',
      '}',
      '',
    ].join('\n'), Encoding.UTF_8)
    writeFileSync(`./src/~sandboxes/${name}/index.module.css`, [
      '.container {',
      '}',
      '',
    ].join('\n'), Encoding.UTF_8)
    return emptyResponse(res)
  } catch (e) {
    return genericTryCatchErrorResponseHandler(res, e)
  }
}
