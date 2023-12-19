import { UUIDFactory } from '.'

describe(UUIDFactory.name, () => {

  test('Clean state and hydration', () => {
    const uuidFactory = new UUIDFactory()
    expect(uuidFactory.dump()).toStrictEqual([])
    const dummyUUID = '00000000-0000-0000-0000-000000000000'
    uuidFactory.hydrate([dummyUUID])
    expect(uuidFactory.dump()).toStrictEqual([dummyUUID])
  })

  test('Generate, revoke, and reset', () => {

    // Generate
    const uuidFactory = new UUIDFactory()
    const uuid1 = uuidFactory.generate()
    const uuid2 = uuidFactory.generate()
    const uuid3 = uuidFactory.generate()
    expect(uuid1).toMatch(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/g)
    expect(uuid2).toMatch(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/g)
    expect(uuid3).toMatch(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/g)
    expect(uuidFactory.dump()).toStrictEqual([uuid1, uuid2, uuid3])

    // Revoke
    uuidFactory.revoke(uuid2)
    expect(uuidFactory.dump()).toStrictEqual([uuid1, uuid3])

    // Reset
    uuidFactory.reset()
    expect(uuidFactory.dump()).toStrictEqual([])

  })

})
