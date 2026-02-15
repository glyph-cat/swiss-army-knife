/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDisposable, UnsupportedPlatformError } from '@glyph-cat/foundation'
import { CSSPropertiesExtended } from '../../abstractions'
import { PrecedenceLevel } from '../add-styles'
import { StyleMap } from '../style-map'

/**
 * @public
 */
export class StyleManager extends StyleMap implements IDisposable {

  constructor(
    initialStyles: Iterable<readonly [string, CSSPropertiesExtended]> = [],
    readonly precedenceLevel?: PrecedenceLevel,
  ) {
    super()
    throw new UnsupportedPlatformError()
  }

  set(key: string, value: CSSPropertiesExtended): this {
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
