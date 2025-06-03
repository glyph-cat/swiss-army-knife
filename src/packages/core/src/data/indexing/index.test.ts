import { ReadonlyTruthRecord, TruthRecord } from '.'

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
