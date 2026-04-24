import { renderToString } from '.'

test(renderToString.name, () => {
  const output = renderToString(<h1>{'Hello, world!'}</h1>)
  expect(output).toBe('<h1>Hello, world!</h1>')
})
