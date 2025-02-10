import { HttpMethod, IS_DEBUG_ENV } from '@glyph-cat/swiss-army-knife'
import { NextApiRequest } from 'next'

export function validateHeaders(
  req: NextApiRequest,
  allowedMethods: Array<HttpMethod>
): void {
  if (IS_DEBUG_ENV) {
    if (allowedMethods.length <= 0) {
      throw new Error('Expected at least 1 `allowedMethods` but received none')
    }
  }
  checkRequestMethod(req, allowedMethods)
}

/**
 * @returns `true` if the request method matches the allowed ones.
 */
function getRequestMethodValidity(
  req: NextApiRequest,
  allowedMethods: Array<HttpMethod>
): boolean {
  return allowedMethods.includes(req.method as HttpMethod)
}

/**
 * Throws an error if the request method does not match the allowed ones.
 */
function checkRequestMethod(
  req: NextApiRequest,
  allowedMethods: Array<HttpMethod>
): void {
  const isMethodValid = getRequestMethodValidity(req, allowedMethods)
  if (!isMethodValid) {
    throw new Error(`Invalid method: ${req.method}`)
  }
}
