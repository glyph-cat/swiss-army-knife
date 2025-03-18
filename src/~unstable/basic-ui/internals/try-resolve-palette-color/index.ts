import { IThemePalette, LenientString } from '@glyph-cat/swiss-army-knife'
import { BasicUIColor } from '../../abstractions'

export function tryResolvePaletteColor(
  color: LenientString<BasicUIColor>,
  palette: IThemePalette,
): string {
  if (color) {
    // TODO: try regex matching and see if it performs faster
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
  } else {
    return palette.primaryColor
  }
}
