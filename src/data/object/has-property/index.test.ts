import { hasProperty } from '.'

describe(hasProperty.name, (): void => {

  const SAMPLE_OBJECT = { foo: 1, bar: undefined } as const

  test('Does exist', (): void => {
    expect(hasProperty(SAMPLE_OBJECT, 'foo')).toBe(true)
  })

  test('Does exist, but undefined', (): void => {
    expect(hasProperty(SAMPLE_OBJECT, 'bar')).toBe(true)
  })

  test('Does not exist', (): void => {
    expect(hasProperty(SAMPLE_OBJECT, 'baz')).toBe(false)
  })

})
