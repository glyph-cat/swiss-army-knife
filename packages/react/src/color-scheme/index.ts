import { ColorScheme } from '@glyph-cat/swiss-army-knife'
import { useMediaQuery } from '../media-query'

/**
 * @public
 */
export function useColorScheme(): ColorScheme {
  const mq = useMediaQuery('(prefers-color-scheme: dark)')
  return mq ? ColorScheme.dark : ColorScheme.light
}
