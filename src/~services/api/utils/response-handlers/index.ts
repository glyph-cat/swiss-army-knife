import { HttpStatus } from '@glyph-cat/foundation'
import { devError } from '@glyph-cat/swiss-army-knife'
import { NextApiResponse } from 'next'
import { CustomAPIError } from '~services/api/errors/base'

export function jsonResponse<D>(
  res: NextApiResponse,
  jsonData: D
): void {
  res.status(HttpStatus.OK).json(jsonData)
}

export function simpleResponse<T>(res: NextApiResponse, value: T): void {
  res.status(HttpStatus.OK).send(value)
}

export function emptyResponse(res: NextApiResponse): void {
  res.status(HttpStatus.NO_CONTENT).end()
}

function customErrorResponse(
  res: NextApiResponse,
  error: CustomAPIError,
): void {
  res.status(error.http).json({
    code: error.code,
    message: error.message,
    ...(error.data ? { data: error.data } : {}),
  })
}

function internalServerErrorResponse(res: NextApiResponse, error: Error): void {
  res.status(HttpStatus.INTERNAL_ERROR).send(error)
}

export function genericTryCatchErrorResponseHandler(
  res: NextApiResponse,
  error: Error
): void {
  if (error instanceof CustomAPIError) {
    return customErrorResponse(res, error)
  } else {
    devError(error)
    return internalServerErrorResponse(res, error)
  }
}
