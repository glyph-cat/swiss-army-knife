import { CSSClassNameFactory } from '.'

describe(`static ${CSSClassNameFactory.create.name}`, () => {

  test('Normal', () => {
    expect(CSSClassNameFactory.create(32)).toMatch(/^[a-z0-9]{32}$/i)
  })

  test('Invalid length', () => {
    // NOTE: There will at least be one character because of the alphabet prefix.
    expect(CSSClassNameFactory.create(0).length).toBe(1)
    expect(CSSClassNameFactory.create(-1).length).toBe(1)
  })

})

describe(CSSClassNameFactory.prototype.create.name, () => {

  test('Happy path', () => {
    expect(new CSSClassNameFactory(8).create()).toMatch(/^[a-z0-9]{8}$/i)
  })

  test('Overwrite length', () => {
    expect(new CSSClassNameFactory(8).create(16)).toMatch(/^[a-z0-9]{16}$/i)
  })

  // KIV
  // Length bumping is difficult to test because the charset's length is very long
  // yet cannot be customized.

})
