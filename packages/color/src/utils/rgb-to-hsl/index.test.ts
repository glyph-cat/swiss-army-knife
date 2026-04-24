import { rgbToHsl } from '.'

describe(rgbToHsl.name, (): void => {

  test('Happy path', () => {
    expect(rgbToHsl(43, 128, 255)).toStrictEqual([216, 100, 58])
  })

  test('When maxRGB === minRGB, hue should not evaluate to NaN', () => {
    expect(rgbToHsl(17, 17, 17)).toStrictEqual([0, 0, 7])
  })

})
