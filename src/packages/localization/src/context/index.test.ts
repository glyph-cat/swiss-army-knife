import { JSONclone } from '@glyph-cat/swiss-army-knife'
import {
  LanguageNotFoundError,
  LocalizedDictionary,
  LocalizationDictionary,
  LocalizationKeyNotFoundError,
} from '..'
import SAMPLE_DICTIONARY_DATA from '../../test-data/dictionary.json'

function createLocalizationDictionary() {
  return new LocalizationDictionary(JSONclone(SAMPLE_DICTIONARY_DATA))
}

let localizationContext: LocalizedDictionary<typeof SAMPLE_DICTIONARY_DATA> = null
afterEach(() => {
  localizationContext.dispose()
  localizationContext = null
})

test('Initialization', () => {
  const sourceDictionary = createLocalizationDictionary()
  localizationContext = new LocalizedDictionary(sourceDictionary, 'en')
  expect(Object.is(localizationContext.dictionary, sourceDictionary)).toBe(true)
  expect(localizationContext.language).toBe('en')
  expect(localizationContext.currentLanguage).toBe('en')
  expect(localizationContext.languageState.get()).toStrictEqual({
    language: 'en',
    auto: false,
  })
})

describe(LocalizedDictionary.prototype.setLanguage.name, () => {

  test('Valid language', () => {
    const sourceDictionary = createLocalizationDictionary()
    localizationContext = new LocalizedDictionary(sourceDictionary, 'en')
    expect(localizationContext.M$fallbackLanguageList).toStrictEqual([
      // 'en' <-- this is the current language
      'ja',
      'my',
      'zh',
    ])
    localizationContext.setLanguage('zh')
    expect(localizationContext.currentLanguage).toBe('zh')
    expect(localizationContext.languageState.get()).toStrictEqual({
      language: 'zh',
      auto: false,
    })
    expect(localizationContext.M$fallbackLanguageList).toStrictEqual([
      // 'zh', <-- this is the current language
      'en',
      'ja',
      'my',
    ])
  })

  test('Invalid language', () => {
    const sourceDictionary = createLocalizationDictionary()
    localizationContext = new LocalizedDictionary(sourceDictionary, 'en')
    expect(() => {
      // @ts-expect-error: Done on purpose to test the error.
      localizationContext.setLanguage('??')
    }).toThrow(new LanguageNotFoundError('??'))
  })

})

describe(LocalizedDictionary.prototype.trySetLanguage.name, () => {

  test('Valid language', () => {
    const sourceDictionary = createLocalizationDictionary()
    localizationContext = new LocalizedDictionary(sourceDictionary, 'en')
    expect(localizationContext.trySetLanguage('zh')).toBe(true)
    expect(localizationContext.currentLanguage).toBe('zh')
    expect(localizationContext.languageState.get()).toStrictEqual({
      language: 'zh',
      auto: false,
    })
    expect(localizationContext.M$fallbackLanguageList).toStrictEqual([
      // 'zh', <-- this is the current language
      'en',
      'ja',
      'my',
    ])
  })

  test('Invalid language', () => {
    const sourceDictionary = createLocalizationDictionary()
    localizationContext = new LocalizedDictionary(sourceDictionary, 'en')
    expect(localizationContext.trySetLanguage('??')).toBe(false)
    expect(localizationContext.currentLanguage).toBe('en')
    expect(localizationContext.languageState.get()).toStrictEqual({
      language: 'en',
      auto: false,
    })
    expect(localizationContext.M$fallbackLanguageList).toStrictEqual([
      // 'en', <-- this is the current language
      'ja',
      'my',
      'zh',
    ])
  })

})

describe(LocalizedDictionary.prototype.localize.name, () => {

  test('Valid key', () => {
    const sourceDictionary = createLocalizationDictionary()
    localizationContext = new LocalizedDictionary(sourceDictionary, 'en')
    expect(localizationContext.localize('HELLO')).toBe('Hello')
  })

  describe('Invalid key', () => {

    describe('Key exists in other languages', () => {
      const sourceDictionary = createLocalizationDictionary()
      localizationContext = new LocalizedDictionary(sourceDictionary, 'en')
      expect(localizationContext.localize('SOMETIMES_IM_A_BEAR')).toBe(
        'ある時はクマ、そしてまたある時は…ク-マ。'
      )
    })

    describe('Key does not exist at all', () => {
      const sourceDictionary = createLocalizationDictionary()
      localizationContext = new LocalizedDictionary(sourceDictionary, 'en')
      expect(() => {
        // @ts-expect-error: Done on purpose to test the error.
        localizationContext.localize('?????')
      }).toThrow(new LocalizationKeyNotFoundError('?????'))
    })

  })

})

// test(LocalizationContext.prototype.autoSetLanguage.name, () => {

//   const sourceDictionary = createLocalizationDictionary()
//   localizationContext = new LocalizationContext(sourceDictionary, 'en', [/* todo */])

//   expect(localizationContext.autoSetLanguage('zh-Hans')).toBe('zh')
//   expect(localizationContext.currentLanguage).toBe('zh')
//   expect(localizationContext.languageState.get()).toStrictEqual({
//     language: 'zh',
//     auto: true,
//   })
//   expect(localizationContext.M$fallbackLanguageList).toStrictEqual([
//     // 'zh', <-- this is the current language
//     'en',
//     'ja',
//     'my',
//   ])

//   localizationContext.setLanguage('zh')
//   expect(localizationContext.currentLanguage).toBe('zh')
//   expect(localizationContext.languageState.get()).toStrictEqual({
//     language: 'zh',
//     auto: false,
//   })
//   expect(localizationContext.M$fallbackLanguageList).toStrictEqual([
//     // 'zh', <-- this is the current language
//     'en',
//     'ja',
//     'my',
//   ])

//   localizationContext.autoSetLanguage('zh-Hans')
//   // ^ so that we can test `setLanguage` again
//   localizationContext.setLanguage('en')
//   expect(localizationContext.languageState.get()).toStrictEqual({
//     language: 'en',
//     auto: false,
//   })
//   expect(localizationContext.M$fallbackLanguageList).toStrictEqual([
//     // 'en', <-- this is the current language
//     'ja',
//     'my',
//     'zh',
//   ])

// })
