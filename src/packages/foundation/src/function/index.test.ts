import { CleanupFunction, Factory, Fn } from '.'

// There will be build errors if any of these types do not behave as intended.

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

describe('Fn', () => {

  describe('No args, no return type', () => {

    test('Valid case', () => {
      const doSomething: Fn = () => { }
      doSomething()
      // @ts-expect-error: Expected 0 arguments, but got 1. ts(2554)
      doSomething(42)
      expect('').pass('')
    })

    test('Invalid case', () => {
      // @ts-expect-error: Target signature provides too few arguments.
      // Expected 1 or more, but got 0. ts(2322)
      const doSomething: Fn = (value) => { }
      expect('').pass('')
    })

  })

  describe('One arg, no return type', () => {

    test('Valid case', () => {
      const doSomething: Fn<number> = (value) => { value.toFixed(2) }
      doSomething(42)
      // @ts-expect-error: Expected 1 arguments, but got 0. ts(2554)
      doSomething()
      expect('').pass('')
    })

    test('Invalid case', () => {
      // @ts-expect-error: Target signature provides too few arguments.
      // Expected 2 or more, but got 1. ts(2322)
      const doSomething: Fn<number> = (value0, value1) => { }
      expect('').pass('')
    })

    // NOTE: `const doSomething: Fn<number> = () => { }` is still valid so this
    // could not be tested.

  })

  describe('Multiple args, no return type', () => {

    test('Valid case', () => {
      const doSomething: Fn<[number, number]> = (value0, value1) => {
        value0.toFixed(2)
        value1.toFixed(2)
      }
      doSomething(42, 43)
      // @ts-expect-error: Expected 2 arguments, but got 1.ts(2554)
      doSomething(42)
      expect('').pass('')
    })

    test('Invalid case', () => {
      // @ts-expect-error: Type '(value0: any, value1: any, value2: any) => void'
      // is not assignable to type '(args_0: number, args_1: number) => void'.
      const doSomething: Fn<[number, number]> = (value0, value1, value2) => { }
      expect('').pass('')
    })

  })

  describe('No args, with return type', () => {

    test('Valid case', () => {
      const getSomething: Fn<void, number> = () => 42
      const output: number = getSomething()
      expect('').pass('')
    })

    test('Invalid case', () => {
      // @ts-expect-error: Type 'void' is not assignable to type 'number'. ts(2322)
      const getSomething: Fn<void, number> = () => { }
      expect('').pass('')
    })

  })

  describe('One arg, with return type', () => {

    test('Valid case', () => {
      const calcSomething: Fn<number, number> = (value) => value + 1
      const output: number = calcSomething(42)
      expect('').pass('')
    })

    test('Invalid case', () => {
      // @ts-expect-error: Target signature provides too few arguments.
      // Expected 2 or more, but got 1. ts(2322)
      const calcSomething1: Fn<number, number> = (value0, value1) => value0 + value1
      expect('').pass('')
      // @ts-expect-error: Type 'void' is not assignable to type 'number'. ts(2322)
      const calcSomething2: Fn<number, number> = (value0) => { }
      expect('').pass('')
    })

    test('Special: Lone array argument must be wrapped in `[]`', () => {
      const doSomething: Fn<[string[]], string> = (...values) => values.join(',')
      expect('').pass('')
    })

  })

  describe('Multiple args, with return type', () => {

    test('Valid case', () => {
      const doSomething: Fn<[number, string], string> = (num, str) => {
        return num.toFixed(2) + str.trim()
      }
      expect('').pass('')
    })

    test('Invalid case', () => {
      // @ts-expect-error: Target signature provides too few arguments.
      // Expected 3 or more, but got 2. ts(2322)
      const doSomething1: Fn<[number, string], string> = (num, str, x) => ''
      // @ts-expect-error: Type 'void' is not assignable to type 'string'. ts(2322)
      const doSomething2: Fn<[number, string], string> = (num, str) => { }
      expect('').pass('')
    })

  })

})

describe('CleanupFunction', () => {

  test('Accepts no parameters', () => {
    // TODO
    expect('').pass('')
  })

  test('Accepts one parameter', () => {
    // TODO
    expect('').pass('')
  })

  test('Accepts multiple parameters', () => {
    // TODO
    expect('').pass('')
  })

})

describe('Factory', () => {

  test('Accepts no parameters', () => {
    // TODO
    expect('').pass('')
  })

  test('Accepts one parameter', () => {
    // TODO
    expect('').pass('')
  })

  test('Accepts multiple parameters', () => {
    // TODO
    expect('').pass('')
  })

})
