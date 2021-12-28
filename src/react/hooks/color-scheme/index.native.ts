import { useColorScheme as useColorScheme_RN } from 'react-native'
import { ColorSchemeType } from '../../../styling/theme/color-scheme'

/**
 * @public
 */
export function useColorScheme(): ColorSchemeType {
  return useColorScheme_RN() === 'dark'
    ? ColorSchemeType.dark
    : ColorSchemeType.light
}
