import { ColorSchemeType } from '@glyph-cat/swiss-army-knife'
import { useColorScheme as useColorScheme_RN } from 'react-native'

/**
 * @public
 */
export function useColorScheme(): ColorSchemeType {
  return useColorScheme_RN() === 'dark'
    ? ColorSchemeType.dark
    : ColorSchemeType.light
}
