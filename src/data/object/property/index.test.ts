import {
  getObjectPathSegments,
  hasDeepProperty,
  hasEitherDeepProperties,
  hasEitherProperties,
  hasProperty,
  hasTheseDeepProperties,
  hasTheseProperties,
} from '.'

describe(hasProperty.name, (): void => {

  const $internals = Symbol()
  const SAMPLE_OBJECT = {
    foo: 1,
    bar: undefined,
    7: 'seven',
    [$internals]: {},
  } as const

  test('Does exist', (): void => {
    expect(hasProperty(SAMPLE_OBJECT, 'foo')).toBe(true)
    expect(hasProperty(SAMPLE_OBJECT, 7)).toBe(true)
    expect(hasProperty(SAMPLE_OBJECT, $internals)).toBe(true)
  })

  test('Does exist, but undefined', (): void => {
    expect(hasProperty(SAMPLE_OBJECT, 'bar')).toBe(true)
  })

  test('Does not exist', (): void => {
    expect(hasProperty(SAMPLE_OBJECT, 'baz')).toBe(false)
  })

  test('Non-object types', (): void => {
    expect(hasProperty(null, 'foo')).toBe(false)
    expect(hasProperty(undefined, 'foo')).toBe(false)
    expect(hasProperty(42, 'foo')).toBe(false)
    // okay... weird:
    expect(hasProperty(42, 'toString')).toBe(false)
    expect(hasProperty(false, 'valueOf')).toBe(false)
  })

})

describe(hasEitherProperties.name, () => {

  test('Has none', () => {
    // hasEitherProperties()
  })

  test('Has some', () => {
    // hasEitherProperties()
  })

  test('Has all', () => {
    // hasEitherProperties()
  })

})

describe(hasTheseProperties.name, () => {

  test('Has none', () => {
    // hasTheseProperties()
  })

  test('Has some', () => {
    // hasTheseProperties()
  })

  test('Has all', () => {
    // hasTheseProperties()
  })

})

test.only(getObjectPathSegments.name, () => {
  const output = getObjectPathSegments('foo.bar.123[a]["b"][\'c\'].d[`e`]')
  expect(output).toStrictEqual(['foo', 'bar', '123', 'a', 'b', 'c', 'd', 'e'])
})

describe(hasDeepProperty.name, () => {

  // ...

})

describe(hasEitherDeepProperties.name, () => {

  // ...

})

describe(hasTheseDeepProperties.name, () => {

  // ...

})
