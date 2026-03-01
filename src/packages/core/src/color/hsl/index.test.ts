import { HSLColor } from '.'
import { InvalidColorRangeError, InvalidColorStringError } from '../errors'

describe('Instantiation', () => {

  describe('Happy paths', () => {

    test('Default alpha', () => {
      const color = new HSLColor(216, 100, 58)
      expect(color.valueOf()).toStrictEqual([216, 100, 58, 1])
      expect(color.toJSON()).toStrictEqual({ h: 216, s: 100, l: 58, a: 1 })
    })

    test('Custom alpha', () => {
      const color = new HSLColor(216, 100, 58, 0.65)
      expect(color.valueOf()).toStrictEqual([216, 100, 58, 0.65])
      expect(color.toJSON()).toStrictEqual({ h: 216, s: 100, l: 58, a: 0.65 })
    })

  })

  describe('Invalid h', () => {

    test('Undershoot', () => {
      expect(() => { new HSLColor(-1, 100, 58) }).toThrow(InvalidColorRangeError)
    })

    test('Overshoot', () => {
      expect(() => { new HSLColor(361, 100, 58) }).toThrow(InvalidColorRangeError)
    })

    test('NaN', () => {
      expect(() => { new HSLColor(NaN, 100, 58) }).toThrow(InvalidColorRangeError)
    })

  })

  describe('Invalid s', () => {

    test('Undershoot', () => {
      expect(() => { new HSLColor(216, -1, 58) }).toThrow(InvalidColorRangeError)
    })

    test('Overshoot', () => {
      expect(() => { new HSLColor(216, 101, 58) }).toThrow(InvalidColorRangeError)
    })

    test('NaN', () => {
      expect(() => { new HSLColor(216, NaN, 58) }).toThrow(InvalidColorRangeError)
    })

  })

  describe('Invalid l', () => {

    test('Undershoot', () => {
      expect(() => { new HSLColor(216, 100, -1) }).toThrow(InvalidColorRangeError)
    })

    test('Overshoot', () => {
      expect(() => { new HSLColor(216, 100, 101) }).toThrow(InvalidColorRangeError)
    })

    test('NaN', () => {
      expect(() => { new HSLColor(216, 100, NaN) }).toThrow(InvalidColorRangeError)
    })

  })

  describe('Invalid a', () => {

    test('Undershoot', () => {
      expect(() => { new HSLColor(216, 100, 58, -1) }).toThrow(InvalidColorRangeError)
    })

    test('Overshoot', () => {
      expect(() => { new HSLColor(216, 100, 58, 1.1) }).toThrow(InvalidColorRangeError)
    })

    test('NaN', () => {
      expect(() => { new HSLColor(216, 100, 58, NaN) }).toThrow(InvalidColorRangeError)
    })

  })

})

describe(HSLColor.fromString.name, () => {

  describe('Happy paths', () => {

    test('Default alpha', () => {
      const color = HSLColor.fromString('hsl(216, 100%, 58%)')
      expect(color.valueOf()).toStrictEqual([216, 100, 58, 1])
      expect(color.toJSON()).toStrictEqual({ h: 216, s: 100, l: 58, a: 1 })
    })

    test('Custom alpha', () => {
      const color = HSLColor.fromString('hsla(216, 100%, 58%, 0.65)')
      expect(color.valueOf()).toStrictEqual([216, 100, 58, 0.65])
      expect(color.toJSON()).toStrictEqual({ h: 216, s: 100, l: 58, a: 0.65 })
    })

    test('By deg', () => {
      const color = HSLColor.fromString('hsl(216deg, 100%, 58%)')
      expect(color.valueOf()).toStrictEqual([216, 100, 58, 1])
      expect(color.toJSON()).toStrictEqual({ h: 216, s: 100, l: 58, a: 1 })
    })

    test('By rad', () => {
      const color = HSLColor.fromString('hsl(3.77rad, 100%, 58%)')
      expect(color.valueOf()).toStrictEqual([216.00508876432036, 100, 58, 1])
      expect(color.toJSON()).toStrictEqual({ h: 216.00508876432036, s: 100, l: 58, a: 1 })
    })

    test('By none', () => {
      const color = HSLColor.fromString('hsl(none, 100%, 58%)')
      expect(color.valueOf()).toStrictEqual([0, 100, 58, 1])
      expect(color.toJSON()).toStrictEqual({ h: 0, s: 100, l: 58, a: 1 })
    })

  })

  describe('Invalid h', () => {

    test('Undershoot', () => {
      expect(() => { HSLColor.fromString('hsl(361, 100%, 58%)') }).toThrow(InvalidColorStringError)
    })

    test('Overshoot', () => {
      expect(() => { HSLColor.fromString('hsl(-1, 100%, 58%)') }).toThrow(InvalidColorStringError)
    })

    test('NaN', () => {
      expect(() => { HSLColor.fromString('hsl(x, 100%, 58%)') }).toThrow(InvalidColorStringError)
    })

  })

  describe('Invalid s', () => {

    test('Undershoot', () => {
      expect(() => { HSLColor.fromString('hsl(216, 101%, 58%)') }).toThrow(InvalidColorStringError)
    })

    test('Overshoot', () => {
      expect(() => { HSLColor.fromString('hsl(216, -1%, 58%)') }).toThrow(InvalidColorStringError)
    })

    test('NaN', () => {
      expect(() => { HSLColor.fromString('hsl(216, x%, 58%)') }).toThrow(InvalidColorStringError)
    })

  })

  describe('Invalid l', () => {

    test('Undershoot', () => {
      expect(() => { HSLColor.fromString('hsl(216, 100%, 101%)') }).toThrow(InvalidColorStringError)
    })

    test('Overshoot', () => {
      expect(() => { HSLColor.fromString('hsl(216, 100%, -1%)') }).toThrow(InvalidColorStringError)
    })

    test('NaN', () => {
      expect(() => { HSLColor.fromString('hsl(216, 100%, %)') }).toThrow(InvalidColorStringError)
    })

  })

  describe('Invalid a', () => {

    test('Undershoot', () => {
      expect(() => { HSLColor.fromString('hsl(216, 100%, 58%, -1)') }).toThrow(InvalidColorStringError)
    })

    test('Overshoot', () => {
      expect(() => { HSLColor.fromString('hsl(216, 100%, 58%, 1.1)') }).toThrow(InvalidColorStringError)
    })

    test('NaN', () => {
      expect(() => { HSLColor.fromString('hsl(216, 100%, 58%, x)') }).toThrow(InvalidColorStringError)
    })

  })

})

test(HSLColor.fromJSON.name, () => {
  // Only simple test case required as the parameters are only being forwarded
  const color = HSLColor.fromJSON({
    h: 216,
    s: 100,
    l: 58,
    a: 0.65,
  })
  expect(color.h).toBe(216)
  expect(color.s).toBe(100)
  expect(color.l).toBe(58)
  expect(color.a).toBe(0.65)
})

describe(HSLColor.prototype.toString.name, () => {

  describe('Does not contain alpha', () => {

    test('includeAlpha: true', () => {
      const color = new HSLColor(216, 100, 58)
      expect(color.toString({ includeAlpha: true })).toBe('hsla(216, 100%, 58%, 1)')
    })

    test('includeAlpha: false', () => {
      const color = new HSLColor(216, 100, 58)
      expect(color.toString({ includeAlpha: false })).toBe('hsl(216, 100%, 58%)')
    })

    test('includeAlpha: undefined', () => {
      const color = new HSLColor(216, 100, 58)
      expect(color.toString()).toBe('hsl(216, 100%, 58%)')
    })

  })

  describe('Contains alpha', () => {

    test('includeAlpha: true', () => {
      const color = new HSLColor(216, 100, 58, 0.65)
      expect(color.toString({ includeAlpha: true })).toBe('hsla(216, 100%, 58%, 0.65)')
    })

    test('includeAlpha: false', () => {
      const color = new HSLColor(216, 100, 58, 0.65)
      expect(color.toString({ includeAlpha: false })).toBe('hsl(216, 100%, 58%)')
    })

    test('includeAlpha: undefined', () => {
      const color = new HSLColor(216, 100, 58, 0.65)
      expect(color.toString()).toBe('hsla(216, 100%, 58%, 0.65)')
    })

  })

})
