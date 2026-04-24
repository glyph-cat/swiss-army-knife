import { Casing } from '.'

const INPUT_STRING = 'ABPascalCase00FooBarCD camelCaseXY123 snake_case_456 kebab-case-789 Spring summer MACRO_CASE_000 autumn Winter'

describe(Casing.getWords.name, () => {

  test('Happy path', () => {
    const output = Casing.getWords(INPUT_STRING)
    expect(output).toStrictEqual([
      'AB',
      'Pascal',
      'Case',
      '00',
      'Foo',
      'Bar',
      'CD',
      'camel',
      'Case',
      'XY',
      '123',
      'snake',
      'case',
      '456',
      'kebab',
      'case',
      '789',
      'Spring',
      'summer',
      'MACRO',
      'CASE',
      '000',
      'autumn',
      'Winter',
    ])
  })

  test('Empty string', () => {
    const output = Casing.getWords('')
    expect(output).toStrictEqual([])
  })

})

describe(Casing.capitalizeFirstLetter.name, () => {

  test('Happy path', () => {
    const output = Casing.capitalizeFirstLetter('fooBar')
    expect(output).toBe('FooBar')
  })

  test('forceLowerCaseOnOtherLetters = true', () => {
    const output = Casing.capitalizeFirstLetter('fooBar', true)
    expect(output).toBe('Foobar')
  })

  test('Empty string', () => {
    const output = Casing.capitalizeFirstLetter('')
    expect(output).toBe('')
  })

})

describe(Casing.prototype.toPascalCase.name, () => {

  test('Happy path', () => {
    const output = new Casing(INPUT_STRING).toPascalCase()
    expect(output).toBe('ABPascalCase00FooBarCDCamelCaseXY123SnakeCase456KebabCase789SpringSummerMacroCase000AutumnWinter')
  })

  test('Input string is macro case but without underscore', () => {
    const output = new Casing('HELLO').toPascalCase()
    expect(output).toBe('Hello')
  })

  test('Empty string', () => {
    const output = new Casing('').toPascalCase()
    expect(output).toBe('')
  })

})

describe(Casing.prototype.toCamelCase.name, () => {

  test('Happy path', () => {
    const output = new Casing(INPUT_STRING).toCamelCase()
    expect(output).toBe('aBPascalCase00FooBarCDCamelCaseXY123SnakeCase456KebabCase789SpringSummerMacroCase000AutumnWinter')
  })

  test('Empty string', () => {
    const output = new Casing('').toCamelCase()
    expect(output).toBe('')
  })

})

describe(Casing.prototype.toMacroCase.name, () => {

  test('Happy path', () => {
    const output = new Casing(INPUT_STRING).toMacroCase()
    expect(output).toBe('AB_PASCAL_CASE_00_FOO_BAR_CD_CAMEL_CASE_XY_123_SNAKE_CASE_456_KEBAB_CASE_789_SPRING_SUMMER_MACRO_CASE_000_AUTUMN_WINTER')
  })

  test('Empty string', () => {
    const output = new Casing('').toMacroCase()
    expect(output).toBe('')
  })

})

describe(Casing.prototype.toSnakeCase.name, () => {

  test('Happy path', () => {
    const output = new Casing(INPUT_STRING).toSnakeCase()
    expect(output).toBe('ab_pascal_case_00_foo_bar_cd_camel_case_xy_123_snake_case_456_kebab_case_789_spring_summer_macro_case_000_autumn_winter')
  })

  test('Empty string', () => {
    const output = new Casing('').toSnakeCase()
    expect(output).toBe('')
  })

})

describe(Casing.prototype.toKebabCase.name, () => {

  test('Happy path', () => {
    const output = new Casing(INPUT_STRING).toKebabCase()
    expect(output).toBe('ab-pascal-case-00-foo-bar-cd-camel-case-xy-123-snake-case-456-kebab-case-789-spring-summer-macro-case-000-autumn-winter')
  })

  test('Empty string', () => {
    const output = new Casing('').toKebabCase()
    expect(output).toBe('')
  })

})

describe(Casing.prototype.toTitleCase.name, () => {

  test('Happy path', () => {
    const output = new Casing(INPUT_STRING).toTitleCase()
    expect(output).toBe('AB Pascal Case 00 Foo Bar CD Camel Case XY 123 Snake Case 456 Kebab Case 789 Spring Summer MACRO CASE 000 Autumn Winter')
  })

  test('Empty string', () => {
    const output = new Casing('').toTitleCase()
    expect(output).toBe('')
  })

})

describe(Casing.prototype.toSpongeCase.name, () => {

  test('Happy path', () => {
    const output = new Casing(INPUT_STRING).toSpongeCase()
    expect(output).toBe('aB PaScAl cAsE 00 fOo bAr cD CaMeL CaSe xY 123 SnAkE CaSe 456 kEbAb cAsE 789 SpRiNg sUmMeR MaCrO CaSe 000 aUtUmN WiNtEr')
  })

  test('useOriginalString = true', () => {
    const output = new Casing(INPUT_STRING).toSpongeCase({ useOriginalString: true })
    expect(output).toBe('aBpAsCaLcAsE00fOoBaRcD CaMeLcAsExY123 sNaKe_cAsE_456 KeBaB-CaSe-789 sPrInG SuMmEr mAcRo_cAsE_000 AuTuMn wInTeR')
  })

  test('startWithUpperCase = true', () => {
    const output = new Casing(INPUT_STRING).toSpongeCase({ startWithUpperCase: true })
    expect(output).toBe('Ab pAsCaL CaSe 00 FoO BaR Cd cAmEl cAsE Xy 123 sNaKe cAsE 456 KeBaB CaSe 789 sPrInG SuMmEr mAcRo cAsE 000 AuTuMn wInTeR')
  })

  test('Empty string', () => {
    const output = new Casing('').toSpongeCase()
    expect(output).toBe('')
  })

})
