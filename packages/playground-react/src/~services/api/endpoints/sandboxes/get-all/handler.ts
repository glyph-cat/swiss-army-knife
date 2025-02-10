import { HttpMethod } from '@glyph-cat/swiss-army-knife'
import { readdirSync, statSync } from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import { validateHeaders } from '~services/api/utils/header-validation'
import {
  genericTryCatchErrorResponseHandler,
  jsonResponse,
} from '~services/api/utils/response-handlers'
import { APIGetAllSandboxesReturnData } from './abstractions'

export default async function APIGetAllSandboxesHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    validateHeaders(req, [HttpMethod.GET])
    const sandboxesPath = './src/~sandboxes'
    const sandboxes = readdirSync(sandboxesPath).filter((item) => {
      return statSync(`${sandboxesPath}/${item}`).isDirectory()
    })
    return jsonResponse<APIGetAllSandboxesReturnData>(res, sandboxes)
  } catch (e) {
    return genericTryCatchErrorResponseHandler(res, e)
  }
}
