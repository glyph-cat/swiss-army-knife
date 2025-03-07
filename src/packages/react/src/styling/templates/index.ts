import { loadTemplateStyles } from '@glyph-cat/swiss-army-knife'
import { useEffect } from 'react'

/**
 * @public
 */
export function useTemplateStylesLoader(): void {
  useEffect(() => loadTemplateStyles(), [])
}
