import { ColorScheme } from '@glyph-cat/swiss-army-knife'
import { useColorScheme as useColorScheme_RN } from 'react-native'

/**
 * @public
 */
export function useColorScheme(): ColorScheme {
  return useColorScheme_RN() === 'dark'
    ? ColorScheme.dark
    : ColorScheme.light
}
