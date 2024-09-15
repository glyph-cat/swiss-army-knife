import { TimestampId } from '.'

test(TimestampId.name, () => {
  expect(TimestampId()).toMatch(/^\d{8}T\d{9}Z$/)
})
