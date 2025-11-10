import { getFlattenedObject } from './index'

test(getFlattenedObject.name, (): void => {
  const output = getFlattenedObject({
    building: {
      level_1: {
        room_a: {
          size: 'large',
        },
      },
      level_2: {
        room_b: {
          size: 'small',
        },
      },
    },
  })
  const answer = {
    'building.level_1.room_a.size': 'large',
    'building.level_2.room_b.size': 'small',
  }
  expect(output).toStrictEqual(answer)
})
