import { ColorUtil } from '@glyph-cat/swiss-army-knife'
import { COLOR_BLACK, COLOR_WHITE } from '../../constants'

export const resolveContrastingValue = ColorUtil.createContrastingValue({
  light: COLOR_BLACK,
  dark: COLOR_WHITE,
})
