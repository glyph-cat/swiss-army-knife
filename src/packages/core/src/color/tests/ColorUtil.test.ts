import { ColorUtil } from '..'

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

test(ColorUtil.fromHSLToRGB.name, (): void => {
  // NOTE: Some precision is lost during conversion,
  // hence `41, 126, ...` instead of `43, 128, ...`
  expect(ColorUtil.fromHSLToRGB(216, 100, 58)).toStrictEqual([41, 126, 255])
})

describe(ColorUtil.fromRGBToHSL.name, (): void => {

  test('Happy path', () => {
    expect(ColorUtil.fromRGBToHSL(43, 128, 255)).toStrictEqual([216, 100, 58])
  })

  test('When maxRGB === minRGB, hue should not evaluate to NaN', () => {
    expect(ColorUtil.fromRGBToHSL(17, 17, 17)).toStrictEqual([0, 0, 7])
  })

})

// NOTE: `getLuminance` is not tested because it is a straightforward formula
