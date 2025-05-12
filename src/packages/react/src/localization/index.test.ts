import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { HookTester } from '@glyph-cat/react-test-utils'
import { LocalizationContext, LocalizationDictionary } from '@glyph-cat/swiss-army-knife'
import { useLocalization } from '.'

const cleanupManager = new CleanupManager()
afterEach(() => { cleanupManager.run() })

const localizationDictionary = new LocalizationDictionary({
  'en': { HELLO: 'Hello' },
  'zh': { HELLO: '哈咯' },
})

test(useLocalization.name, async () => {

  const localizationContext = new LocalizationContext(localizationDictionary, 'en', false)
  cleanupManager.append(localizationContext.dispose)

  const tester = new HookTester({
    useHook: () => {
      return useLocalization(localizationContext)
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
