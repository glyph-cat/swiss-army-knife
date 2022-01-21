import { tryOnly } from '../../function/try-only'
import { enumerate, mutableEnumerate } from '.'

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

describe(mutableEnumerate.name, (): void => {

  test('Check structure of enumeration', (): void => {
    const enumeration = mutableEnumerate({ a: 1, b: 2 })
    expect(enumeration.getAll()).toStrictEqual({ a: 1, b: 2, 1: 'a', 2: 'b' })
  })

  test('.get', (): void => {
    const enumeration = mutableEnumerate({ a: 1, b: 2 })
    expect(enumeration.get('a')).toStrictEqual(1)
    expect(enumeration.get('b')).toStrictEqual(2)
    expect(enumeration.get(1)).toStrictEqual('a')
    expect(enumeration.get(2)).toStrictEqual('b')
  })

  test('.add', (): void => {
    const enumeration = mutableEnumerate({ a: 1, b: 2 })
    enumeration.add('c', 3)
    expect(enumeration.getAll()).toStrictEqual({
      a: 1,
      b: 2,
      c: 3,
      1: 'a',
      2: 'b',
      3: 'c',
    })
  })

  test('.remove', (): void => {
    const enumeration = mutableEnumerate({ a: 1, b: 2 })
    enumeration.remove('a')
    expect(enumeration.getAll()).toStrictEqual({ b: 2, 2: 'b' })
  })

  test('.has', (): void => {
    const enumeration = mutableEnumerate({ a: 1, b: 2 })
    expect(enumeration.has(1)).toBe(true)
    expect(enumeration.has(2)).toBe(true)
    expect(enumeration.has('a')).toBe(true)
    expect(enumeration.has('b')).toBe(true)
    expect(enumeration.has('c')).toBe(false)
  })

})
