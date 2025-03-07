import { Pick } from '.'

test('Empty object', () => {
  const sourceObject = {}
  // @ts-expect-error: Done on purpose to test the error.
  const output = Pick(sourceObject, ['foo'])
  expect(output).toStrictEqual({})
})

test('Happy path', () => {
  const sourceObject = { foo: 1, bar: 2, baz: 3 }
  const output = Pick(sourceObject, ['foo'])
  expect(output).toStrictEqual({ foo: 1 })
})

test('Multiple unique keys', () => {
  const sourceObject = { foo: 1, bar: 2, baz: 3 }
  const output = Pick(sourceObject, ['foo', 'baz'])
  expect(output).toStrictEqual({ foo: 1, baz: 3 })
})

test('Multiple repeated keys', () => {
  const sourceObject = { foo: 1, bar: 2, baz: 3 }
  const output = Pick(sourceObject, ['foo', 'foo'])
  expect(output).toStrictEqual({ foo: 1 })
})

test('Multiple repeated + non-existent keys', () => {
  const sourceObject = { foo: 1, bar: 2, baz: 3 }
  // @ts-expect-error: Done on purpose to test the error.
  const output = Pick(sourceObject, ['foo', 'qux'])
  expect(output).toStrictEqual({ foo: 1 })
})
