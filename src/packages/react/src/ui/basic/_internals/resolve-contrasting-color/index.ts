import { prepareContrastingValue } from '@glyph-cat/color'
import { COLOR_BLACK, COLOR_WHITE } from '../../constants'

export const resolveContrastingValue = prepareContrastingValue({
  light: COLOR_BLACK,
  dark: COLOR_WHITE,
})
