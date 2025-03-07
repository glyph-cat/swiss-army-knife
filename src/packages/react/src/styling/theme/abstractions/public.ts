import { Theme } from '@glyph-cat/swiss-army-knife'
import { ReactNode } from 'react'

/**
 * @public
 */
export interface ThemeProviderProps {
  children?: ReactNode
  theme: Theme
}
