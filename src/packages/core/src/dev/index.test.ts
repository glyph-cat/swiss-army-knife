import {
  displayObjectPath,
  displayMixedArray,
  displayOrdinalNumber,
  displayStringArray,
} from '.'

describe(displayObjectPath.name, (): void => {

  test('No items', (): void => {
    const path = [] as const
    const output = displayObjectPath(path)
    expect(output).toBe('``')
  })

  test('Path with items', (): void => {
    const path = ['foo', '42', 'bar', 'baz3', '4bax']
    const output = displayObjectPath(path)
    // eslint-disable-next-line @stylistic/quotes
    expect(output).toBe("`foo['42'].bar.baz3['4bax']`")
  })

})

describe(displayStringArray.name, (): void => {

  test('Empty array', (): void => {
    const output = displayStringArray([])
    expect(output).toBe('[]')
  })

  test('Array with items', (): void => {
    const output = displayStringArray(['foo', 42, true])
    // eslint-disable-next-line @stylistic/quotes
    expect(output).toBe("['foo', '42', 'true']")
  })

})

describe(displayMixedArray.name, (): void => {

  test('Empty array', (): void => {
    const output = displayMixedArray([])
    expect(output).toBe('[]')
  })

  test('Array with items', (): void => {
    const output = displayMixedArray(['foo', 42, true])
    // eslint-disable-next-line @stylistic/quotes
    expect(output).toBe("['foo', 42, true]")
  })

})

describe(displayOrdinalNumber.name, (): void => {

  test('1 to 15', (): void => {
    const outputStack = []
    for (let i = 1; i <= 15; i++) {
      outputStack.push(displayOrdinalNumber(i))
    }
    expect(outputStack).toStrictEqual([
      '1st',
      '2nd',
      '3rd',
      '4th',
      '5th',
      '6th',
      '7th',
      '8th',
      '9th',
      '10th',
      '11th',
      '12th',
      '13th',
      '14th',
      '15th',
    ])
  })

  test('21 to 24', (): void => {
    const outputStack = []
    for (let i = 21; i <= 24; i++) {
      outputStack.push(displayOrdinalNumber(i))
    }
    expect(outputStack).toStrictEqual([
      '21st',
      '22nd',
      '23rd',
      '24th',
    ])
  })

  test('111 to 114', (): void => {
    const outputStack = []
    for (let i = 111; i <= 114; i++) {
      outputStack.push(displayOrdinalNumber(i))
    }
    expect(outputStack).toStrictEqual([
      '111th',
      '112th',
      '113th',
      '114th',
    ])
  })

})
