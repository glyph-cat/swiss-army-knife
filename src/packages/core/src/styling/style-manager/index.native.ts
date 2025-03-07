/* eslint-disable @typescript-eslint/no-unused-vars */
import { UnsupportedPlatformError } from '../../error'
import { IDisposable } from '../../types'
import { ExtendedCSSProperties } from '../abstractions'
import { PrecedenceLevel } from '../add-styles'
import { StyleMap } from '../style-map'

/**
 * @public
 */
export class StyleManager extends StyleMap implements IDisposable {

  constructor(
    initialStyles: Iterable<readonly [string, ExtendedCSSProperties]> = [],
    readonly precedenceLevel?: PrecedenceLevel
  ) {
    super() // KIV
    throw new UnsupportedPlatformError()
  }

  set(key: string, value: ExtendedCSSProperties): this {
    throw new UnsupportedPlatformError()
  }

  delete(key: string): boolean {
    throw new UnsupportedPlatformError()
  }

  clear(): void {
    throw new UnsupportedPlatformError()
  }

  dispose(): void {
    throw new UnsupportedPlatformError()
  }

}
