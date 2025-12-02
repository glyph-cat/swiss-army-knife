import { PartialStringRecord } from '@glyph-cat/foundation'
import { Language } from '@glyph-cat/localization'
import { objectIsNotEmpty } from '@glyph-cat/swiss-army-knife'
import { GlobalDictionary } from '.'

const defaultLanguage: Language<typeof GlobalDictionary.data> = 'en'
const defaultDictionaryData = GlobalDictionary.data[defaultLanguage]
const allDefaultLanguageLocalizationKeys = Object.keys(defaultDictionaryData).sort()
const allOtherLanguages = Object.keys(GlobalDictionary.data).filter((language) => language !== GlobalDictionary[defaultLanguage])

test('Localization keys are tally', () => {
  for (const language of allOtherLanguages) {
    const currentLanguageLocalizationKeys = Object.keys(GlobalDictionary.data[language]).sort()
    expect(allDefaultLanguageLocalizationKeys).toStrictEqual(currentLanguageLocalizationKeys)
  }
})

// eslint-disable-next-line jest/expect-expect
test('Localized values types are tally', () => {

  // NOTE: key = localization key, value = array of languages.
  const incorrectTypes = allDefaultLanguageLocalizationKeys.reduce((keysAcc, localizationKey) => {
    const typeofDefaultValue = typeof defaultDictionaryData[localizationKey]
    const languagesWithIncorrectTypes = allOtherLanguages.reduce((languageAcc, language) => {
      const typeofComparedValue = typeof GlobalDictionary.data[language][localizationKey]
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

  if (objectIsNotEmpty(incorrectTypes)) {
    throw new Error('Found localized values with mismatched types between languages:\n' + JSON.stringify(incorrectTypes, null, 2))
  }

})
