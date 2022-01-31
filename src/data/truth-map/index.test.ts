import { DynamicTruthMap, FixedTruthMap } from '.'

describe(FixedTruthMap.name, (): void => {

  test(FixedTruthMap.prototype.getKeys.name, (): void => {
    const output = new FixedTruthMap(['foo', 'bar']).getKeys()
    expect(output).toStrictEqual(['foo', 'bar'])
  })

  describe(FixedTruthMap.prototype.has.name, (): void => {

    test('Should be true', (): void => {
      const output = new FixedTruthMap(['foo', 'bar']).has('foo')
      expect(output).toBe(true)
    })

    test('Should be false', (): void => {
      const output = new FixedTruthMap(['foo', 'bar']).has('baz')
      expect(output).toBe(false)
    })

  })

  describe(FixedTruthMap.prototype.toJSON.name, (): void => {

    test('Output structure', (): void => {
      const output = new FixedTruthMap(['foo', 'bar']).toJSON()
      expect(output).toStrictEqual({
        foo: true,
        bar: true,
      })
    })

    test('Immutability', (): void => {
      const truthMap = new FixedTruthMap(['foo', 'bar'])
      const json1 = truthMap.toJSON()
      const json2 = truthMap.toJSON()
      expect(Object.is(json1, json2)).toBe(false)
      // Each time `.toJSON` is called, a new copy of the map is returned.
    })

  })

})

describe(DynamicTruthMap.name, (): void => {

  describe(DynamicTruthMap.prototype.add.name, (): void => {

    test('Normal', (): void => {
      const oldDynamicTruthMap = new DynamicTruthMap(['foo', 'bar'])
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
      const oldDynamicTruthMap = new DynamicTruthMap(['foo', 'bar'])
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

  describe(DynamicTruthMap.prototype.remove.name, (): void => {

    test('Key exists', (): void => {
      const oldDynamicTruthMap = new DynamicTruthMap(['foo', 'bar'])
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
      const oldDynamicTruthMap = new DynamicTruthMap(['foo', 'bar'])
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

})
