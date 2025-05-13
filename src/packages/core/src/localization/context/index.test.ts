import {
  LanguageNotFoundError,
  LocalizationContext,
  LocalizationDictionary,
  LocalizationKeyNotFoundError,
} from '..'
import { createRef } from '../../data'

test('Initialization', () => {

  const localizationDictionary = new LocalizationDictionary({
    'en': { HELLO: 'Hello' },
    'zh': { HELLO: '哈咯' },
  })

  const localizationContext = new LocalizationContext(localizationDictionary, 'en')

  expect(Object.is(localizationContext.dictionary, localizationDictionary)).toBe(true)
  expect(localizationContext.defaultLanguage).toBe('en')
  expect(localizationContext.defaultAuto).toBe(false)
  expect(localizationContext.currentLanguage).toBe('en')
  expect(localizationContext.state.get()).toStrictEqual({
    language: 'en',
    auto: false,
  })

})

describe(LocalizationContext.prototype.setLanguage.name, () => {

  test('Valid language', () => {
    const localizationDictionary = new LocalizationDictionary({
      'en': { HELLO: 'Hello' },
      'zh': { HELLO: '哈咯' },
    })
    const localizationContext = new LocalizationContext(localizationDictionary, 'en')
    localizationContext.setLanguage('zh')
    expect(localizationContext.defaultAuto).toBe(false)
    expect(localizationContext.currentLanguage).toBe('zh')
    expect(localizationContext.state.get()).toStrictEqual({
      language: 'zh',
      auto: false,
    })
  })

  test('Invalid language', () => {
    const localizationDictionary = new LocalizationDictionary({
      'en': { HELLO: 'Hello' },
      'zh': { HELLO: '哈咯' },
    })
    const localizationContext = new LocalizationContext(localizationDictionary, 'en')
    expect(() => {
      // @ts-expect-error: Done on purpose to test the error.
      localizationContext.setLanguage('??')
    }).toThrow(new LanguageNotFoundError('??'))
  })

})

describe(LocalizationContext.prototype.trySetLanguage.name, () => {

  test('Valid language', () => {
    const localizationDictionary = new LocalizationDictionary({
      'en': { HELLO: 'Hello' },
      'zh': { HELLO: '哈咯' },
    })
    const localizationContext = new LocalizationContext(localizationDictionary, 'en')
    expect(localizationContext.trySetLanguage('zh')).toBe(true)
    expect(localizationContext.defaultAuto).toBe(false)
    expect(localizationContext.currentLanguage).toBe('zh')
    expect(localizationContext.state.get()).toStrictEqual({
      language: 'zh',
      auto: false,
    })
  })

  test('Invalid language', () => {
    const localizationDictionary = new LocalizationDictionary({
      'en': { HELLO: 'Hello' },
      'zh': { HELLO: '哈咯' },
    })
    const localizationContext = new LocalizationContext(localizationDictionary, 'en')
    expect(localizationContext.trySetLanguage('??')).toBe(false)
    expect(localizationContext.defaultAuto).toBe(false)
    expect(localizationContext.currentLanguage).toBe('en')
    expect(localizationContext.state.get()).toStrictEqual({
      language: 'en',
      auto: false,
    })
  })

})

describe(LocalizationContext.prototype.localize.name, () => {

  const localizationDictionary = new LocalizationDictionary({
    'en': { HELLO: 'Hello' },
    'zh': { HELLO: '哈咯' },
  })
  const localizationContext = new LocalizationContext(localizationDictionary, 'en')

  test('Valid key', () => {
    expect(localizationContext.localize('HELLO')).toBe('Hello')
  })

  test('Invalid key', () => {
    expect(() => {
      // @ts-expect-error: Done on purpose to test the error.
      localizationContext.localize('?????')
    }).toThrow(new LocalizationKeyNotFoundError('?????', 'en'))
  })

})

describe(LocalizationContext.prototype.tryLocalize.name, () => {

  const localizationDictionary = new LocalizationDictionary({
    'en': { HELLO: 'Hello' },
    'zh': { HELLO: '哈咯' },
  })
  const localizationContext = new LocalizationContext(localizationDictionary, 'en')

  test('Valid key', () => {
    const valueRef = createRef<string>(null)
    expect(localizationContext.tryLocalize('HELLO', valueRef)).toBe(true)
    expect(valueRef.current).toBe('Hello')
  })

  test('Invalid key', () => {
    const valueRef = createRef<string>(null)
    expect(localizationContext.tryLocalize('?????', valueRef)).toBe(false)
    expect(valueRef.current).toBeNull()
  })

})

test(LocalizationContext.prototype.autoSetLanguage.name, () => {

  const localizationDictionary = new LocalizationDictionary({
    'en': { HELLO: 'Hello' },
    'zh': { HELLO: '哈咯' },
  })
  const localizationContext = new LocalizationContext(localizationDictionary, 'en', true)

  expect(localizationContext.autoSetLanguage('zh-Hans')).toBe('zh')
  expect(localizationContext.currentLanguage).toBe('zh')
  expect(localizationContext.state.get()).toStrictEqual({
    language: 'zh',
    auto: true,
  })

  localizationContext.setLanguage('zh')
  expect(localizationContext.currentLanguage).toBe('zh')
  expect(localizationContext.state.get()).toStrictEqual({
    language: 'zh',
    auto: false,
  })

  localizationContext.autoSetLanguage('zh-Hans')
  localizationContext.setLanguage('en')
  expect(localizationContext.state.get()).toStrictEqual({
    language: 'en',
    auto: false,
  })

})
