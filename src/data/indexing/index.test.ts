import {
  MultiKeyRecord,
  ReadonlyMultiKeyRecord,
  ReadonlyTruthMap,
  TruthMap,
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
  expect(output).toStrictEqual({
    1: 'a',
    3: 'a',
    5: 'a',
    2: 'b',
    4: 'b',
    6: 'b',
    7: 'b',
  })
  // @ts-expect-error: Done on purpose for testing.
  output[7] = 'x'
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

test(TruthMap.name, () => {
  const output = TruthMap(['a', 'b', 'c', 'a'])
  expect(output).toStrictEqual({
    c: true,
    a: true,
    b: true,
  })
})

test(ReadonlyTruthMap.name, () => {
  const output = ReadonlyTruthMap(['a', 'b', 'c', 'a'])
  expect(output).toStrictEqual({
    c: true,
    a: true,
    b: true,
  })
  // @ts-expect-error: Done on purpose for testing.
  output.b = 42
  expect(output).toStrictEqual({
    c: true,
    a: true,
    b: true,
  })
})
