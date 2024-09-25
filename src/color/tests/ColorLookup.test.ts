import { Color, ColorLookup } from '..'

describe(ColorLookup.fromCSSName, (): void => {

  test('Color exists', () => {
    expect(ColorLookup.fromCSSName('cornflowerblue').toString()).toBe('#6495ed')
  })

  test('Color does not exist', () => {
    // 'deer' color? I wonder what it might be referencing to...
    expect(ColorLookup.fromCSSName('deer')).toBe(null)
  })

})

describe(ColorLookup.toCSSName, (): void => {

  describe('String type', () => {

    test('Color exists', () => {
      expect(ColorLookup.toCSSName('#a0522d')).toBe('sienna')
    })

    test('Color does not exists', () => {
      expect(ColorLookup.toCSSName('#137a7f')).toBe(null)
    })

  })

  describe('Color type', () => {

    test('Color exists', () => {
      expect(ColorLookup.toCSSName(Color.fromRGB(220, 20, 60))).toBe('crimson')
    })

    test('Color does not exists', () => {
      expect(ColorLookup.toCSSName(Color.fromRGB(1, 2, 3))).toBe(null)
    })

  })

})
