/* eslint-disable @stylistic/padded-blocks */
import { HttpStatus } from '@glyph-cat/swiss-army-knife'
import { CustomAPIError } from './base'
import { CustomErrorCode } from './codes'

/**
 * Use this to compose a custom message for niche internal errors.
 */
export class InternalAPIError extends CustomAPIError {
  static readonly http = HttpStatus.INTERNAL_ERROR
  static readonly code = CustomErrorCode.INTERNAL_API
}
