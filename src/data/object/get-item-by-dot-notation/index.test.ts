import { EMPTY_OBJECT } from '../../dummies'
import { getItemByDotNotation } from '.'

describe(getItemByDotNotation.name, (): void => {

  test('Normal scenario', (): void => {
    const obj = { category: { group: { item: 'foobar' } } }
    const output = getItemByDotNotation(obj, 'category.group.item')
    expect(output).toBe('foobar')
  })

  test('Value is undefined', (): void => {
    const obj = { category: { group: { item: undefined } } }
    const output = getItemByDotNotation(obj, 'category.group.item')
    expect(output).toBe(undefined)
  })

  test('Property does not exist', (): void => {
    const obj = { category: { group: {} } }
    const output = getItemByDotNotation(obj, 'category.group.item')
    expect(Object.is(output, EMPTY_OBJECT)).toBe(true)
  })

})
