import { Encoding, HttpMethod } from '@glyph-cat/foundation'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import { VALID_SANDBOX_NAME_PATTERN } from '~constants'
import { ConflictingSandboxNameError, InvalidSandboxNameError } from '~services/api/errors'
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

    if (existsSync(`./src/pages/sandbox/${name}`)) {
      throw new ConflictingSandboxNameError(name)
    }
    mkdirSync(`./src/pages/sandbox/${name}`)
    writeFileSync(`./src/pages/sandbox/${name}/index.tsx`, [
      'import { View } from \'@glyph-cat/swiss-army-knife-react\'',
      'import clsx from \'clsx\'',
      'import { ReactNode } from \'react\'',
      'import { SandboxContent } from \'~components/sandbox/content\'',
      'import styles from \'./index.module.css\'',
      '',
      'export default function (): ReactNode {',
      '  return (',
      '    <SandboxContent className={styles.container}>',
      '      ',
      '    </SandboxContent>',
      '  )',
      '}',
      '',
    ].join('\n'), Encoding.UTF_8)
    writeFileSync(`./src/pages/sandbox/${name}/index.module.css`, [
      '.container {',
      '}',
      '',
    ].join('\n'), Encoding.UTF_8)
    return emptyResponse(res)
  } catch (e) {
    return genericTryCatchErrorResponseHandler(res, e)
  }
}
