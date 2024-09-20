import {
  deepGet,
  deepSet,
  deepSetMutable,
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
    const output = hasEitherProperties({ foo: 1, bar: 2, baz: 3 }, ['qux', 'meow'])
    expect(output).toBe(false)
  })

  test('Has some', () => {
    const output = hasEitherProperties({ foo: 1, bar: 2, baz: 3 }, ['baz', 'meow'])
    expect(output).toBe(true)
  })

  test('Has all', () => {
    const output = hasEitherProperties({ foo: 1, bar: 2, baz: 3 }, ['foo', 'bar', 'baz'])
    expect(output).toBe(true)
  })

})

describe(hasTheseProperties.name, () => {

  test('Has none', () => {
    const output = hasTheseProperties({ foo: 1, bar: 2, baz: 3 }, ['qux', 'meow'])
    expect(output).toBe(false)
  })

  test('Has some', () => {
    const output = hasTheseProperties({ foo: 1, bar: 2, baz: 3 }, ['baz', 'meow'])
    expect(output).toBe(false)
  })

  test('Has all', () => {
    const output = hasTheseProperties({ foo: 1, bar: 2, baz: 3 }, ['foo', 'bar', 'baz'])
    expect(output).toBe(true)
  })

})

describe(getObjectPathSegments.name, () => {

  test('Happy path', () => {
    const output = getObjectPathSegments('foo.bar.123[a]["b"][\'c\'].d[`e`]["456"][789][""a"]')
    expect(output).toStrictEqual([
      'foo',
      'bar',
      '123', // number preceded by dot will be treated as string (object key)
      'a',   // name without quotes will be treated as if they have one
      'b',   // double quotes are accepted
      'c',   // single quotes are accepted
      'd',
      'e',   // backtick quotes are accepted
      '456', // number in square brackets with quotes will be treated as string (object key)
      789,   // number in square brackets will be treated as number (array index)
      '"a',  // escaped quotes should not cause any problems
    ])
  })

  test('Square bracket followed by number', () => {
    const output = getObjectPathSegments('[a]1')
    expect(output).toStrictEqual(['a', '1'])
  })

  test('First segment is array index', () => {
    const output = getObjectPathSegments('[0].foo.bar')
    expect(output).toStrictEqual([0, 'foo', 'bar'])
  })

  test('Empty segments are ignored', () => {
    const output = getObjectPathSegments('a..b[]c')
    expect(output).toStrictEqual(['a', 'b', 'c'])
  })

  test('Property that starts with numbers', () => {
    const output = getObjectPathSegments('foo.123abc')
    expect(output).toStrictEqual(['foo', '123abc'])
  })

})

describe(hasDeepProperty.name, () => {

  test('Has none', () => {
    // ...
  })

  test('Has some', () => {
    // ...
  })

  test('Has all', () => {
    // ...
  })

})

describe(hasEitherDeepProperties.name, () => {

  test('Has none', () => {
    // ...
  })

  test('Has some', () => {
    // ...
  })

  test('Has all', () => {
    // ...
  })

})

describe(hasTheseDeepProperties.name, () => {

  test('Has none', () => {
    // ...
  })

  test('Has some', () => {
    // ...
  })

  test('Has all', () => {
    // ...
  })

})

describe(deepGet.name, () => {

  test('Value exists', () => {
    const obj = {
      stageId: 1,
      player: {
        name: 'John',
        coord: { x: 1, y: 5 },
      },
    }
    const [value, exists] = deepGet(obj, ['player', 'coord', 'x'])
    expect(value).toBe(1)
    expect(exists).toBe(true)
  })

  test('Value does not exist', () => {
    const obj = {
      stageId: 1,
      player: {
        name: 'John',
        coord: { x: 1, y: 5 },
      },
    }
    const [value, exists] = deepGet(obj, ['player', 'coord', 'z'])
    expect(value).toBe(undefined)
    expect(exists).toBe(false)
  })

})

describe(deepSet.name, () => {

  test.only('Value already exists', () => {
    const obj = {
      stageId: 1,
      player: {
        name: 'John',
        coord: { x: 1, y: 5 },
      },
    }
    const originalSnapshot = JSON.stringify(obj)
    const output = deepSet(obj, ['player', 'coord', 'x'], 2)
    expect(output).toStrictEqual({
      stageId: 1,
      player: {
        name: 'John',
        coord: { x: 2, y: 5 },
      },
    })
    expect(Object.is(obj, output)).toBe(false)
    expect(JSON.stringify(output)).not.toBe(originalSnapshot)
  })

  test('Value does not already exist', () => {
    // ...
  })

  test('Single key', () => {
    const obj = {}
    const originalSnapshot = JSON.stringify(obj)
    const output = deepSet(obj, 'foo', 42)
    expect(output).toStrictEqual({ foo: 42 })
    expect(Object.is(obj, output)).toBe(false)
    expect(JSON.stringify(output)).not.toBe(originalSnapshot)
  })

  describe('Object and array differentiation', () => {

    test('Object property', () => {
      // ...
    })

    test('Array index', () => {
      // ...
    })

  })

})

describe(deepSetMutable.name, () => {

  test('Value already exists', () => {
    const obj = {
      stageId: 1,
      player: {
        name: 'John',
        coord: { x: 1, y: 5 },
      },
    }
    deepSetMutable(obj, ['player', 'coord', 'x'], 2)
    expect(obj.player.coord.x).toBe(2)
  })

  test('Value does not already exist', () => {
    const obj = {
      stageId: 1,
      player: {
        name: 'John',
        coord: { x: 1, y: 5 },
      },
    }
    deepSetMutable(obj, ['player', 'coord', 'z'], 2)
    expect(obj.player.coord['z']).toBe(2)
    deepSetMutable(obj, ['player', 'preferences', 'effects'], 'ultra')
    expect(obj.player['preferences']['effects']).toBe('ultra')
  })

  test('Single key', () => {
    const obj = {}
    deepSetMutable(obj, ['foo'], 42)
    expect(obj['foo']).toBe(42)
  })

  describe('Object and array differentiation', () => {

    test('Object property', () => {
      const obj = {}
      deepSetMutable(obj, 'a["2"]', 'foo')
      expect(obj).toStrictEqual({ a: { 2: 'foo' } })
    })

    test('Array index', () => {
      const obj = {}
      deepSetMutable(obj, 'a[2]', 'foo')
      expect(JSON.stringify(obj)).toBe(JSON.stringify({ a: [null, null, 'foo'] }))
    })

  })

})
