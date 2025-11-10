import { IThemePalette, LenientString, StringColorValue } from '@glyph-cat/swiss-army-knife'
import { BasicUIColor } from '../../abstractions'

export function tryResolvePaletteColor(
  color: LenientString<BasicUIColor>,
  palette: IThemePalette,
  fallbackValue: StringColorValue,
): string {
  if (color) {
    // TODO: [low priority] try regex matching and see if it performs faster
    switch (color) {
      case 'primary':
      case 'info':
      case 'success':
      case 'warn':
      case 'error':
      case 'danger':
        // return ThemeToken.neutralColor
        return palette[`${color}Color`]
      default:
        return color
    }
  } else {
    return fallbackValue
  }
}
