import { HttpMethod } from '@glyph-cat/swiss-army-knife'
import { execSync } from 'child_process'
import { NextApiRequest, NextApiResponse } from 'next'
import { validateHeaders } from '~services/api/utils/header-validation'
import {
  emptyResponse,
  genericTryCatchErrorResponseHandler,
} from '~services/api/utils/response-handlers'
import { APIOpenSandboxInEditorParams } from './abstractions'

export default async function APIOpenSandboxInCodeHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    validateHeaders(req, [HttpMethod.POST])
    const { sandboxName } = req.body as APIOpenSandboxInEditorParams
    execSync(`code "$PWD/src/~sandboxes/${sandboxName}/index.tsx"`)
    return emptyResponse(res)
  } catch (e) {
    return genericTryCatchErrorResponseHandler(res, e)
  }
}
