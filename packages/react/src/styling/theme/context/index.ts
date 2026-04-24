import { CSSVariableRecord, Theme } from '@glyph-cat/swiss-army-knife'
import { useContext } from 'react'
import { ThemeContext } from '../constants'

/**
 * React hook for the ThemeContext.
 *
 * It is advisable to wrap this in your own `useTheme` hook in a file in your project.
 * Then, throughout the project, import useTheme from that file instead of importing
 * it directly from this library.
 *
 * This is so that when there are drastic API changes, only one file needs to be
 * changed to compensate for that while the remaining parts of the project remains
 * unaffected.
 * @public
 */
export function useThemeContext<
  CustomValues extends CSSVariableRecord = CSSVariableRecord,
>(): Theme<CustomValues> {
  return useContext(ThemeContext) as Theme<CustomValues>
}
