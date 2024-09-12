import { HashFactory } from '.'

describe(`static ${HashFactory.create.name}`, () => {

  test('Normal', () => {
    expect(HashFactory.create(32)).toMatch(/^[a-z0-9]{32}$/i)
  })

  test('Custom charset', () => {
    expect(HashFactory.create(32, 'ab')).toMatch(/^[ab]{32}$/i)
  })

  test('Invalid length', () => {
    expect(HashFactory.create(0)).toBe('')
    expect(HashFactory.create(-1)).toBe('')
    // NOTE: Empty charset is not tested against, it is up to the developer to
    // ensure the charset always have at least 1 character.
  })

})

describe(HashFactory.prototype.create.name, () => {

  test('Happy path', () => {
    expect(new HashFactory(8).create()).toMatch(/^[a-z0-9]{8}$/i)
  })

  test('Overwrite length', () => {
    expect(new HashFactory(8).create(16)).toMatch(/^[a-z0-9]{16}$/i)
  })

  test('Overwrite charset', () => {
    expect(new HashFactory(8).create(null, 'ab')).toMatch(/^[ab]{8}$/i)
  })

  test('Custom charset from constructor', () => {
    expect(new HashFactory(8, 'ab').create()).toMatch(/^[ab]{8}$/i)
  })

  test('Length bumping', () => {

    const charset = 'ab'
    const minimumLength = 2
    const hashFactory = new HashFactory(minimumLength, charset, 1)

    const sortFn = (a: string, b: string) => {
      const lengthDiff = a.length - b.length
      return lengthDiff !== 0 ? lengthDiff : (a < b ? -1 : 1)
    }

    const output1: Array<string> = []
    for (let i = 0; i < Math.pow(charset.length, minimumLength); i++) {
      output1.push(hashFactory.create())
    }
    expect(output1.sort(sortFn)).toStrictEqual(['aa', 'ab', 'ba', 'bb'])

    const output2: Array<string> = []
    for (let i = 0; i < Math.pow(charset.length, minimumLength + 1); i++) {
      output2.push(hashFactory.create())
    }
    expect(output2.sort(sortFn)).toStrictEqual([
      'aaa',
      'aab',
      'aba',
      'abb',
      'baa',
      'bab',
      'bba',
      'bbb',
    ])

  })

})
