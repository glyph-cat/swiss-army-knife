import { isNotEmptyObject, PartialStringRecord } from '@glyph-cat/swiss-army-knife'
import { GlobalLocalizationContext } from '.'

const defaultDictionaryData = GlobalLocalizationContext.dictionary.data[GlobalLocalizationContext.defaultLanguage]
const allDefaultLanguageLocalizationKeys = Object.keys(defaultDictionaryData).sort()
const allOtherLanguages = Object.keys(GlobalLocalizationContext.dictionary.data).filter((language) => language !== GlobalLocalizationContext.defaultLanguage)

test('Localization keys are tally', () => {
  for (const language of allOtherLanguages) {
    const currentLanguageLocalizationKeys = Object.keys(GlobalLocalizationContext.dictionary.data[language]).sort()
    expect(allDefaultLanguageLocalizationKeys).toStrictEqual(currentLanguageLocalizationKeys)
  }
})

test('Localized values types are tally', () => {

  // NOTE: key = localization key, value = array of languages.
  const incorrectTypes = allDefaultLanguageLocalizationKeys.reduce((keysAcc, localizationKey) => {
    const typeofDefaultValue = typeof defaultDictionaryData[localizationKey]
    const languagesWithIncorrectTypes = allOtherLanguages.reduce((languageAcc, language) => {
      const typeofComparedValue = typeof GlobalLocalizationContext.dictionary.data[language][localizationKey]
      if (typeofDefaultValue !== typeofComparedValue) {
        languageAcc.push(language)
      }
      return languageAcc
    }, [] as Array<string>)
    if (languagesWithIncorrectTypes.length > 0) {
      keysAcc[localizationKey] = [typeofDefaultValue, languagesWithIncorrectTypes]
    }
    return keysAcc
  }, {} as PartialStringRecord<[expectedType: string, languagesWithIncorrectTypes: Array<string>]>)

  if (isNotEmptyObject(incorrectTypes)) {
    fail('Found localized values with mismatched types between languages:\n' + JSON.stringify(incorrectTypes, null, 2))
  }

})
