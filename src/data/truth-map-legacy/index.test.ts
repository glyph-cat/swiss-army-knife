import { LEGACY_DynamicTruthMap, LEGACY_FixedTruthMap } from '.'

describe(LEGACY_FixedTruthMap.name, (): void => {

  test(LEGACY_FixedTruthMap.prototype.getKeys.name, (): void => {
    const output = new LEGACY_FixedTruthMap(['foo', 'bar']).getKeys()
    expect(output).toStrictEqual(['foo', 'bar'])
  })

  describe(LEGACY_FixedTruthMap.prototype.has.name, (): void => {

    test('Should be true', (): void => {
      const output = new LEGACY_FixedTruthMap(['foo', 'bar']).has('foo')
      expect(output).toBe(true)
    })

    test('Should be false', (): void => {
      const output = new LEGACY_FixedTruthMap(['foo', 'bar']).has('baz')
      expect(output).toBe(false)
    })

  })

  describe(LEGACY_FixedTruthMap.prototype.toJSON.name, (): void => {

    test('Output structure', (): void => {
      const output = new LEGACY_FixedTruthMap(['foo', 'bar']).toJSON()
      expect(output).toStrictEqual({
        foo: true,
        bar: true,
      })
    })

    test('Immutability', (): void => {
      const truthMap = new LEGACY_FixedTruthMap(['foo', 'bar'])
      const json1 = truthMap.toJSON()
      const json2 = truthMap.toJSON()
      expect(Object.is(json1, json2)).toBe(false)
      // Each time `.toJSON` is called, a new copy of the map is returned.
    })

  })

})

describe(LEGACY_DynamicTruthMap.name, (): void => {

  describe(LEGACY_DynamicTruthMap.prototype.add.name, (): void => {

    test('Normal', (): void => {
      const oldDynamicTruthMap = new LEGACY_DynamicTruthMap(['foo', 'bar'])
      const newDynamicTruthMap = oldDynamicTruthMap.add('baz')
      expect(oldDynamicTruthMap.toJSON()).toStrictEqual({
        foo: true,
        bar: true,
      })
      expect(newDynamicTruthMap.toJSON()).toStrictEqual({
        foo: true,
        bar: true,
        baz: true,
      })
    })

    test('Duplicate handling', (): void => {
      const oldDynamicTruthMap = new LEGACY_DynamicTruthMap(['foo', 'bar'])
      const newDynamicTruthMap = oldDynamicTruthMap.add('bar')
      expect(oldDynamicTruthMap.toJSON()).toStrictEqual({
        foo: true,
        bar: true,
      })
      expect(newDynamicTruthMap.toJSON()).toStrictEqual({
        foo: true,
        bar: true,
      })
    })

  })

  describe(LEGACY_DynamicTruthMap.prototype.remove.name, (): void => {

    test('Key exists', (): void => {
      const oldDynamicTruthMap = new LEGACY_DynamicTruthMap(['foo', 'bar'])
      const newDynamicTruthMap = oldDynamicTruthMap.remove('bar')
      expect(oldDynamicTruthMap.toJSON()).toStrictEqual({
        foo: true,
        bar: true,
      })
      expect(newDynamicTruthMap.toJSON()).toStrictEqual({
        foo: true,
      })
    })

    test('Key does not exist', (): void => {
      const oldDynamicTruthMap = new LEGACY_DynamicTruthMap(['foo', 'bar'])
      const newDynamicTruthMap = oldDynamicTruthMap.remove('baz')
      expect(oldDynamicTruthMap.toJSON()).toStrictEqual({
        foo: true,
        bar: true,
      })
      expect(newDynamicTruthMap.toJSON()).toStrictEqual({
        foo: true,
        bar: true,
      })
    })

  })

  test('Stress test', () => {
    const initialDynamicTruthMap = new LEGACY_DynamicTruthMap()
    let currentDynamicTruthMap = initialDynamicTruthMap
    expect(currentDynamicTruthMap.toJSON()).toStrictEqual({})

    currentDynamicTruthMap = currentDynamicTruthMap.add('foo')
    expect(currentDynamicTruthMap.toJSON()).toStrictEqual({
      foo: true,
    })

    currentDynamicTruthMap = currentDynamicTruthMap.add('bar')
    expect(currentDynamicTruthMap.toJSON()).toStrictEqual({
      foo: true,
      bar: true,
    })

    currentDynamicTruthMap = currentDynamicTruthMap.add('baz')
    expect(currentDynamicTruthMap.toJSON()).toStrictEqual({
      foo: true,
      bar: true,
      baz: true,
    })

    currentDynamicTruthMap = currentDynamicTruthMap.remove('bar')
    expect(currentDynamicTruthMap.toJSON()).toStrictEqual({
      foo: true,
      baz: true,
    })

    currentDynamicTruthMap = currentDynamicTruthMap.add('bar')
    expect(currentDynamicTruthMap.toJSON()).toStrictEqual({
      foo: true,
      baz: true,
      bar: true,
    })

    currentDynamicTruthMap = currentDynamicTruthMap.remove('bar')
    expect(currentDynamicTruthMap.toJSON()).toStrictEqual({
      foo: true,
      baz: true,
    })

    currentDynamicTruthMap = currentDynamicTruthMap.add('bar')
    expect(currentDynamicTruthMap.toJSON()).toStrictEqual({
      foo: true,
      baz: true,
      bar: true,
    })

    currentDynamicTruthMap = currentDynamicTruthMap.add('meow')
    expect(currentDynamicTruthMap.toJSON()).toStrictEqual({
      foo: true,
      baz: true,
      bar: true,
      meow: true,
    })
  })

})
