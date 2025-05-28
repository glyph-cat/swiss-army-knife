import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { LocalizedDictionary, LocalizationDictionary } from '@glyph-cat/localization'
import { HookTester } from '@glyph-cat/react-test-utils'
import { useLocalizationContext } from '.'

const cleanupManager = new CleanupManager()
afterEach(() => { cleanupManager.run() })

const localizationDictionary = new LocalizationDictionary({
  'en': { HELLO: 'Hello' },
  'zh': { HELLO: '哈咯' },
})

test(useLocalizationContext.name, async () => {

  const localizationContext = new LocalizedDictionary(localizationDictionary, 'en')
  cleanupManager.append(localizationContext.dispose)

  const tester = new HookTester({
    useHook: () => {
      return useLocalizationContext(localizationContext)
    },
    actions: {
      setLanguageToZh: ({ setLanguage }) => {
        setLanguage('zh')
      },
    },
    values: {
      value: (hookData) => {
        return hookData
      },
      localizedValue: ({ localize }) => {
        return localize('HELLO')
      },
    },
  }, cleanupManager)

  expect(Object.is(tester.get('value'), localizationContext)).toBe(true)
  expect(tester.get('localizedValue')).toBe('Hello')
  expect(tester.renderCount).toBe(1)

  expect(tester.action('setLanguageToZh')).toBe(1)
  expect(tester.get('localizedValue')).toBe('哈咯')

})
