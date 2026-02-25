import { HttpMethod } from '@glyph-cat/foundation'
import { execSync } from 'child_process'
import { NextApiRequest, NextApiResponse } from 'next'
import { VALID_SANDBOX_NAME_PATTERN } from '~constants'
import { InvalidSandboxNameError } from '~services/api/errors'
import { validateHeaders } from '~services/api/utils/header-validation'
import {
  emptyResponse,
  genericTryCatchErrorResponseHandler,
} from '~services/api/utils/response-handlers'
import { APIOpenSandboxInEditorParams } from './abstractions'

export default async function APIOpenSandboxInEditorHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    validateHeaders(req, [HttpMethod.POST])
    const { sandboxName } = req.body as APIOpenSandboxInEditorParams

    // CodeQL js/command-line-injection
    if (!VALID_SANDBOX_NAME_PATTERN.test(sandboxName)) {
      throw new InvalidSandboxNameError(sandboxName)
    }

    execSync(`code -g "$PWD/src/pages/sandbox/${sandboxName}/index.tsx":10:7`)

    return emptyResponse(res)
  } catch (e) {
    return genericTryCatchErrorResponseHandler(res, e)
  }
}
