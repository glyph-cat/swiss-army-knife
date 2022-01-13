import { enumerate } from '.'

test(enumerate.name, (): void => {

  const enumaration = enumerate({ a: 1, b: 2 })

  // Check structure of enumeration
  expect(enumaration).toStrictEqual({ a: 1, b: 2, 1: 'a', 2: 'b' })

  // Attempt to modify existing value
  // @ts-expect-error Assigned `-1` on purpose to see how it goes in JS.
  enumaration.a = -1
  // Check if structure of enumeration is still in tact
  expect(enumaration).toStrictEqual({ a: 1, b: 2, 1: 'a', 2: 'b' })

  // Attempt to add new value
  // Check if structure of original enumeration is still in tact
  enumaration['c'] = 3
  expect(enumaration).toStrictEqual({ a: 1, b: 2, 1: 'a', 2: 'b' })

})
