import { HttpStatus } from '@glyph-cat/swiss-army-knife'

export class CustomAPIError<Data = unknown> extends Error {

  static readonly http: HttpStatus
  static readonly code: number

  constructor(
    readonly message: string = '<CustomAPIError>',
    readonly data?: Data
  ) {
    super(message)
  }

  get http(): HttpStatus {
    return (this.constructor as typeof CustomAPIError).http
  }

  get code(): number {
    return (this.constructor as typeof CustomAPIError).code
  }

}

// NOTE:
// How to access static members from instance methods in typescript?
// https://stackoverflow.com/a/29244254/5810737
