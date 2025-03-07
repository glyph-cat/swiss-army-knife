import { JSX } from 'react'
import { Style } from '../../styling'
import { MaterialSymbolOptions, MaterialSymbolVariant } from '../abstractions'

/**
 * @public
 */
export interface MaterialSymbolsOnlineLoaderProps {
  variants: Array<MaterialSymbolVariant>
}

/**
 * @public
 */
export function MaterialSymbolsOnlineLoader({
  variants,
}: MaterialSymbolsOnlineLoaderProps): JSX.Element {
  return (
    <Style>
      {variants.map((variant) => {
        return `@import url(${getFontStyleSheetURL(variant)})`
      }).join('\n')}
    </Style>
  )
}

function getCapitalizedVariantName(variant: MaterialSymbolOptions['variant']): string {
  switch (variant) {
    case 'outlined': return 'Outlined'
    case 'rounded': return 'Rounded'
    case 'sharp': return 'Sharp'
  }
}

function getFontStyleSheetURL(variant: MaterialSymbolOptions['variant']): string {
  return `https://fonts.googleapis.com/css2?family=Material+Symbols+${getCapitalizedVariantName(variant)}:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200`
}
