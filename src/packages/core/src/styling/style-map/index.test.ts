import { StyleMap } from '.'

test(StyleMap.prototype.compile.name, () => {
  const output = new StyleMap([
    ['.foo', {
      backgroundColor: '#ffffff',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    }],
    ['.bar', {
      animationDuration: '0.3s',
      color: '#ff0000',
    }],
  ]).compile()
  expect(output).toBe('.foo{background-color:#ffffff;font-weight:bold;text-transform:uppercase}.bar{animation-duration:0.3s;color:#ff0000}')
})
