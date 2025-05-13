import { LocalizationContext, LocalizationDictionary } from '..'

test('...', () => {

  const localizationDictionary = new LocalizationDictionary({
    'en': { HELLO: 'Hello' },
    'zh': { HELLO: '哈咯' },
  })

  const localizationContext = new LocalizationContext(localizationDictionary, 'en')

  expect(localizationContext.state.get()).toStrictEqual({
    language: 'en',
    auto: false,
  })

})

// todo: test with manual and auto language resolution scenarios

test('...', () => {
  // ...
})
