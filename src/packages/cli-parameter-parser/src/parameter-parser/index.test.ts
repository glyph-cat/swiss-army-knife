import { ParameterParser } from '.'

describe(ParameterParser.prototype.getOne.name, () => {

  test('Empty array', () => {
    const parameters = new ParameterParser([])
    const output = parameters.getOne('a', 'anything')
    expect(output).toBe(null)
  })

  test('Not specified', () => {
    const parameters = new ParameterParser(['-b', 'abc'])
    const output = parameters.getOne('a', 'anything')
    expect(output).toBe(null)
  })

  test('Using alias', () => {
    const parameters = new ParameterParser(['-a', 'foo', '-x', '...'])
    const output = parameters.getOne('a', 'anything')
    expect(output).toBe('foo')
  })

  test('Using name', () => {
    const parameters = new ParameterParser(['--anything', 'foo', '-x', '...'])
    const output = parameters.getOne('a', 'anything')
    expect(output).toBe('foo')
  })

})

describe(ParameterParser.prototype.getBoolean.name, () => {

  test('Empty array', () => {
    const parameters = new ParameterParser([])
    const output = parameters.getBoolean('a', 'anything')
    expect(output).toBe(false)
  })

  test('Not specified', () => {
    const parameters = new ParameterParser(['-b', 'abc'])
    const output = parameters.getBoolean('a', 'anything')
    expect(output).toBe(false)
  })

  describe('Flag only', () => {

    test('Using alias', () => {
      const parameters = new ParameterParser(['-a', '-x', '...'])
      const output = parameters.getBoolean('a', 'anything')
      expect(output).toBe(true)
    })

    test('Using name', () => {
      const parameters = new ParameterParser(['--anything', '-x', '...'])
      const output = parameters.getBoolean('a', 'anything')
      expect(output).toBe(true)
    })

  })

  describe('Flag: Truthy', () => {

    test('Using alias', () => {
      const parameters = new ParameterParser(['-a', 'true', '-x', '...'])
      const output = parameters.getBoolean('a', 'anything')
      expect(output).toBe(true)
    })

    test('Using name', () => {
      const parameters = new ParameterParser(['--anything', 'true', '-x', '...'])
      const output = parameters.getBoolean('a', 'anything')
      expect(output).toBe(true)
    })

    describe('Other truthy values', () => {

      test('`t`', () => {
        const parameters = new ParameterParser(['--anything', 't', '-x', '...'])
        const output = parameters.getBoolean('a', 'anything')
        expect(output).toBe(true)
      })

      test('`1`', () => {
        const parameters = new ParameterParser(['--anything', '1', '-x', '...'])
        const output = parameters.getBoolean('a', 'anything')
        expect(output).toBe(true)
      })

      test('`y`', () => {
        const parameters = new ParameterParser(['--anything', 'y', '-x', '...'])
        const output = parameters.getBoolean('a', 'anything')
        expect(output).toBe(true)
      })

      test('`yes`', () => {
        const parameters = new ParameterParser(['--anything', 'yes', '-x', '...'])
        const output = parameters.getBoolean('a', 'anything')
        expect(output).toBe(true)
      })

    })

  })

  describe('Flag Falsy', () => {

    // Basically any values outside of the truthy values will be treated as false
    // But these "falsy" values below are the intended usage so we should at least test them.
    // Also, to reduce complexity, the '-a' and '--anything' usage patterns are mixed below.

    // Also note that we want to make sure if there are other parameters behind the flag,
    // then it should ignore them and not treat the value as false. This should be done
    // by checking if the next string contains a leading dash.

    test('`n`', () => {
      const parameters = new ParameterParser(['--a', 'n', '-x', '...'])
      const output = parameters.getBoolean('a', 'anything')
      expect(output).toBe(false)
    })

    test('`no`', () => {
      const parameters = new ParameterParser(['--anything', 'no', '-x', '...'])
      const output = parameters.getBoolean('a', 'anything')
      expect(output).toBe(false)
    })

    test('`f`', () => {
      const parameters = new ParameterParser(['--a', 'f', '-x', '...'])
      const output = parameters.getBoolean('a', 'anything')
      expect(output).toBe(false)
    })

    test('`false`', () => {
      const parameters = new ParameterParser(['--anything', 'false', '-x', '...'])
      const output = parameters.getBoolean('a', 'anything')
      expect(output).toBe(false)
    })

    test('`0`', () => {
      const parameters = new ParameterParser(['--a', '0', '-x', '...'])
      const output = parameters.getBoolean('a', 'anything')
      expect(output).toBe(false)
    })

  })

})

describe(ParameterParser.prototype.getTrailing.name, () => {

  test('Empty array', () => {
    const parameters = new ParameterParser([])
    const output = parameters.getTrailing('a', 'anything')
    expect(output).toStrictEqual([])
  })

  test('Not specified', () => {
    const parameters = new ParameterParser(['-b', 'abc'])
    const output = parameters.getTrailing('a', 'anything')
    expect(output).toStrictEqual([])
  })

  describe('Using alias', () => {

    test('Only flag, no value', () => {
      const parameters = new ParameterParser(['-a'])
      const output = parameters.getTrailing('a', 'anything')
      expect(output).toStrictEqual([])
    })

    test('Happy Path', () => {
      const parameters = new ParameterParser(['-a', 'foo', 'bar', 'baz'])
      const output = parameters.getTrailing('a', 'anything')
      expect(output).toStrictEqual(['foo', 'bar', 'baz'])
    })

  })

  describe('Using name', () => {

    test('Only flag, no value', () => {
      const parameters = new ParameterParser(['--anything'])
      const output = parameters.getTrailing('a', 'anything')
      expect(output).toStrictEqual([])
    })

    test('Happy Path', () => {
      const parameters = new ParameterParser(['--anything', 'foo', 'bar', 'baz'])
      const output = parameters.getTrailing('a', 'anything')
      expect(output).toStrictEqual(['foo', 'bar', 'baz'])
    })

  })

})

describe(ParameterParser.prototype.getRemaining.name, () => {

  test('Empty array', () => {
    const parameters = new ParameterParser([])
    const output = parameters.getRemaining()
    expect(output).toStrictEqual([])
  })

  test('Happy Path', () => {
    const parameters = new ParameterParser([
      '-a', '1',
      '-b', '2',
      '-c', '3',
      '-a', '4', '5',
      '-d', '6',
      '-e',
      '-f', 'true',
      '-g', 'false',
      '-b', '7', '8',
      '-h', '9', '10', '11'
    ])
    parameters.getOne('d', 'something_d')
    parameters.getBoolean('e', 'something_e')
    parameters.getBoolean('f', 'something_f')
    parameters.getBoolean('g', 'something_g')
    parameters.getAll('a', 'anything')
    parameters.getTrailing('h', 'something_h')
    const output = parameters.getRemaining()
    expect(output).toStrictEqual(['-b', '2', '-c', '3', '-b', '7', '8'])
  })

})

describe(ParameterParser.prototype.getAll.name, () => {

  test('Empty array', () => {
    const parameters = new ParameterParser([])
    const output = parameters.getAll('a', 'anything')
    expect(output).toStrictEqual([])
  })

  test('Not specified', () => {
    const parameters = new ParameterParser(['-b', 'abc'])
    const output = parameters.getAll('a', 'anything')
    expect(output).toStrictEqual([])
  })

  test('Only flag, no value', () => {
    const parameters = new ParameterParser(['-a'])
    const output = parameters.getAll('a', 'anything')
    expect(output).toStrictEqual([])
  })

  test('Happy Path (Mixed using name and alias)', () => {
    const parameters = new ParameterParser([
      '-a', 'foo', 'bar', '--anything', 'baz', '-b', 'abc', '-a', 'qux'
    ])
    const output = parameters.getAll('a', 'anything')
    expect(output).toStrictEqual(['foo', 'bar', 'baz', 'qux'])
  })

})
