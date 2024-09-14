import { Color, ColorLookup, ColorUtil } from '.'

describe(Color.name, (): void => {

  // todo: also test `isInvalid` + test when setting valid colors again does it change back to false
  // also test with multiple invalid fields and make sure they don't cross pollute

  describe('Static methods', () => {

    describe.skip(Color.fromHSL.name, () => {
      // ...
    })

    describe.skip(Color.fromHSLObject.name, () => {
      // ...
    })

    describe.skip(Color.fromHSLValues.name, () => {
      // ...
    })

    describe.skip(Color.fromJSON.name, () => {
      // ...
    })

    describe.skip(Color.fromRGB.name, () => {
      // ...
    })

    describe.skip(Color.fromRGBObject.name, () => {
      // ...
    })

    describe.skip(Color.fromRGBValues.name, () => {
      // ...
    })

    describe.skip(Color.fromString.name, () => {
      // This covers `Color.fromHSLString`, `Color.fromHex`, `Color.fromRGBString`
    })

  })

  describe.skip('Getters', () => {

    // ...

  })

  describe('Prototype methods', () => {

    describe.skip(Color.prototype.toJSON.name, () => {
      // ...
    })

    describe.skip(Color.prototype.toString.name, () => {
      // ...
    })

    describe.skip(Color.prototype.valueOf.name, () => {
      // ...
    })

    describe.skip(Color.prototype.setRed.name, () => {
      // ...
    })

    describe.skip(Color.prototype.setGreen.name, () => {
      // ...
    })

    describe.skip(Color.prototype.setBlue.name, () => {
      // ...
    })

    describe.skip(Color.prototype.setAlpha.name, () => {
      // ...
    })

    describe.skip(Color.prototype.setHue.name, () => {
      // ...
    })

    describe.skip(Color.prototype.setSaturation.name, () => {
      // ...
    })

    describe.skip(Color.prototype.setLightness.name, () => {
      // ...
    })

    describe.skip(Color.prototype.set.name, () => {
      // ...
    })

  })

})

describe('ColorLookup', (): void => {

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

})

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

  describe.skip(ColorUtil.fromHSLToRGB, (): void => {
    // ...
  })

  describe.skip(ColorUtil.fromRGBToHSL, (): void => {
    // ...
  })

  describe.skip(ColorUtil.getLuminance, (): void => {
    // ...
  })

})
