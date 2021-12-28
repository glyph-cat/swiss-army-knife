import { createStaticTruthMap, createTruthMap } from '.'

describe(createStaticTruthMap.name, (): void => {

  test('.getKeys', (): void => {
    const output = createStaticTruthMap(['foo', 'bar']).getKeys()
    expect(output).toStrictEqual(['foo', 'bar'])
  })

  describe('.has', (): void => {

    test('Should be true', (): void => {
      const output = createStaticTruthMap(['foo', 'bar']).has('foo')
      expect(output).toBe(true)
    })

    test('Should be false', (): void => {
      const output = createStaticTruthMap(['foo', 'bar']).has('baz')
      expect(output).toBe(false)
    })

  })

  describe('.toJSON', (): void => {

    test('Output structure', (): void => {
      const output = createStaticTruthMap(['foo', 'bar']).toJSON()
      expect(output).toStrictEqual({
        foo: true,
        bar: true,
      })
    })

    test('Immutability', (): void => {
      const truthMap = createStaticTruthMap(['foo', 'bar'])
      const JSON1 = truthMap.toJSON()
      const JSON2 = truthMap.toJSON()
      expect(Object.is(JSON1, JSON2)).toBe(false)
      // Each time `.toJSON` is called, a new copy of the map is returned.
    })

  })

})

describe(createTruthMap.name, (): void => {

  test('.clear', (): void => {
    const output = createTruthMap(['foo', 'bar']).clear()
    expect(output.getKeys()).toStrictEqual([])
    expect(output.toJSON()).toStrictEqual({})
  })

  describe('.add', (): void => {

    test('Normal', (): void => {
      const output = createTruthMap(['foo', 'bar']).add('baz')
      expect(output.getKeys()).toStrictEqual(['foo', 'bar', 'baz'])
      expect(output.toJSON()).toStrictEqual({
        foo: true,
        bar: true,
        baz: true,
      })
    })

    test('Duplicate handling', (): void => {
      const output = createTruthMap(['foo', 'bar']).add('bar')
      expect(output.getKeys()).toStrictEqual(['foo', 'bar'])
      expect(output.toJSON()).toStrictEqual({
        foo: true,
        bar: true,
      })
    })

  })

  describe('.remove', (): void => {

    test('Key exists', (): void => {
      const output = createTruthMap(['foo', 'bar']).remove('bar')
      expect(output.getKeys()).toStrictEqual(['foo'])
      expect(output.toJSON()).toStrictEqual({ foo: true })
    })

    test('Key does not exist', (): void => {
      const output = createTruthMap(['foo', 'bar']).remove('baz')
      expect(output.getKeys()).toStrictEqual(['foo', 'bar'])
      expect(output.toJSON()).toStrictEqual({ foo: true, bar: true })
    })

  })

})
