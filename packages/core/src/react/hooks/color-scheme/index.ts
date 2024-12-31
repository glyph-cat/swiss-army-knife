import { useMediaQuery } from '../media-query'
import { ColorSchemeType } from '../../../styling/theme/color-scheme'

/**
 * @public
 */
export function useColorScheme(): ColorSchemeType {
  const mq = useMediaQuery('(prefers-color-scheme: dark)')
  return mq ? ColorSchemeType.dark : ColorSchemeType.light
}
