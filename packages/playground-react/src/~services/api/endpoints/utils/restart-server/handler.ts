import { Encoding, HttpMethod } from '@glyph-cat/swiss-army-knife'
import { readFileSync, writeFileSync } from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import { validateHeaders } from '~services/api/utils/header-validation'
import {
  emptyResponse,
  genericTryCatchErrorResponseHandler,
} from '~services/api/utils/response-handlers'

export default async function APIUtilsRestartServer(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    validateHeaders(req, [HttpMethod.GET])
    const nextConfigPath = './next.config.ts'
    const fileContents = readFileSync(nextConfigPath, Encoding.UTF_8)
    // No file changes are required; ctrl/cmd + S is enough to trigger it... for now
    writeFileSync(
      nextConfigPath,
      fileContents,
      Encoding.UTF_8,
    )
    return emptyResponse(res)
  } catch (e) {
    return genericTryCatchErrorResponseHandler(res, e)
  }
}
