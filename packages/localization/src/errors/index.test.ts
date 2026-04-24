import { LanguageNotFoundError, LocalizationKeyNotFoundError } from '.'

test(LanguageNotFoundError.name, () => {
  expect(new LanguageNotFoundError('en').message).toBe(
    'Language "en" could not be found in the dictionary'
  )
})

describe(LocalizationKeyNotFoundError.name, () => {

  test('Parameter `language` is not provided', () => {
    expect(new LocalizationKeyNotFoundError('XYZ', 'en').message).toBe(
      'Localization key "XYZ" could not be found in the dictionary for language "en"'
    )
  })

  test('Parameter `language` is provided', () => {
    expect(new LocalizationKeyNotFoundError('XYZ').message).toBe(
      'Localization key "XYZ" could not be found in the dictionary'
    )
  })

})
