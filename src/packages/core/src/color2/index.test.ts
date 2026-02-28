import { Color } from '.'
import { InvalidColorStringError, InvalidColorValueError } from './errors'
import { HexColor } from './hex'
import { HSLColor } from './hsl'
import {
  hexConstructorSpyRef,
  hslConstructorSpyRef,
  rgbConstructorSpyRef,
} from './internals'
import { RGBColor } from './rgb'

beforeEach(() => {
  rgbConstructorSpyRef.current = jest.fn()
  hexConstructorSpyRef.current = jest.fn()
  hslConstructorSpyRef.current = jest.fn()
})

afterEach(() => {
  rgbConstructorSpyRef.current = null
  hexConstructorSpyRef.current = null
  hslConstructorSpyRef.current = null
})

describe(Color.name, () => {

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
        expect(rgbConstructorSpyRef.current).toHaveBeenCalledWith(43, 128, 255, undefined)
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
        expect(hslConstructorSpyRef.current).toHaveBeenCalledWith(216, 100, 58, undefined)
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
        expect(color.toRGB().valueOf()).toStrictEqual([43, 128, 255, 1])
      })

      test('String', () => {
        const color = new Color('hsl(216, 100%, 58%)')
        expect(color.toRGB().valueOf()).toStrictEqual([43, 128, 255, 1])
      })

    })

    // Source is RGBColor -> expect same object reference
    // Source is RGB string -> expect instance of RBGColor + check JSON values
    // Source is HexColor -> expect instance of HexColor + check JSON values + M$rgbReference instanceof
    // Source is Hex string -> expect instance of HexColor + check JSON values
    // Source is HSLColor -> expect instance of HSLColor + check JSON values
    // Source is HSL string -> expect instance of HSLColor + check JSON values

  })

  describe.skip(Color.prototype.toHSL.name, () => { })

  describe.skip(Color.prototype.toHex.name, () => { })

  // describe(Color.prototype.toString.name, () => { })

})
