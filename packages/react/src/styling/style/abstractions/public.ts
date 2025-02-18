import { PrecedenceLevel } from '@glyph-cat/swiss-army-knife'

/**
 * @public
 */
export interface StyleProps {
  children?: string | Array<string>
  precedence?: PrecedenceLevel
}
