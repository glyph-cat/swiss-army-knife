import {
  compileCSSVariables,
  compileStyle,
  compileStyleObjectToString,
  convertStyleObjectPropertyKeys,
} from '.'

test(convertStyleObjectPropertyKeys.name, () => {
  const output = convertStyleObjectPropertyKeys({
    backgroundColor: '#ffffff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  })
  expect(output).toStrictEqual({
    'background-color': '#ffffff',
    'font-weight': 'bold',
    'text-transform': 'uppercase',
  })
})

test(compileStyleObjectToString.name, () => {
  const output = compileStyleObjectToString({
    backgroundColor: '#ffffff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  })
  expect(output).toBe('background-color:#ffffff;font-weight:bold;text-transform:uppercase')
})

test(compileStyle.name, () => {
  const output = compileStyle('.foo', {
    backgroundColor: '#ffffff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  })
  expect(output).toBe('.foo{background-color:#ffffff;font-weight:bold;text-transform:uppercase}')
})

describe(compileCSSVariables.name, () => {

  test('Without identifier', () => {
    compileCSSVariables({ size: 36, duration: '300ms', color: '#00ff00' })
  })

  test('With identifier', () => {
    compileCSSVariables({ size: 36, duration: '300ms', color: '#00ff00' }, 'foo')
  })

})
