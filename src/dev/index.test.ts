import {
  // devPrintOnce,
  displayObjectPath,
  displayMixedArray,
  displayOrdinalNumber,
  displayStringArray,
} from '.'

// describe(devPrintOnce.name, () => {

//   it('devPrintOnce', () => {
//     const spyInfo = jest.spyOn(console, 'info')
//     const spyWarn = jest.spyOn(console, 'warn')
//     devPrintOnce('info', 'a', 'lorem ipsum')
//     devPrintOnce('info', 'b', 'lorem ipsum')
//     devPrintOnce('info', 'a', 'lorem ipsum')
//     devPrintOnce('warn', 'a', 'lorem ipsum')
//     expect(spyInfo).toHaveBeenCalledTimes(2)
//     expect(spyWarn).toHaveBeenCalledTimes(1)
//   })
// })

describe(displayObjectPath.name, () => {

  it('No items', () => {
    const path = []
    const output = displayObjectPath(path)
    expect(output).toBe('``')
  })

  it('Path with items', () => {
    const path = ['foo', '42', 'bar', 'baz3', '4bax']
    const output = displayObjectPath(path)
    // eslint-disable-next-line quotes
    expect(output).toBe("`foo['42'].bar.baz3['4bax']`")
  })

})

describe(displayStringArray.name, () => {

  it('Empty array', () => {
    const output = displayStringArray([])
    expect(output).toBe('[]')
  })

  it('Array with items', () => {
    const output = displayStringArray(['foo', 42, true])
    // eslint-disable-next-line quotes
    expect(output).toBe("['foo', '42', 'true']")
  })

})

describe(displayMixedArray.name, () => {

  it('Empty array', () => {
    const output = displayMixedArray([])
    expect(output).toBe('[]')
  })

  it('Array with items', () => {
    const output = displayMixedArray(['foo', 42, true])
    // eslint-disable-next-line quotes
    expect(output).toBe("['foo', 42, true]")
  })

})

describe(displayOrdinalNumber.name, () => {

  it('1 to 15', () => {
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

  it('21 to 24', () => {
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

  it('111 to 114', () => {
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

