import { tryOnly } from '../../function/try-only'
import { enumerate, MutableEnumeration } from '.'

// NOTE: Not sure why but error is only thrown when trying to modify values of
// freezed objects in some environment. That's why `tryOnly` is used.

describe(enumerate.name, (): void => {

  test('Check structure of enumeration', (): void => {
    const enumaration = enumerate({ a: 1, b: 2 })
    expect(enumaration).toStrictEqual({ a: 1, b: 2, 1: 'a', 2: 'b' })
  })

  test('Attempt to modify existing value', (): void => {
    const enumaration = enumerate({ a: 1, b: 2 })
    tryOnly(() => {
      // @ts-expect-error Done on purpose to test behaviour.
      enumaration.a = -1
    })
    // Check if structure of enumeration is still in tact
    expect(enumaration).toStrictEqual({ a: 1, b: 2, 1: 'a', 2: 'b' })
  })

  test('Attempt to add new value', (): void => {
    const enumaration = enumerate({ a: 1, b: 2 })
    tryOnly(() => {
      enumaration['c'] = 3
    })
    // Check if structure of original enumeration is still in tact
    expect(enumaration).toStrictEqual({ a: 1, b: 2, 1: 'a', 2: 'b' })
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
