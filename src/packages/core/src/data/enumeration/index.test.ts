import { createEnumToStringConverter, enumerate, fullyEnumerate, MutableEnumeration } from '.'
import { tryOnly } from '../../function/try-only'

test(createEnumToStringConverter.name, () => {

  enum TestEnum {
    FOO,
    BAR,
  }

  const TestEnumToString = createEnumToStringConverter(TestEnum)

  expect(TestEnumToString(TestEnum.FOO)).toBe('FOO')
  expect(TestEnumToString('abc')).toBe('abc')

})

describe(fullyEnumerate.name, () => {

  describe('Proof of concept', () => {

    test('Enum with numeric values', () => {
      enum SomeEnum {
        FOO = 1,
        BAR
      }
      expect(SomeEnum.FOO).toBe(1)
      expect(SomeEnum.BAR).toBe(2)
      expect(SomeEnum[SomeEnum.FOO]).toBe('FOO')
      expect(SomeEnum[SomeEnum.BAR]).toBe('BAR')
    })

    test('Enum with string values', () => {
      enum SomeEnum {
        FOO = 'a',
        BAR = 'b',
      }
      expect(SomeEnum.FOO).toBe('a')
      expect(SomeEnum.BAR).toBe('b')
      expect(SomeEnum[SomeEnum.FOO]).toBe(undefined)
      expect(SomeEnum[SomeEnum.BAR]).toBe(undefined)
      SomeEnum[SomeEnum.FOO] = 'FOO'
      SomeEnum[SomeEnum.BAR] = 'BAR'
      expect(SomeEnum[SomeEnum.FOO]).toBe('FOO')
      expect(SomeEnum[SomeEnum.BAR]).toBe('BAR')
    })

  })

  test('Main', () => {
    enum SomeEnum {
      FOO = 'a',
      BAR = 'b',
    }
    expect(SomeEnum.FOO).toBe('a')
    expect(SomeEnum.BAR).toBe('b')
    expect(SomeEnum[SomeEnum.FOO]).toBe(undefined)
    expect(SomeEnum[SomeEnum.BAR]).toBe(undefined)
    fullyEnumerate(SomeEnum)
    expect(SomeEnum[SomeEnum.FOO]).toBe('FOO')
    expect(SomeEnum[SomeEnum.BAR]).toBe('BAR')
  })
})

// NOTE: Not sure why but error is only thrown when trying to modify values of
// freezed objects in some environment. That's why `tryOnly` is used.

describe(enumerate.name, (): void => {

  test('Check structure of enumeration', (): void => {
    const enumeration = enumerate({ a: 1, b: 2 })
    expect(enumeration).toStrictEqual({ a: 1, b: 2, 1: 'a', 2: 'b' })
  })

  test('Attempt to modify existing value', (): void => {
    const enumeration = enumerate({ a: 1, b: 2 })
    tryOnly(() => {
      // @ts-expect-error Done on purpose to test behavior.
      enumeration.a = -1
    })
    // Check if structure of enumeration is still in tact
    expect(enumeration).toStrictEqual({ a: 1, b: 2, 1: 'a', 2: 'b' })
  })

  test('Attempt to add new value', (): void => {
    const enumeration = enumerate({ a: 1, b: 2 })
    tryOnly(() => {
      enumeration['c'] = 3
    })
    // Check if structure of original enumeration is still in tact
    expect(enumeration).toStrictEqual({ a: 1, b: 2, 1: 'a', 2: 'b' })
  })

})

describe(MutableEnumeration.name, (): void => {

  test('constructor', (): void => {
    const enumeration = new MutableEnumeration({ a: 1, b: 2 })
    expect(enumeration.toJSON()).toStrictEqual({ a: 1, b: 2, 1: 'a', 2: 'b' })
  })

  test(MutableEnumeration.prototype.get.name, (): void => {
    const enumeration = new MutableEnumeration({ a: 1, b: 2 })
    expect(enumeration.get('a')).toStrictEqual(1)
    expect(enumeration.get('b')).toStrictEqual(2)
    expect(enumeration.get(1)).toStrictEqual('a')
    expect(enumeration.get(2)).toStrictEqual('b')
  })

  test(MutableEnumeration.prototype.add.name, (): void => {
    const oldEnumeration = new MutableEnumeration({ a: 1, b: 2 })
    const newEnumeration = oldEnumeration.add('c', 3)
    expect(oldEnumeration.toJSON()).toStrictEqual({
      a: 1,
      b: 2,
      1: 'a',
      2: 'b',
    })
    expect(newEnumeration.toJSON()).toStrictEqual({
      a: 1,
      b: 2,
      c: 3,
      1: 'a',
      2: 'b',
      3: 'c',
    })
  })

  test(MutableEnumeration.prototype.remove.name, (): void => {
    const oldEnumeration = new MutableEnumeration({ a: 1, b: 2 })
    const newEnumeration = oldEnumeration.remove('a')
    expect(oldEnumeration.toJSON()).toStrictEqual({
      a: 1,
      b: 2,
      1: 'a',
      2: 'b',
    })
    expect(newEnumeration.toJSON()).toStrictEqual({
      b: 2,
      2: 'b',
    })
  })

  test(MutableEnumeration.prototype.has.name, (): void => {
    const enumeration = new MutableEnumeration({ a: 1, b: 2 })
    expect(enumeration.has(1)).toBe(true)
    expect(enumeration.has(2)).toBe(true)
    expect(enumeration.has('a')).toBe(true)
    expect(enumeration.has('b')).toBe(true)
    expect(enumeration.has('c')).toBe(false)
  })

  test(MutableEnumeration.prototype.clone.name, (): void => {
    const oldEnumeration = new MutableEnumeration({ a: 1, b: 2 })
    const newEnumeration = oldEnumeration.clone()
    expect(newEnumeration.toJSON()).toStrictEqual({
      a: 1,
      b: 2,
      1: 'a',
      2: 'b',
    })
  })

})
