import { HashFactory } from '.'
import { TruthRecord } from '../../types'

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

    const output: TruthRecord = {}
    const numberOfHashesToGenerate = Math.pow(charset.length, minimumLength) + 1
    for (let i = 0; i < numberOfHashesToGenerate; i++) {
      output[hashFactory.create()] = true
    }
    const generatedHashes = Object.keys(output)

    // Check for uniqueness:
    expect(generatedHashes.length).toBe(5)

    // Check for length bump
    expect(generatedHashes.some((hash) => hash.length > minimumLength)).toBe(true)

    // NOTE:
    // - The collision count is non-unique
    // - For example, if 3 'aa' hashes were generated, the unique collision count
    //   would be 1 but the total collision count is 3
    // - Put bluntly, length bumping can occur prematurely, but this is an
    //   acceptable compromise because we don't want to exhaust every possible
    //   combination in a given charset and length before bumping it as it would
    //   waste a lot of system resources.

  })

})
