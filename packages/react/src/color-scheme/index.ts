import { ColorSchemeType } from '@glyph-cat/swiss-army-knife'
import { useMediaQuery } from '../media-query'

/**
 * @public
 */
export function useColorScheme(): ColorSchemeType {
  const mq = useMediaQuery('(prefers-color-scheme: dark)')
  return mq ? ColorSchemeType.dark : ColorSchemeType.light
}
