import { InternalError } from '@glyph-cat/foundation'

/**
 * @public
 */
export class InvalidColorStringError extends Error {

  static formatMessage(value: string): string {
    return `Invalid color string "${value}"`
  }

  constructor(value: string) {
    super(`Invalid color string "${value}"`)
  }

}

/**
 * @public
 */
export class InvalidColorValueError extends Error {

  constructor(readonly value: unknown) {
    super('Invalid color value')
  }

}

/**
 * @public
 */
export class InvalidColorRangeError extends Error {

  constructor(
    readonly propertyName: string,
    readonly value: number,
    readonly minValue: number,
    readonly maxValue: number,
  ) {
    super(`Expected \`${propertyName}\` to be between ${minValue} and ${maxValue} but received ${value}`)
  }

}

/**
 * @public
 */
export class MalformedColorSourceError extends InternalError { }
