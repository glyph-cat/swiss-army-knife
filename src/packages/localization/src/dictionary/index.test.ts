import { createRef } from '@glyph-cat/swiss-army-knife'
import {
  LanguageNotFoundError,
  LocalizationDictionary,
  LocalizationKeyNotFoundError,
} from '..'

const SOURCE_DICTIONARY = {
  'en': { HELLO: 'Hello' },
  'zh': { HELLO: '哈咯' },
}

const localizationDictionary = new LocalizationDictionary(SOURCE_DICTIONARY)

test('Initialization', () => {
  expect(Object.is(localizationDictionary.data, SOURCE_DICTIONARY)).toBe(true)
  expect(localizationDictionary.data).toStrictEqual(SOURCE_DICTIONARY)
  expect([...localizationDictionary.languages]).toStrictEqual(['en', 'zh'])
})

test(LocalizationDictionary.prototype.localize.name, () => {
  expect(localizationDictionary.localize('en', 'HELLO')).toBe('Hello')
  expect(localizationDictionary.localize('zh', 'HELLO')).toBe('哈咯')
  expect(() => {
    // @ts-expect-error: Done on purpose to test the error.
    localizationDictionary.localize('??', 'HELLO')
  }).toThrow(new LanguageNotFoundError('??'))
  expect(() => {
    // @ts-expect-error: Done on purpose to test the error.
    localizationDictionary.localize('en', 'HEY')
  }).toThrow(new LocalizationKeyNotFoundError('HEY', 'en'))
})

describe(LocalizationDictionary.prototype.tryLocalize.name, () => {

  test('Language = en', () => {
    const valueRef = createRef<string>(null)
    expect(localizationDictionary.tryLocalize('en', 'HELLO', valueRef)).toBe(true)
    expect(valueRef.current).toBe('Hello')
  })

  test('Language = zh', () => {
    const valueRef = createRef<string>(null)
    expect(localizationDictionary.tryLocalize('zh', 'HELLO', valueRef)).toBe(true)
    expect(valueRef.current).toBe('哈咯')
  })

  test('Unknown language', () => {
    const valueRef = createRef<string>(null)
    expect(localizationDictionary.tryLocalize('??', 'HELLO', valueRef)).toBe(false)
    expect(valueRef.current).toBe(null)
  })

  test('Unknown localized key', () => {
    const valueRef = createRef<string>(null)
    expect(localizationDictionary.tryLocalize('en', 'HEY', valueRef)).toBe(false)
    expect(valueRef.current).toBe(null)
  })

})

test(`${LocalizationDictionary.prototype.resolveLanguage.name} (instance)`, () => {
  expect(localizationDictionary.resolveLanguage('en')).toBe('en')
  expect(localizationDictionary.resolveLanguage('en-US')).toBe('en')
  expect(localizationDictionary.resolveLanguage('zh')).toBe('zh')
  expect(localizationDictionary.resolveLanguage('zh-Hans')).toBe('zh')
})

test(`${LocalizationDictionary.resolveLanguage.name} (static)`, () => {

  // NOTE: Resolution should always be based on first available value,
  // depending on how dictionary was structured.

  expect(LocalizationDictionary.resolveLanguage(['en'], new Set([
    'en',
    'en_US',
    'en-US',
    'zh',
    '??_US',
    '??',
  ]))).toBe('en')

  expect(LocalizationDictionary.resolveLanguage(['en'], new Set([
    'en_US',
    'en',
    'en-US',
    'zh',
    '??_US',
    '??',
  ]))).toBe('en') // because of exact match

  expect(LocalizationDictionary.resolveLanguage(['en'], new Set([
    'en_US',
    // 'en' is omitted on purpose
    'en-US',
    'zh',
    '??_US',
    '??',
  ]))).toBe('en_US')

  expect(LocalizationDictionary.resolveLanguage(['en_US'], new Set([
    '??_US',
    'en',
    'en_US',
    'en-US',
    'zh',
    '??',
  ]))).toBe('en_US') // KIV
  // We originally expected '??_US', but it is returning 'en_US',
  // which is even better... but how/why?

  expect(LocalizationDictionary.resolveLanguage(['zh'], new Set([
    'zh',
    'zh_Hans',
    'zh-Hant',
    'en',
    '??_US',
    '??',
  ]))).toBe('zh')

  expect(LocalizationDictionary.resolveLanguage(['zh'], new Set([
    'zh_Hans',
    'zh',
    'zh-Hant',
    'en',
    '??_US',
    '??',
  ]))).toBe('zh') // because of exact match

  expect(LocalizationDictionary.resolveLanguage(['zh_Hant'], new Set([
    'zh_Hans',
    'zh',
    // 'zh-Hant' is omitted on purpose
    'en',
    '??_US',
    '??',
  ]))).toBe('zh_Hans')

  expect(LocalizationDictionary.resolveLanguage(['??'], new Set(['en', 'zh']))).toBe('en')
  expect(LocalizationDictionary.resolveLanguage(['??'], new Set(['zh', 'en']))).toBe('zh')

  expect(LocalizationDictionary.resolveLanguage(['aa', 'bb', 'cc', 'zh', 'en'], new Set([
    'en',
    'en_US',
    'en-US',
    'zh',
    '??_US',
    '??',
  ]))).toBe('zh')

})
