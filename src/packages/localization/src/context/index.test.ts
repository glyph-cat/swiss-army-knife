import {
  LanguageNotFoundError,
  LocalizationContext,
  LocalizationDictionary,
  LocalizationKeyNotFoundError,
} from '..'

// TODO: May be need to add more languages to have a more accurate test.

const NEW_localizationDictionary = new LocalizationDictionary({
  en: {
    HELLO: 'Hello',
    WORLD: 'World',
    GOOD_MORNING: 'Good morning.',
    SOMETIMES_IM_A_BEAR: 'Sometimes, I\'m a bear, and at other times… I am a be-ar.',
  },
  ja: {
    HELLO: 'ハロ',
    WORLD: '世界',
    GOOD_MORNING: 'おはようございまする。',
    SOMETIMES_IM_A_BEAR: 'ある時はクマ、そしてまたある時は…ク-マ。'
  },
  my: {
    HELLO: 'Hello',
    WORLD: 'Dunia',
    GOOD_MORNING: 'Selamat pagi.',
    SOMETIMES_IM_A_BEAR: 'Kadang-kadang aku ialah beruang, dan kadang-kadang aku ialah ber-uang.',
  },
  zh: {
    HELLO: '哈咯',
    WORLD: '世界',
    GOOD_MORNING: '早安。',
    SOMETIMES_IM_A_BEAR: '有时候我只是熊，然后有时候我…还是熊。',
  },
})

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
    // TODO: check _fallbackLanguageList
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
    // TODO: check _fallbackLanguageList
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
    // TODO: check _fallbackLanguageList
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

  // TODO: check _fallbackLanguageList

})
