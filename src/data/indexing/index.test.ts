import {
  MultiKeyRecord,
  ReadonlyMultiKeyRecord,
  ReadonlyTruthRecord,
  TruthRecord,
} from '.'

test(MultiKeyRecord.name, () => {
  const output = MultiKeyRecord({
    a: [1, 3, 5, 7],
    b: [2, 4, 6, 7],
  })
  expect(output).toStrictEqual({
    1: 'a',
    3: 'a',
    5: 'a',
    2: 'b',
    4: 'b',
    6: 'b',
    7: 'b',
  })
})

test(ReadonlyMultiKeyRecord.name, () => {
  const output = ReadonlyMultiKeyRecord({
    a: [1, 3, 5, 7],
    b: [2, 4, 6, 7],
  })
  expect(Object.isFrozen(output)).toBe(true)
  expect(output).toStrictEqual({
    1: 'a',
    3: 'a',
    5: 'a',
    2: 'b',
    4: 'b',
    6: 'b',
    7: 'b',
  })
})

test(TruthRecord.name, () => {
  const output = TruthRecord(['a', 'b', 'c', 'a'])
  expect(output).toStrictEqual({
    c: true,
    a: true,
    b: true,
  })
})

test(ReadonlyTruthRecord.name, () => {
  const output = ReadonlyTruthRecord(['a', 'b', 'c', 'a'])
  expect(Object.isFrozen(output)).toBe(true)
  expect(output).toStrictEqual({
    c: true,
    a: true,
    b: true,
  })
})
