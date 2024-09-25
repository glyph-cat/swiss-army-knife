import {
  Color,
  ColorLookup,
  ColorUtil,
  SerializedHSL,
  SerializedRGB,
  WithAlphaAsOptional,
} from '.'

// #region Color

describe(Color.name, (): void => {

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

  describe('Parameter validation', () => {

    // These are the only methods that actually perform validation:
    // - fromRGBString
    // - fromRGBValues
    // - fromHSLString
    // - fromHSLValues
    // - fromHex
    // The other methods are just a kind of wrapper that eventually calls the
    // base methods above.

    // todo: concept is to test for the `.isInvalid` property and whether `console.error` is called

    describe(Color.fromRGBString.name, () => {

      describe('Is valid', () => {

        test('With alpha', () => {
          // ...
        })

        test('Without alpha', () => {
          // ...
        })

      })

      describe('Is invalid', () => {

        test('Red', () => {
          // ...
        })

        test('Green', () => {
          // ...
        })

        test('Blue', () => {
          // ...
        })

        test('Alpha', () => {
          // ...
        })

      })

    })

    describe(Color.fromRGBValues.name, () => {

      describe('Is valid', () => {

        test('With alpha', () => {
          // ...
        })

        test('Without alpha', () => {
          // ...
        })

      })

      describe('Is invalid', () => {

        test('Red', () => {
          // ...
        })

        test('Green', () => {
          // ...
        })

        test('Blue', () => {
          // ...
        })

        test('Alpha', () => {
          // ...
        })

      })

    })

    describe(Color.fromHSLString.name, () => {

      describe('Is valid', () => {

        test('With alpha', () => {
          // ...
        })

        test('Without alpha', () => {
          // ...
        })

      })

      describe('Is invalid', () => {

        test('Hue', () => {
          // ...
        })

        test('Saturation', () => {
          // ...
        })

        test('Lightness', () => {
          // ...
        })

        test('Alpha', () => {
          // ...
        })

      })

    })

    describe(Color.fromHSLValues.name, () => {

      describe('Is valid', () => {

        test('With alpha', () => {
          // ...
        })

        test('Without alpha', () => {
          // ...
        })

      })

      describe('Is invalid', () => {

        test('Hue', () => {
          // ...
        })

        test('Saturation', () => {
          // ...
        })

        test('Lightness', () => {
          // ...
        })

        test('Alpha', () => {
          // ...
        })

      })

    })

    describe(Color.fromHex.name, () => {

      // todo: test when each R, G, B, A value is valid and invalid

      describe('Is valid', () => {

        test('FFF', () => {
          // ...
        })

        test('FFFF', () => {
          // ...
        })

        test('FFFFFF', () => {
          // ...
        })

        test('FFFFFFFF', () => {
          // ...
        })
      })

      describe('Is invalid', () => {

        test('Red', () => {
          // ...
        })

        test('Green', () => {
          // ...
        })

        test('Blue', () => {
          // ...
        })

        test('Alpha', () => {
          // ...
        })

      })

    })

  })

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

      test(Color.prototype.toJSON.name, () => {
        expect(Color.fromHex('#ddeeff').toJSON()).toStrictEqual({
          // todo
        })
      })

      describe(Color.prototype.toString.name, () => {

        test('No parameters provided', () => {
          // ...
        })

        describe('RGB', () => {

          test('suppressAlphaInShortFormats: true', () => {
            // ...
          })

          test('suppressAlphaInShortFormats: false', () => {
            // ...
          })

        })

        describe('RGBA', () => {

          test('truncateDecimals: none', () => {
            // ...
          })

          test('truncateDecimals: 0', () => {
            // ...
          })

          test('truncateDecimals: 4', () => {
            // ...
          })

        })

        describe('HSL', () => {

          test('suppressAlphaInShortFormats: true', () => {
            // ...
          })

          test('suppressAlphaInShortFormats: false', () => {
            // ...
          })

        })

        describe('HSLA', () => {

          test('truncateDecimals: none', () => {
            // ...
          })

          test('truncateDecimals: 0', () => {
            // ...
          })

          test('truncateDecimals: 4', () => {
            // ...
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
          // ...
        })

      })

      test(Color.prototype.valueOf.name, () => {
        const color = Color.fromHex('#00ff00')
        color.valueOf()
        expect(color.toString).toHaveBeenCalledWith(undefined)
      })

    })

  })

  // #endregion Prototype methods

})

// #endregion Color

// #region ColorLookup

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

// #endregion ColorLookup

// #region ColorUtil

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

  describe.skip(ColorUtil.fromHSLToRGB.name, (): void => {
    // ...
  })

  describe.skip(ColorUtil.fromRGBToHSL.name, (): void => {
    // ...
  })

  // NOTE: `getLuminance` is not tested because it is a straightforward formula

})

// #endregion ColorUtil
