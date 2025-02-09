import {
  compileStyleObjectToString,
  compileStyles,
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

test(compileStyles.name, () => {

  const output = compileStyles(new Map([
    ['.foo', {
      backgroundColor: '#ffffff',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    }],
    ['.bar', {
      animationDuration: '0.3s',
      color: '#ff0000',
    }],
  ]))
  expect(output).toBe('.foo{background-color:#ffffff;font-weight:bold;text-transform:uppercase}.bar{animation-duration:0.3s;color:#ff0000}')

})
