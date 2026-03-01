import { Empty } from '@glyph-cat/foundation'
import { Color } from '.'
import {
  hexConstructorSpyRef,
  hexToStringSpyRef,
  hslConstructorSpyRef,
  hslToStringSpyRef,
  rgbConstructorSpyRef,
  rgbToStringSpyRef,
} from '../_internals'
import { InvalidColorStringError, InvalidColorValueError } from '../errors'
import { HexColor } from '../hex'
import { HSLColor, HSLToStringOptions } from '../hsl'
import { RGBColor, RGBToStringOptions } from '../rgb'

beforeEach(() => {
  rgbConstructorSpyRef.current = jest.fn()
  hexConstructorSpyRef.current = jest.fn()
  hslConstructorSpyRef.current = jest.fn()
  rgbToStringSpyRef.current = jest.fn()
  hexToStringSpyRef.current = jest.fn()
  hslToStringSpyRef.current = jest.fn()
})

afterEach(() => {
  hslToStringSpyRef.current = null
  hexToStringSpyRef.current = null
  rgbToStringSpyRef.current = null
  hslConstructorSpyRef.current = null
  hexConstructorSpyRef.current = null
  rgbConstructorSpyRef.current = null
})

describe('Instantiation', () => {

  describe('RGB', () => {

    test('Color object', () => {
      const value = new RGBColor(43, 128, 255)
      const color = new Color(value)
      expect(Object.is(color.source, value)).toBe(true)
    })

    test('String', () => {
      const value = 'rgb(43, 128, 255)'
      const color = new Color(value)
      expect(color.source instanceof RGBColor).toBe(true)
      expect(rgbConstructorSpyRef.current).toHaveBeenCalledWith(43, 128, 255, undefined, value)
    })

  })

  describe('Hex', () => {

    test('Color object', () => {
      const value = new HexColor('#2b80ff')
      const color = new Color(value)
      expect(Object.is(color.source, value)).toBe(true)
    })

    test('String', () => {
      const value = '#2b80ff'
      const color = new Color(value)
      expect(color.source instanceof HexColor).toBe(true)
      expect(hexConstructorSpyRef.current).toHaveBeenCalledWith('#2b80ff')
    })

  })

  describe('HSL', () => {

    test('Color object', () => {
      const value = new HSLColor(216, 100, 58)
      const color = new Color(value)
      expect(Object.is(color.source, value)).toBe(true)
    })

    test('String', () => {
      const value = 'hsl(216, 100%, 58%)'
      const color = new Color(value)
      expect(color.source instanceof HSLColor).toBe(true)
      expect(hslConstructorSpyRef.current).toHaveBeenCalledWith(216, 100, 58, undefined, value)
    })

  })

  test('Invalid values', () => {
    expect(() => { new Color('meow') }).toThrow(InvalidColorStringError)
    expect(() => { new Color('') }).toThrow(InvalidColorStringError)
    // @ts-expect-error: Done on purpose to test the error.
    expect(() => { new Color(new Date()) }).toThrow(InvalidColorValueError)
    // @ts-expect-error: Done on purpose to test the error.
    expect(() => { new Color(null) }).toThrow(InvalidColorValueError)
  })

})

describe(Color.prototype.toRGB.name, () => {

  describe('Source is RGB', () => {

    test('Color object', () => {
      const source = new RGBColor(43, 128, 255)
      const color = new Color(source)
      expect(Object.is(color.toRGB(), color.source)).toBe(true)
    })

    test('String', () => {
      const color = new Color('rgb(43, 128, 255)')
      expect(color.toRGB().valueOf()).toStrictEqual([43, 128, 255, 1])
    })

  })

  describe('Source is Hex', () => {

    test('Color object', () => {
      const source = new HexColor('#2b80ff')
      const color = new Color(source)
      expect(Object.is(color.toRGB(), source.M$rgbReference)).toBe(true)
      expect(Object.is(source.M$rgbReference, (color.source as HexColor).M$rgbReference)).toBe(true)
    })

    test('String', () => {
      const color = new Color('#2b80ff')
      expect(color.toRGB().valueOf()).toStrictEqual([43, 128, 255, 1])
    })

  })

  describe('Source is HSL', () => {

    test('Color object', () => {
      const source = new HSLColor(216, 100, 58)
      const color = new Color(source)
      expect(color.toRGB().valueOf()).toStrictEqual([41, 126, 255, 1])
      // Slightly altered during conversion, was [43, 128, 255, 1]
    })

    test('String', () => {
      const color = new Color('hsl(216, 100%, 58%)')
      expect(color.toRGB().valueOf()).toStrictEqual([41, 126, 255, 1])
      // Slightly altered during conversion, was [43, 128, 255, 1]
    })

  })

})

describe(Color.prototype.toHex.name, () => {

  describe('Source is RGB', () => {

    test('Color object', () => {
      const source = new RGBColor(43, 128, 255)
      const color = new Color(source)
      expect(color.toHex().valueOf()).toStrictEqual([43, 128, 255, 1])
    })

    test('String', () => {
      const color = new Color('rgb(43, 128, 255)')
      expect(color.toHex().valueOf()).toStrictEqual([43, 128, 255, 1])
    })

  })

  describe('Source is Hex', () => {

    test('Color object', () => {
      const source = new HexColor('#2b80ff')
      const color = new Color(source)
      expect(Object.is(color.toHex(), color.source)).toBe(true)
    })

    test('String', () => {
      const source = '#2b80ff'
      const color = new Color(source)
      expect(color.toHex().literalValue).toBe(source)
    })

  })

  describe('Source is HSL', () => {

    test('Color object', () => {
      const source = new HSLColor(216, 100, 58)
      const color = new Color(source)
      expect(color.toHex().valueOf()).toStrictEqual([41, 126, 255, 1])
      // Slightly altered during conversion, was [43, 128, 255, 1]
    })

    test('String', () => {
      const color = new Color('hsl(216, 100%, 58%)')
      expect(color.toHex().valueOf()).toStrictEqual([41, 126, 255, 1])
      // Slightly altered during conversion, was [43, 128, 255, 1]
    })

  })

})

describe(Color.prototype.toHSL.name, () => {

  describe('Source is RGB', () => {

    test('Color object', () => {
      const source = new RGBColor(43, 128, 255)
      const color = new Color(source)
      expect(color.toHSL().valueOf()).toStrictEqual([216, 100, 58, 1])
    })

    test('String', () => {
      const color = new Color('rgb(43, 128, 255)')
      expect(color.toHSL().valueOf()).toStrictEqual([216, 100, 58, 1])
    })

  })

  describe('Source is Hex', () => {

    test('Color object', () => {
      const source = new HexColor('#2b80ff')
      const color = new Color(source)
      expect(color.toHSL().valueOf()).toStrictEqual([216, 100, 58, 1])
    })

    test('String', () => {
      const color = new Color('#2b80ff')
      expect(color.toHSL().valueOf()).toStrictEqual([216, 100, 58, 1])
    })

  })

  describe('Source is HSL', () => {

    test('Color object', () => {
      const source = new HSLColor(216, 100, 58)
      const color = new Color(source)
      expect(Object.is(color.toHSL(), source)).toBe(true)

    })

    test('String', () => {
      const color = new Color('hsl(216, 100%, 58%)')
      expect(color.toHSL().valueOf()).toStrictEqual([216, 100, 58, 1])
    })

  })

})

describe(Color.prototype.toString.name, () => {

  describe('Without format specified', () => {

    test('Has original (string) value', () => {
      const color = new Color('#2b80ff')
      color.toString()
      expect(hexToStringSpyRef.current).not.toHaveBeenCalled()
    })

    test('No original (string) value', () => {
      const color = new Color(new HexColor('#2b80ff'))
      color.toString()
      expect(hexToStringSpyRef.current).toHaveBeenCalledWith() // no arguments
    })

  })

  describe('With format specified', () => {

    test('Using `RGBColor`', () => {
      const color = new Color(new HexColor('#2b80ff'))
      const options: RGBToStringOptions = {}
      color.toString(RGBColor, options)
      expect(rgbToStringSpyRef.current).toHaveBeenCalledWith(options)
    })

    test('Using `Color.rgb`', () => {
      const color = new Color(new HexColor('#2b80ff'))
      const options: RGBToStringOptions = {}
      color.toString(Color.rgb, options)
      expect(rgbToStringSpyRef.current).toHaveBeenCalledWith(options)
    })

    test('Using `HexColor`', () => {
      const color = new Color(new HexColor('#2b80ff'))
      color.toString(HexColor, '#rrggbb')
      expect(hexToStringSpyRef.current).toHaveBeenCalledWith('#rrggbb')
    })

    test('Using `Color.hex`', () => {
      const color = new Color(new HexColor('#2b80ff'))
      color.toString(Color.hex, '#rrggbb')
      expect(hexToStringSpyRef.current).toHaveBeenCalledWith('#rrggbb')
    })

    test('Using `HSLColor`', () => {
      const color = new Color(new HexColor('#2b80ff'))
      const options: HSLToStringOptions = {}
      color.toString(HSLColor, options)
      expect(hslToStringSpyRef.current).toHaveBeenCalledWith(options)
    })

    test('Using `Color.hsl`', () => {
      const color = new Color(new HexColor('#2b80ff'))
      const options: HSLToStringOptions = {}
      color.toString(Color.hsl, options)
      expect(hslToStringSpyRef.current).toHaveBeenCalledWith(options)
    })

    test('Invalid format', () => {
      const color = new Color(new HexColor('#2b80ff'))
      expect(() => {
        color.toString(Empty.FUNCTION as unknown as typeof Color.hsl)
      }).toThrow()
    })

  })

})
