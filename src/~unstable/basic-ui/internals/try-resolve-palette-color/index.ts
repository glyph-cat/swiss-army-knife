import { IThemePalette, LenientString } from '@glyph-cat/swiss-army-knife'
import { BasicUIColor } from '../../abstractions'

export function tryResolvePaletteColor(
  color: LenientString<BasicUIColor>,
  palette: IThemePalette,
): string {
  switch (color) {
    case 'primary':
    case 'info':
    case 'success':
    case 'warn':
    case 'error':
    case 'danger':
      return palette[`${color}Color`]
    default:
      return color
  }
}
