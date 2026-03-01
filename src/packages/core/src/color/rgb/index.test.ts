import { RGBColor } from '.'
import { InvalidColorRangeError, InvalidColorStringError } from '../errors'

describe('Instantiation', () => {

  describe('Happy paths', () => {

    test('Default alpha', () => {
      const color = new RGBColor(43, 128, 255)
      expect(color.valueOf()).toStrictEqual([43, 128, 255, 1])
      expect(color.toJSON()).toStrictEqual({ r: 43, g: 128, b: 255, a: 1 })
    })

    test('Custom alpha', () => {
      const color = new RGBColor(43, 128, 255, 0.65)
      expect(color.valueOf()).toStrictEqual([43, 128, 255, 0.65])
      expect(color.toJSON()).toStrictEqual({ r: 43, g: 128, b: 255, a: 0.65 })
    })

  })

  describe('Invalid r', () => {

    test('Undershoot', () => {
      expect(() => { new RGBColor(-1, 128, 255) }).toThrow(InvalidColorRangeError)
    })

    test('Overshoot', () => {
      expect(() => { new RGBColor(256, 128, 255) }).toThrow(InvalidColorRangeError)
    })

    test('NaN', () => {
      expect(() => { new RGBColor(NaN, 128, 255) }).toThrow(InvalidColorRangeError)
    })

  })

  describe('Invalid g', () => {

    test('Undershoot', () => {
      expect(() => { new RGBColor(43, -1, 255) }).toThrow(InvalidColorRangeError)
    })

    test('Overshoot', () => {
      expect(() => { new RGBColor(43, 256, 255) }).toThrow(InvalidColorRangeError)
    })

    test('NaN', () => {
      expect(() => { new RGBColor(43, NaN, 255) }).toThrow(InvalidColorRangeError)
    })

  })

  describe('Invalid b', () => {

    test('Undershoot', () => {
      expect(() => { new RGBColor(43, 128, -1) }).toThrow(InvalidColorRangeError)
    })

    test('Overshoot', () => {
      expect(() => { new RGBColor(43, 128, 256) }).toThrow(InvalidColorRangeError)
    })

    test('NaN', () => {
      expect(() => { new RGBColor(43, 128, NaN) }).toThrow(InvalidColorRangeError)
    })

  })

  describe('Invalid a', () => {

    test('Undershoot', () => {
      expect(() => { new RGBColor(43, 128, 255, NaN) }).toThrow(InvalidColorRangeError)
    })

    test('Overshoot', () => {
      expect(() => { new RGBColor(43, 128, 255, -1) }).toThrow(InvalidColorRangeError)
    })

    test('NaN', () => {
      expect(() => { new RGBColor(43, 128, 255, 1.1) }).toThrow(InvalidColorRangeError)
    })

  })

})

describe(RGBColor.fromString.name, () => {

  describe('Happy paths', () => {

    test('Default alpha', () => {
      const color = RGBColor.fromString('rgb(43, 128, 255)')
      expect(color.valueOf()).toStrictEqual([43, 128, 255, 1])
      expect(color.toJSON()).toStrictEqual({ r: 43, g: 128, b: 255, a: 1 })
    })

    test('Custom alpha', () => {
      const color = RGBColor.fromString('rgba(43, 128, 255, 0.65)')
      expect(color.valueOf()).toStrictEqual([43, 128, 255, 0.65])
      expect(color.toJSON()).toStrictEqual({ r: 43, g: 128, b: 255, a: 0.65 })
    })

  })

  describe('Invalid r', () => {

    test('Undershoot', () => {
      expect(() => { RGBColor.fromString('rgb(-1, 128, 255)') }).toThrow(InvalidColorStringError)
    })

    test('Overshoot', () => {
      expect(() => { RGBColor.fromString('rgb(256, 128, 255)') }).toThrow(InvalidColorStringError)
    })

    test('NaN', () => {
      expect(() => { RGBColor.fromString('rgb(x, 128, 255)') }).toThrow(InvalidColorStringError)
    })

  })

  describe('Invalid g', () => {

    test('Undershoot', () => {
      expect(() => { RGBColor.fromString('rgb(43, -1, 255)') }).toThrow(InvalidColorStringError)
    })

    test('Overshoot', () => {
      expect(() => { RGBColor.fromString('rgb(43, 256, 255)') }).toThrow(InvalidColorStringError)
    })

    test('NaN', () => {
      expect(() => { RGBColor.fromString('rgb(43, x, 255)') }).toThrow(InvalidColorStringError)
    })

  })

  describe('Invalid b', () => {

    test('Undershoot', () => {
      expect(() => { RGBColor.fromString('rgb(43, 128, -1)') }).toThrow(InvalidColorStringError)
    })

    test('Overshoot', () => {
      expect(() => { RGBColor.fromString('rgb(43, 128, 256)') }).toThrow(InvalidColorStringError)
    })

    test('NaN', () => {
      expect(() => { RGBColor.fromString('rgb(43, 128, x)') }).toThrow(InvalidColorStringError)
    })

  })

  describe('Invalid a', () => {

    test('Undershoot', () => {
      expect(() => { RGBColor.fromString('rgb(43, 128, 255, x)') }).toThrow(InvalidColorStringError)
    })

    test('Overshoot', () => {
      expect(() => { RGBColor.fromString('rgb(43, 128, 255, -1)') }).toThrow(InvalidColorStringError)
    })

    test('NaN', () => {
      expect(() => { RGBColor.fromString('rgb(43, 128, 255, 1.1)') }).toThrow(InvalidColorStringError)
    })

  })

})

test(RGBColor.fromJSON.name, () => {
  // Only simple test case required as the parameters are only being forwarded
  const color = RGBColor.fromJSON({ r: 43, g: 128, b: 255, a: 0.65 })
  expect(color.r).toBe(43)
  expect(color.g).toBe(128)
  expect(color.b).toBe(255)
  expect(color.a).toBe(0.65)
})

describe(RGBColor.prototype.toString.name, () => {

  describe('Does not contain alpha', () => {

    test('includeAlpha: true', () => {
      const color = new RGBColor(43, 128, 255)
      expect(color.toString({ includeAlpha: true })).toBe('rgba(43, 128, 255, 1)')
    })

    test('includeAlpha: false', () => {
      const color = new RGBColor(43, 128, 255)
      expect(color.toString({ includeAlpha: false })).toBe('rgb(43, 128, 255)')
    })

    test('includeAlpha: undefined', () => {
      const color = new RGBColor(43, 128, 255)
      expect(color.toString()).toBe('rgb(43, 128, 255)')
    })

  })

  describe('Contains alpha', () => {

    test('includeAlpha: true', () => {
      const color = new RGBColor(43, 128, 255, 0.65)
      expect(color.toString({ includeAlpha: true })).toBe('rgba(43, 128, 255, 0.65)')
    })

    test('includeAlpha: false', () => {
      const color = new RGBColor(43, 128, 255, 0.65)
      expect(color.toString({ includeAlpha: false })).toBe('rgb(43, 128, 255)')
    })

    test('includeAlpha: undefined', () => {
      const color = new RGBColor(43, 128, 255, 0.65)
      expect(color.toString()).toBe('rgba(43, 128, 255, 0.65)')
    })

  })

})
