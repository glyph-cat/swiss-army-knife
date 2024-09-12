import { UUIDFactory } from '.'

test(`static ${UUIDFactory.create.name}`, () => {
  expect(UUIDFactory.create()).toMatch(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/)
})

test(UUIDFactory.prototype.create.name, () => {
  expect(new UUIDFactory().create()).toMatch(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/)
})
