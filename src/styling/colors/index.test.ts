import {
  createContrastingValue,
  getRGBAFromHexString,
  getLuma,
  RGBAtuple,
} from '.'

test(getLuma.name, (): void => {
  expect(getLuma(255, 255, 255)).toBe(255)
  expect(getLuma(0, 0, 0)).toBe(0)
  expect(getLuma(0, 121, 107)).toBe(95)
  expect(getLuma(165, 42, 42)).toBe(68)
})

describe(getRGBAFromHexString.name, (): void => {

  const TEST_SETS: Array<[string, RGBAtuple]> = [
    ['#FFF', [255, 255, 255, 1]],
    ['#FFFF', [255, 255, 255, 1]],
    ['#FFF8', [255, 255, 255, 0.5333333333333333]],
    ['#000', [0, 0, 0, 1]],
    ['#000F', [0, 0, 0, 1]],
    ['#0000', [0, 0, 0, 0]],
    ['#00796b', [0, 121, 107, 1]],
    ['#a52a2a', [165, 42, 42, 1]],
  ]

  for (const testSet of TEST_SETS) {
    const [color, expectedParsedColors] = testSet
    test(`${color} -> [${expectedParsedColors.join(', ')}]`, (): void => {
      expect(getRGBAFromHexString(color)).toStrictEqual(expectedParsedColors)
    })
  }

})

describe(createContrastingValue.name, (): void => {

  test('String type', (): void => {
    const getColorFromBg = createContrastingValue({
      light: '#000000',
      dark: '#FFFFFF',
    })
    expect(getColorFromBg('#000000')).toBe('#FFFFFF')
    expect(getColorFromBg('#FFFFFF')).toBe('#000000')
    expect(getColorFromBg('#115522')).toBe('#FFFFFF')
    expect(getColorFromBg('#AACCFF')).toBe('#000000')
  })

  test('Other type', (): void => {
    const checkIfBgIsDark = createContrastingValue({
      light: false,
      dark: true,
    })
    expect(checkIfBgIsDark('#000000')).toBe(true)
    expect(checkIfBgIsDark('#FFFFFF')).toBe(false)
    expect(checkIfBgIsDark('#115522')).toBe(true)
    expect(checkIfBgIsDark('#AACCFF')).toBe(false)
  })

})
