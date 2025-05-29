import { JSONclone } from '@glyph-cat/swiss-army-knife'
import {
  LocalizedDictionary,
  LocalizationDictionary,
  LocalizationKeyNotFoundError,
} from '..'
import SAMPLE_DICTIONARY_DATA from '../../test-data/dictionary.json'

function createLocalizationDictionary() {
  return new LocalizationDictionary(JSONclone(SAMPLE_DICTIONARY_DATA))
}

test('Initialization', () => {
  const sourceDictionary = createLocalizationDictionary()
  const localizedDictionary = new LocalizedDictionary(sourceDictionary, 'en')
  expect(Object.is(localizedDictionary.dictionary, sourceDictionary)).toBe(true)
  expect(localizedDictionary.language).toBe('en')
  expect(localizedDictionary.M$fallbackLanguageList).toStrictEqual([
    // 'en' <-- this is the current language
    'ja',
    'my',
    'zh',
  ])
  const altLocalizedDictionary = new LocalizedDictionary(sourceDictionary, 'zh')
  expect(altLocalizedDictionary.M$fallbackLanguageList).toStrictEqual([
    'en',
    'ja',
    'my',
    // 'zh', <-- this is the current language
  ])
})

// describe(LocalizedDictionary.prototype.setLanguage.name, () => {

//   test('Valid language', () => {
//     const sourceDictionary = createLocalizationDictionary()
//     const localizedDictionary = new LocalizedDictionary(sourceDictionary, 'en')
//     expect(localizedDictionary.M$fallbackLanguageList).toStrictEqual([
//       // 'en' <-- this is the current language
//       'ja',
//       'my',
//       'zh',
//     ])
//     localizedDictionary.setLanguage('zh')
//     expect(localizedDictionary.currentLanguage).toBe('zh')
//     expect(localizedDictionary.languageState.get()).toStrictEqual({
//       language: 'zh',
//       auto: false,
//     })
//     expect(localizedDictionary.M$fallbackLanguageList).toStrictEqual([
//       // 'zh', <-- this is the current language
//       'en',
//       'ja',
//       'my',
//     ])
//   })

//   test('Invalid language', () => {
//     const sourceDictionary = createLocalizationDictionary()
//     localizedDictionary = new LocalizedDictionary(sourceDictionary, 'en')
//     expect(() => {
//       // @ts-expect-error: Done on purpose to test the error.
//       localizedDictionary.setLanguage('??')
//     }).toThrow(new LanguageNotFoundError('??'))
//   })

// })

// describe(LocalizedDictionary.prototype.trySetLanguage.name, () => {

//   test('Valid language', () => {
//     const sourceDictionary = createLocalizationDictionary()
//     localizedDictionary = new LocalizedDictionary(sourceDictionary, 'en')
//     expect(localizedDictionary.trySetLanguage('zh')).toBe(true)
//     expect(localizedDictionary.currentLanguage).toBe('zh')
//     expect(localizedDictionary.languageState.get()).toStrictEqual({
//       language: 'zh',
//       auto: false,
//     })
//     expect(localizedDictionary.M$fallbackLanguageList).toStrictEqual([
//       // 'zh', <-- this is the current language
//       'en',
//       'ja',
//       'my',
//     ])
//   })

//   test('Invalid language', () => {
//     const sourceDictionary = createLocalizationDictionary()
//     localizedDictionary = new LocalizedDictionary(sourceDictionary, 'en')
//     expect(localizedDictionary.trySetLanguage('??')).toBe(false)
//     expect(localizedDictionary.currentLanguage).toBe('en')
//     expect(localizedDictionary.languageState.get()).toStrictEqual({
//       language: 'en',
//       auto: false,
//     })
//     expect(localizedDictionary.M$fallbackLanguageList).toStrictEqual([
//       // 'en', <-- this is the current language
//       'ja',
//       'my',
//       'zh',
//     ])
//   })

// })

describe(LocalizedDictionary.prototype.localize.name, () => {

  test('Valid key', () => {
    const sourceDictionary = createLocalizationDictionary()
    const localizedDictionary = new LocalizedDictionary(sourceDictionary, 'en')
    expect(localizedDictionary.localize('HELLO')).toBe('Hello')
  })

  describe('Invalid key', () => {

    describe('Key exists in other languages', () => {
      const sourceDictionary = createLocalizationDictionary()
      const localizedDictionary = new LocalizedDictionary(sourceDictionary, 'en')
      expect(localizedDictionary.localize('SOMETIMES_IM_A_BEAR')).toBe(
        'ある時はクマ、そしてまたある時は…ク-マ。'
      )
    })

    describe('Key does not exist at all', () => {
      const sourceDictionary = createLocalizationDictionary()
      const localizedDictionary = new LocalizedDictionary(sourceDictionary, 'en')
      expect(() => {
        // @ts-expect-error: Done on purpose to test the error.
        localizedDictionary.localize('?????')
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
