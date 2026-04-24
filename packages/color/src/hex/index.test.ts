import { HexColor } from '.'
import { InvalidColorStringError } from '../errors'

describe('Instantiation', () => {

  // Not much test cases are required because it has regex validation and
  // is based on `RGBColor`.

  describe('Happy paths', () => {

    test('3-digit', () => {
      const color = new HexColor('#abc')
      expect(color.valueOf()).toStrictEqual([170, 187, 204, 1])
      expect(color.toJSON()).toStrictEqual({ r: 170, g: 187, b: 204, a: 1 })
    })

    test('4-digit', () => {
      const color = new HexColor('#abcd')
      expect(color.valueOf()).toStrictEqual([
        170,
        187,
        204,
        0.8666666666666667, // 0.87
      ])
      expect(color.toJSON()).toStrictEqual({
        r: 170,
        g: 187,
        b: 204,
        a: 0.8666666666666667, // 0.87
      })
    })

    test('6-digit', () => {
      const color = new HexColor('#2b80ff')
      expect(color.valueOf()).toStrictEqual([43, 128, 255, 1])
      expect(color.toJSON()).toStrictEqual({ r: 43, g: 128, b: 255, a: 1 })
    })

    test('8-digit', () => {
      const color = new HexColor('#2b80ff80')
      expect(color.valueOf()).toStrictEqual([
        43,
        128,
        255,
        0.5019607843137255, // 0.5
      ])
      expect(color.toJSON()).toStrictEqual({
        r: 43,
        g: 128,
        b: 255,
        a: 0.5019607843137255, // 0.5
      })
    })

  })

  test('Invalid values', () => {
    expect(() => { new HexColor('#2n80ff') }).toThrow(InvalidColorStringError)
    expect(() => { new HexColor('') }).toThrow(InvalidColorStringError)
    expect(() => { new HexColor('xyz') }).toThrow(InvalidColorStringError)
  })

})

test(HexColor.prototype.transform.name, () => {
  const color = new HexColor('#2b80ff')
  const fn = jest.fn(() => ({ r: 1, g: 2, b: 3, a: 0.4 }))
  const newColor = color.transform(fn)
  expect(fn).toHaveBeenCalledWith({ r: 43, g: 128, b: 255, a: 1 })
  expect(color.valueOf()).toStrictEqual([43, 128, 255, 1]) // should not be changed
  expect(newColor.M$rgbReference.valueOf()).toStrictEqual([1, 2, 3, 0.4])
})

describe(HexColor.prototype.toString, () => {

  describe('No format specified', () => {

    test('Literal value has format "#rgb"', () => {
      const color = new HexColor('#abc')
      expect(color.toString()).toBe('#abc')
    })

    test('Literal value has format "#rgba"', () => {
      const color = new HexColor('#abcd')
      expect(color.toString()).toBe('#abcd')
    })

    test('Literal value has format "#rrggbb"', () => {
      const color = new HexColor('#2b80ff')
      expect(color.toString()).toBe('#2b80ff')
    })

    test('Literal value has format "#rrggbbaa"', () => {
      const color = new HexColor('#2b80ff80')
      expect(color.toString()).toBe('#2b80ff80')
    })

  })

  describe('With format specified', () => {

    describe('#rgb', () => {

      test('Digits fit', () => {
        const color = new HexColor('#aabbcc')
        expect(color.toString('#rgb')).toBe('#abc')
      })

      test('Digits do not fit', () => {
        const color = new HexColor('#aabbcd')
        expect(color.toString('#rgb')).toBe('#aabbcd')
      })

    })

    describe('#rgba', () => {

      test('Digits fit', () => {
        const color = new HexColor('#aabbccdd')
        expect(color.toString('#rgba')).toBe('#abcd')
      })

      test('Digits do not fit', () => {
        const color = new HexColor('#aabbcd77')
        expect(color.toString('#rgba')).toBe('#aabbcd77')
      })

    })

    test('#rrggbb', () => {
      const color = new HexColor('#abc')
      expect(color.toString('#rrggbb')).toBe('#aabbcc')
    })

    test('#rrggbbaa', () => {
      const color = new HexColor('#abcd')
      expect(color.toString('#rrggbbaa')).toBe('#aabbccdd')
    })

    test('Invalid format', () => {
      expect(() => {
        new HexColor('#abc').toString(
          // @ts-expect-error: Done on purpose to test the error.
          'xyz'
        )
      }).toThrow()
    })

  })

})
