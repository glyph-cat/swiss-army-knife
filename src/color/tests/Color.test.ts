/* eslint-disable no-console */
import {
  Color,
  ColorFormat,
  SerializedHSL,
  SerializedRGB,
  WithAlphaAsOptional,
} from '..'

// #region Static methods

describe('Static methods', () => {

  // #region Setup/teardown
  let spiedMethods: Array<ReturnType<typeof jest.spyOn>> = null
  beforeEach(() => {
    spiedMethods = [
      jest.spyOn(Color, 'fromHSLObject'),
      jest.spyOn(Color, 'fromHSLValues'),
      jest.spyOn(Color, 'fromHSLString'),
      jest.spyOn(Color, 'fromRGBObject'),
      jest.spyOn(Color, 'fromRGBValues'),
      jest.spyOn(Color, 'fromRGBString'),
      jest.spyOn(Color, 'fromHex'),
    ]
  })
  afterEach(() => {
    for (const spiedMethod of spiedMethods) {
      spiedMethod.mockClear()
    }
    spiedMethods = null
  })
  // #endregion Setup/teardown

  // #region .fromHSL...

  describe(Color.fromHSL.name, () => {

    test('by object', () => {
      const inputParameter: WithAlphaAsOptional<SerializedHSL> = {
        hue: 0,
        saturation: 100,
        lightness: 50,
      }
      Color.fromHSL(inputParameter)
      expect(Color.fromHSLObject).toHaveBeenCalledWith(inputParameter)
    })

    test('by values', () => {
      const inputParameter: Parameters<typeof Color.fromHSLValues> = [0, 100, 50]
      Color.fromHSL(...inputParameter)
      expect(Color.fromHSLValues).toHaveBeenCalledWith(...inputParameter, undefined)
    })

    test('by string', () => {
      const inputParameter = 'hsl(0 100 50)'
      Color.fromHSL(inputParameter)
      expect(Color.fromHSLString).toHaveBeenCalledWith(inputParameter)
    })

  })

  test(Color.fromHSLObject.name, () => {
    const inputParameter: WithAlphaAsOptional<SerializedHSL> = {
      hue: 0,
      saturation: 100,
      lightness: 50,
    }
    Color.fromHSLObject(inputParameter)
    expect(Color.fromHSLValues).toHaveBeenCalledWith(...Object.values(inputParameter), undefined)
  })

  test(Color.fromHSLValues.name, () => {
    const color = Color.fromHSLValues(0, 100, 50)
    expect(color.red).toBe(255)
    expect(color.green).toBe(0)
    expect(color.blue).toBe(0)
    expect(color.alpha).toBe(1)
    expect(color.hue).toBe(0)
    expect(color.saturation).toBe(100)
    expect(color.lightness).toBe(50)
  })

  // #endregion .fromHSL...

  // #region fromRGB...

  describe(Color.fromRGB.name, () => {

    test('by object', () => {
      const inputParameter: WithAlphaAsOptional<SerializedRGB> = {
        red: 128,
        green: 64,
        blue: 16,
      }
      Color.fromRGB(inputParameter)
      expect(Color.fromRGBObject).toHaveBeenCalledWith(inputParameter)
    })

    test('by values', () => {
      const inputParameter: Parameters<typeof Color.fromRGBValues> = [128, 62, 16]
      Color.fromRGB(...inputParameter)
      expect(Color.fromRGBValues).toHaveBeenCalledWith(...inputParameter, undefined)
    })

    test('by string', () => {
      const inputParameter = 'rgb(128 64 16)'
      Color.fromRGB(inputParameter)
      expect(Color.fromRGBString).toHaveBeenCalledWith(inputParameter)
    })

  })

  test(Color.fromRGBObject.name, () => {
    const inputParameter: WithAlphaAsOptional<SerializedRGB> = {
      red: 128,
      green: 64,
      blue: 16,
    }
    Color.fromRGBObject(inputParameter)
    expect(Color.fromRGBValues).toHaveBeenCalledWith(...Object.values(inputParameter), undefined)
  })

  test(Color.fromRGBValues.name, () => {
    const color = Color.fromRGBValues(128, 64, 16)
    expect(color.red).toBe(128)
    expect(color.green).toBe(64)
    expect(color.blue).toBe(16)
    expect(color.alpha).toBe(1)
    expect(color.hue).toBe(26)
    expect(color.saturation).toBe(78)
    expect(color.lightness).toBe(28)
  })

  // #endregion fromRGB...

  // #region fromJSON

  describe(Color.fromJSON.name, () => {

    test('RGB object', () => {
      const inputParameter: WithAlphaAsOptional<SerializedRGB> = {
        red: 128,
        green: 64,
        blue: 16,
      }
      Color.fromJSON(inputParameter)
      expect(Color.fromRGBObject).toHaveBeenCalledWith(inputParameter)
    })

    test('HSL object', () => {
      const inputParameter: WithAlphaAsOptional<SerializedHSL> = {
        hue: 0,
        saturation: 100,
        lightness: 50,
      }
      Color.fromJSON(inputParameter)
      expect(Color.fromHSLObject).toHaveBeenCalledWith(inputParameter)
    })

    test('Invalid object', () => {
      // @ts-expect-error: Done on purpose to test the error.
      expect(() => { Color.fromJSON({}) }).toThrow('Invalid object: {}')
    })

  })

  // #endregion fromJSON

  // #region .fromString

  describe(Color.fromString.name, () => {

    // Not all formats are tested here because the parsing logic has been tested
    // in the utils section.

    test('HSL string', () => {
      const inputParameter = 'hsl(0 100 50)'
      Color.fromString(inputParameter)
      expect(Color.fromHSLString).toHaveBeenCalledWith(inputParameter)
    })

    test('RGB string', () => {
      const inputParameter = 'rgb(128 64 16)'
      Color.fromString(inputParameter)
      expect(Color.fromRGBString).toHaveBeenCalledWith(inputParameter)
    })

    test('Hex string', () => {
      const inputParameter = '#00ff00'
      Color.fromString(inputParameter)
      expect(Color.fromHex).toHaveBeenCalledWith(inputParameter)
    })

    test('Invalid string', () => {
      expect(() => { Color.fromString('') }).toThrow('Invalid color syntax \'\'')
    })

  })

  test(Color.fromHSLString.name, () => {
    const color = Color.fromHSLString('hsl(0 100 50)')
    expect(color.red).toBe(255)
    expect(color.green).toBe(0)
    expect(color.blue).toBe(0)
    expect(color.alpha).toBe(1)
    expect(color.hue).toBe(0)
    expect(color.saturation).toBe(100)
    expect(color.lightness).toBe(50)
  })

  test(Color.fromRGBString.name, () => {
    const color = Color.fromRGBString('rgb(128 64 16)')
    expect(color.red).toBe(128)
    expect(color.green).toBe(64)
    expect(color.blue).toBe(16)
    expect(color.alpha).toBe(1)
    expect(color.hue).toBe(26)
    expect(color.saturation).toBe(78)
    expect(color.lightness).toBe(28)
  })

  test(Color.fromHex.name, () => {
    const color = Color.fromHex('#00ff00')
    expect(color.red).toBe(0)
    expect(color.green).toBe(255)
    expect(color.blue).toBe(0)
    expect(color.alpha).toBe(1)
    expect(color.hue).toBe(120)
    expect(color.saturation).toBe(100)
    expect(color.lightness).toBe(50)
  })

  // #endregion .fromString

})

// #endregion Static methods

// #region Parameter validation

describe('Parameter validation', () => {

  // These are the only methods that actually perform validation:
  // - fromRGBString
  // - fromRGBValues
  // - fromHSLString
  // - fromHSLValues
  // - fromHex
  // The other methods are just a kind of wrapper that eventually calls the
  // base methods above.

  // #region -  .fromRGBString
  describe(Color.fromRGBString.name, () => {

    describe('Is valid', () => {

      describe('With alpha', () => {

        test('Decimal', () => {
          const color = Color.fromRGBString('rgb(128 64 16 0.5)')
          expect(color.isInvalid).toBe(false)
        })

        test('Percentage', () => {
          const color = Color.fromRGBString('rgb(128 64 16 50%)')
          expect(color.isInvalid).toBe(false)
        })

      })

      test('Without alpha', () => {
        const color = Color.fromRGBString('rgb(128 64 16)')
        expect(color.isInvalid).toBe(false)
      })

    })

    describe('Is invalid', () => {

      test('Red', () => {
        const color = Color.fromRGBString('rgb(300 64 16)')
        expect(color.isInvalid).toBe(true)
        expect(console.error).toHaveBeenCalled()
      })

      test('Green', () => {
        const color = Color.fromRGBString('rgb(128 300 16)')
        expect(color.isInvalid).toBe(true)
        expect(console.error).toHaveBeenCalled()
      })

      test('Blue', () => {
        const color = Color.fromRGBString('rgb(128 64 300)')
        expect(color.isInvalid).toBe(true)
        expect(console.error).toHaveBeenCalled()
      })

      describe('Alpha', () => {

        test('Decimal', () => {
          const color = Color.fromRGBString('rgb(128 64 16 1.1)')
          expect(color.isInvalid).toBe(true)
          expect(console.error).toHaveBeenCalled()
        })

        test('Percentage', () => {
          const color = Color.fromRGBString('rgb(128 64 16 110%)')
          expect(color.isInvalid).toBe(true)
          expect(console.error).toHaveBeenCalled()
        })

      })

    })

  })
  // #endregion -  .fromRGBString

  // #region -  .fromRGBValues
  describe(Color.fromRGBValues.name, () => {

    describe('Is valid', () => {

      test('With alpha', () => {
        const color = Color.fromRGBValues(128, 64, 16, 0.5)
        expect(color.isInvalid).toBe(false)
      })

      test('Without alpha', () => {
        const color = Color.fromRGBValues(128, 64, 16)
        expect(color.isInvalid).toBe(false)
      })

    })

    describe('Is invalid', () => {

      test('Red', () => {
        const color = Color.fromRGBValues(300, 64, 16)
        expect(color.isInvalid).toBe(true)
        expect(console.error).toHaveBeenCalled()
      })

      test('Green', () => {
        const color = Color.fromRGBValues(128, 300, 16)
        expect(color.isInvalid).toBe(true)
        expect(console.error).toHaveBeenCalled()
      })

      test('Blue', () => {
        const color = Color.fromRGBValues(128, 64, 300)
        expect(color.isInvalid).toBe(true)
        expect(console.error).toHaveBeenCalled()
      })

      test('Alpha', () => {
        const color = Color.fromRGBValues(128, 64, 16, 1.1)
        expect(color.isInvalid).toBe(true)
        expect(console.error).toHaveBeenCalled()
      })

    })

  })
  // #endregion -  .fromRGBValues

  // #region -  .fromHSLString
  describe(Color.fromHSLString.name, () => {

    describe('Is valid', () => {

      describe('With alpha', () => {

        test('Decimal', () => {
          const color = Color.fromHSLString('hsl(0 100 50 0.5)')
          expect(color.isInvalid).toBe(false)
        })

        test('Percentage', () => {
          const color = Color.fromHSLString('hsl(0 100 50 50%)')
          expect(color.isInvalid).toBe(false)
        })

      })

      test('Without alpha', () => {
        const color = Color.fromHSLString('hsl(0 100 50)')
        expect(color.isInvalid).toBe(false)
      })

    })

    describe('Is invalid', () => {

      test('Hue', () => {
        const color = Color.fromHSLString('hsl(460 100 50)')
        expect(color.isInvalid).toBe(true)
        expect(console.error).toHaveBeenCalled()
      })

      test('Saturation', () => {
        const color = Color.fromHSLString('hsl(0 200 50)')
        expect(color.isInvalid).toBe(true)
        expect(console.error).toHaveBeenCalled()
      })

      test('Lightness', () => {
        const color = Color.fromHSLString('hsl(0 100 200)')
        expect(color.isInvalid).toBe(true)
        expect(console.error).toHaveBeenCalled()
      })

      describe('Alpha', () => {

        test('Decimal', () => {
          const color = Color.fromHSLString('hsl(0 100 50 1.1)')
          expect(color.isInvalid).toBe(true)
          expect(console.error).toHaveBeenCalled()
        })

        test('Percentage', () => {
          const color = Color.fromHSLString('hsl(0 100 50 110%)')
          expect(color.isInvalid).toBe(true)
          expect(console.error).toHaveBeenCalled()
        })
      })

    })

  })
  // #endregion -  .fromHSLString

  // #region -  .fromHSLValues
  describe(Color.fromHSLValues.name, () => {

    describe('Is valid', () => {

      test('With alpha', () => {
        const color = Color.fromHSLValues(0, 100, 50, 0.5)
        expect(color.isInvalid).toBe(false)
      })

      test('Without alpha', () => {
        const color = Color.fromHSLValues(0, 100, 50)
        expect(color.isInvalid).toBe(false)
      })

    })

    describe('Is invalid', () => {

      test('Hue', () => {
        const color = Color.fromHSLValues(460, 100, 50)
        expect(color.isInvalid).toBe(true)
        expect(console.error).toHaveBeenCalled()
      })

      test('Saturation', () => {
        const color = Color.fromHSLValues(0, 200, 50)
        expect(color.isInvalid).toBe(true)
        expect(console.error).toHaveBeenCalled()
      })

      test('Lightness', () => {
        const color = Color.fromHSLValues(0, 100, 200)
        expect(color.isInvalid).toBe(true)
        expect(console.error).toHaveBeenCalled()
      })

      test('Alpha', () => {
        const color = Color.fromHSLValues(0, 100, 50, 1.1)
        expect(color.isInvalid).toBe(true)
        expect(console.error).toHaveBeenCalled()
      })

    })

  })
  // #endregion -  .fromHSLValues

  // #region -  .fromHex
  describe(Color.fromHex.name, () => {

    describe('Is valid', () => {

      test('FFF', () => {
        const color = Color.fromHex('#0f0')
        expect(color.isInvalid).toBe(false)
      })

      test('FFFF', () => {
        const color = Color.fromHex('#0f08')
        expect(color.isInvalid).toBe(false)
      })

      test('FFFFFF', () => {
        const color = Color.fromHex('#00ff00')
        expect(color.isInvalid).toBe(false)
      })

      test('FFFFFFFF', () => {
        const color = Color.fromHex('#00ff0088')
        expect(color.isInvalid).toBe(false)
      })

    })

    describe('Is invalid', () => {

      describe('Red', () => {

        test('FFF', () => {
          expect(() => { Color.fromHex('#x00') }).toThrow(/Invalid hex code/)
        })

        test('FFFF', () => {
          expect(() => { Color.fromHex('#x00f') }).toThrow(/Invalid hex code/)
        })

        test('FFFFFF', () => {
          expect(() => { Color.fromHex('#xx0000') }).toThrow(/Invalid hex code/)
        })

        test('FFFFFFFF', () => {
          expect(() => { Color.fromHex('#xx0000ff') }).toThrow(/Invalid hex code/)
        })

      })

      describe('Green', () => {

        test('FFF', () => {
          expect(() => { Color.fromHex('#0x0') }).toThrow(/Invalid hex code/)
        })

        test('FFFF', () => {
          expect(() => { Color.fromHex('#0x0f') }).toThrow(/Invalid hex code/)
        })

        test('FFFFFF', () => {
          expect(() => { Color.fromHex('#00xx00') }).toThrow(/Invalid hex code/)
        })

        test('FFFFFFFF', () => {
          expect(() => { Color.fromHex('#00xx00ff') }).toThrow(/Invalid hex code/)
        })

      })

      describe('Blue', () => {

        test('FFF', () => {
          expect(() => { Color.fromHex('#00x') }).toThrow(/Invalid hex code/)
        })

        test('FFFF', () => {
          expect(() => { Color.fromHex('#00xf') }).toThrow(/Invalid hex code/)
        })

        test('FFFFFF', () => {
          expect(() => { Color.fromHex('#0000xx') }).toThrow(/Invalid hex code/)
        })

        test('FFFFFFFF', () => {
          expect(() => { Color.fromHex('#0000xxff') }).toThrow(/Invalid hex code/)
        })

      })

      describe('Alpha', () => {

        // NOTE: 'FFF' and 'FFFFFF' are irrelevant

        test('FFFF', () => {
          expect(() => { Color.fromHex('#000x') }).toThrow(/Invalid hex code/)
        })

        test('FFFFFFFF', () => {
          expect(() => { Color.fromHex('#000000xx') }).toThrow(/Invalid hex code/)
        })

      })

    })

  })
  // #endregion -  .fromHex

})

// #endregion Parameter validation

// #region Getters

describe('Getters (internal values initialization test)', () => {

  // #region Setup/teardown
  let spiedMethods: Array<ReturnType<typeof jest.spyOn>> = null
  const customSpy = (c: Color): Color => {
    spiedMethods.push(
      jest.spyOn(c, 'M$initRGBValues'),
      jest.spyOn(c, 'M$initHSLValues'),
    )
    return c
  }
  beforeEach(() => {
    spiedMethods = []
  })
  afterEach(() => {
    for (const spiedMethod of spiedMethods) {
      spiedMethod.mockClear()
    }
    spiedMethods = null
  })
  // #endregion Setup/teardown

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const doSomethingWith = (...args: unknown[]) => null
  const propertiesToTestRGB: Readonly<Array<keyof typeof Color.prototype>> = [
    'red',
    'green',
    'blue',
  ]
  const propertiesToTestHSL: Readonly<Array<keyof typeof Color.prototype>> = [
    'hue',
    'saturation',
    'lightness',
  ]

  // #region From HSL

  describe('From HSL', () => {

    describe('These values should have been assigned from the start', () => {
      for (const propertyToTest of propertiesToTestHSL) {
        test(`.${propertyToTest}`, () => {
          const color = customSpy(Color.fromHSLValues(0, 100, 50))
          expect(color.M$initRGBValues).not.toHaveBeenCalled()
          expect(color.M$initHSLValues).not.toHaveBeenCalled()
          doSomethingWith(color[propertyToTest])
          expect(color.M$initRGBValues).not.toHaveBeenCalled()
          expect(color.M$initHSLValues).not.toHaveBeenCalled()
        })
      }
    })

    describe('These values should be lazily calculated', () => {
      for (const propertyToTest of propertiesToTestRGB) {
        test(`.${propertyToTest}`, () => {
          const color = customSpy(Color.fromHSLValues(0, 100, 50))
          expect(color.M$initRGBValues).not.toHaveBeenCalled()
          expect(color.M$initHSLValues).not.toHaveBeenCalled()
          doSomethingWith(color[propertyToTest])
          expect(color.M$initRGBValues).toHaveBeenCalledTimes(1)
          expect(color.M$initHSLValues).not.toHaveBeenCalled()
          doSomethingWith(color[propertyToTest])
          expect(color.M$initRGBValues).toHaveBeenCalledTimes(1)
          expect(color.M$initHSLValues).not.toHaveBeenCalled()
        })
      }
    })

  })

  // #endregion From HSL

  // #region From RGB

  describe('From RGB', () => {

    describe('These values should have been assigned from the start', () => {
      for (const propertyToTest of propertiesToTestRGB) {
        test(`.${propertyToTest}`, () => {
          const color = customSpy(Color.fromRGBValues(128, 64, 16))
          expect(color.M$initRGBValues).not.toHaveBeenCalled()
          expect(color.M$initHSLValues).not.toHaveBeenCalled()
          doSomethingWith(color[propertyToTest])
          expect(color.M$initRGBValues).not.toHaveBeenCalled()
          expect(color.M$initHSLValues).not.toHaveBeenCalled()
        })
      }
    })

    describe('These values should be lazily calculated', () => {
      for (const propertyToTest of propertiesToTestHSL) {
        test(`.${propertyToTest} (values should be lazily calculated)`, () => {
          const color = customSpy(Color.fromRGBValues(128, 64, 16))
          expect(color.M$initRGBValues).not.toHaveBeenCalled()
          expect(color.M$initHSLValues).not.toHaveBeenCalled()
          doSomethingWith(color[propertyToTest])
          expect(color.M$initRGBValues).not.toHaveBeenCalled()
          expect(color.M$initHSLValues).toHaveBeenCalledTimes(1)
          doSomethingWith(color[propertyToTest])
          expect(color.M$initRGBValues).not.toHaveBeenCalled()
          expect(color.M$initHSLValues).toHaveBeenCalledTimes(1)
        })
      }
    })

  })

  // #endregion From RGB

})

// #endregion Getters

// #region Prototype methods

describe('Prototype methods', () => {

  describe('Serialization', () => {

    // #region Setup/teardown
    let spiedMethods: Array<ReturnType<typeof jest.spyOn>> = null
    const customSpy = (c: Color): Color => {
      spiedMethods.push(
        jest.spyOn(c, 'toString'),
      )
      return c
    }
    beforeEach(() => {
      spiedMethods = []
    })
    afterEach(() => {
      for (const spiedMethod of spiedMethods) {
        spiedMethod.mockClear()
      }
      spiedMethods = null
    })
    // #endregion Setup/teardown

    test(Color.prototype.toJSON.name, () => {
      expect(Color.fromHex('#12345678').toJSON()).toStrictEqual({
        red: 18,
        green: 52,
        blue: 86,
        alpha: 0.47058823529411764,
        hue: 210,
        saturation: 65,
        lightness: 20,
        luminance: 47.24,
      })
    })

    describe(Color.prototype.toString.name, () => {

      test('No parameters provided', () => {
        const color = Color.fromRGBValues(128, 64, 16)
        expect(color.toString()).toBe('#804010')
      })

      describe('RGB', () => {

        test('Alpha === 1', () => {
          const color = Color.fromHex('#804010')
          expect(color.toString(ColorFormat.RGB)).toBe('rgb(128, 64, 16)')
        })

        describe('Alpha !== 1', () => {

          test('suppressAlphaInShortFormats: true', () => {
            const color = Color.fromHex('#80401080')
            expect(color.toString(ColorFormat.RGB, {
              suppressAlphaInShortFormats: true,
            })).toBe('rgb(128, 64, 16)')
          })

          test('suppressAlphaInShortFormats: false', () => {
            const color = Color.fromHex('#80401080')
            expect(color.toString(ColorFormat.RGB)).toBe('rgb(128, 64, 16, 0.502)')
          })

        })

      })

      describe('RGBA', () => {

        test('Alpha = 1', () => {
          const color = Color.fromHex('#804010')
          expect(color.toString(ColorFormat.RGBA)).toBe('rgba(128, 64, 16, 1)')
        })

        describe('truncateDecimals', () => {

          test('default', () => {
            const color = Color.fromHex('#80401088')
            expect(color.toString(ColorFormat.RGBA)).toBe('rgba(128, 64, 16, 0.533)')
          })

          test('0', () => {
            const color = Color.fromHex('#80401088')
            expect(color.toString(ColorFormat.RGBA, {
              truncateDecimals: 0,
            })).toBe('rgba(128, 64, 16, 1)')
          })

          test('1', () => {
            const color = Color.fromHex('#80401088')
            expect(color.toString(ColorFormat.RGBA, {
              truncateDecimals: 1,
            })).toBe('rgba(128, 64, 16, 0.5)')
          })

        })

      })

      describe('HSL', () => {

        test('Alpha === 1', () => {
          const color = Color.fromHex('#804010')
          expect(color.toString(ColorFormat.HSL)).toBe('hsl(26deg, 78%, 28%)')
        })

        describe('Alpha !== 1', () => {

          test('suppressAlphaInShortFormats: true', () => {
            const color = Color.fromHex('#80401080')
            expect(color.toString(ColorFormat.HSL, {
              suppressAlphaInShortFormats: true,
            })).toBe('hsl(26deg, 78%, 28%)')
          })

          test('suppressAlphaInShortFormats: false', () => {
            const color = Color.fromHex('#80401080')
            expect(color.toString(ColorFormat.HSL)).toBe('hsl(26deg, 78%, 28%, 0.502)')
          })

        })

      })

      describe('HSLA', () => {

        test('Alpha = 1', () => {
          const color = Color.fromHex('#804010')
          expect(color.toString(ColorFormat.HSLA)).toBe('hsla(26deg, 78%, 28%, 1)')
        })

        describe('truncateDecimals', () => {

          test('default', () => {
            const color = Color.fromHex('#80401088')
            expect(color.toString(ColorFormat.HSLA)).toBe('hsla(26deg, 78%, 28%, 0.533)')
          })

          test('0', () => {
            const color = Color.fromHex('#80401088')
            expect(color.toString(ColorFormat.HSLA, {
              truncateDecimals: 0,
            })).toBe('hsla(26deg, 78%, 28%, 1)')
          })

          test('1', () => {
            const color = Color.fromHex('#80401088')
            expect(color.toString(ColorFormat.HSLA, {
              truncateDecimals: 1,
            })).toBe('hsla(26deg, 78%, 28%, 0.5)')
          })

        })

      })

      describe('FFF', () => {

        test('Possible to use short hex form', () => {
          // ...
        })

        test('Not possible to use short hex form', () => {
          // ...
        })

      })

      describe('FFFF', () => {

        test('Possible to use short hex form', () => {
          // ...
        })

        test('Not possible to use short hex form', () => {
          // ...
        })

      })

      describe('FFFFFFFF', () => {

        test('suppressAlphaInShortFormats: true', () => {
          // ...
        })

        test('suppressAlphaInShortFormats: false', () => {
          // ...
        })

      })

      test('FFFFFFFF', () => {
        // ...
      })

      test('Invalid color', () => {
        const color = Color.fromRGBValues(256, 0, 0)
        expect(color.toString()).toBe('#InvalidColor')
      })

    })

    test(Color.prototype.valueOf.name, () => {
      const color = customSpy(Color.fromHex('#00ff00'))
      color.valueOf()
      expect(color.toString).toHaveBeenCalledWith()
    })

  })

})

// #endregion Prototype methods
