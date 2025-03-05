import { ITheme } from '@glyph-cat/swiss-army-knife'
import { useContext } from 'react'
import { ThemeContext } from './constants'

/**
 * @public
 */
export function useTheme(): ITheme {
  return useContext(ThemeContext)
}

// #region Miscellaneous exports
export * from './provider'
// #endregion Miscellaneous exports
