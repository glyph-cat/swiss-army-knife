import { PrecedenceLevel } from '@glyph-cat/css-utils'

/**
 * @public
 */
export interface StyleProps {
  children?: string | Array<string>
  precedence?: PrecedenceLevel
}
