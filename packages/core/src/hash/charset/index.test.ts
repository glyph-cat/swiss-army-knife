import { createCustomCharset } from '.'

test(createCustomCharset.name, () => {
  const output = createCustomCharset('123abc', '1234')
  expect(output).toBe('123abc4')
})
