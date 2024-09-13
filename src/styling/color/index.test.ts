import { Color, ColorLookup, ColorUtil } from '.'

describe('ColorUtil', (): void => {

  describe(ColorUtil.createContrastingValue.name, (): void => {

    test('String type', (): void => {
      const getColorFromBg = ColorUtil.createContrastingValue({
        light: '#000000',
        dark: '#FFFFFF',
      })
      expect(getColorFromBg('#000000')).toBe('#FFFFFF')
      expect(getColorFromBg('#FFFFFF')).toBe('#000000')
      expect(getColorFromBg('#115522')).toBe('#FFFFFF')
      expect(getColorFromBg('#AACCFF')).toBe('#000000')
    })

    test('Other type', (): void => {
      const checkIfBgIsDark = ColorUtil.createContrastingValue({
        light: false,
        dark: true,
      })
      expect(checkIfBgIsDark('#000000')).toBe(true)
      expect(checkIfBgIsDark('#FFFFFF')).toBe(false)
      expect(checkIfBgIsDark('#115522')).toBe(true)
      expect(checkIfBgIsDark('#AACCFF')).toBe(false)
    })

  })

})
