import { objectSort } from '.'

test(objectSort.name, (): void => {

  interface DummyUserSchema {
    name: string
    age: number
  }

  const userCollection: Record<string, DummyUserSchema> = {
    '11111111': {
      name: 'John',
      age: 28,
    },
    '22222222': {
      name: 'Alice',
      age: 24,
    },
    '33333333': {
      name: 'Belle',
      age: 28,
    },
    '44444444': {
      name: 'David',
      age: 24,
    },
  }

  const sortedUserCollection = objectSort(userCollection, (a, b) => {
    if (a.value.age !== b.value.age) {
      return a.value.age < b.value.age ? -1 : 1
    } else if (a.value.name !== b.value.name) {
      return a.value.name < b.value.name ? -1 : 1
    } else {
      return a.key < b.key ? -1 : 1
    }
  })

  expect(sortedUserCollection).toStrictEqual({
    '22222222': {
      name: 'Alice',
      age: 24,
    },
    '44444444': {
      name: 'David',
      age: 24,
    },
    '33333333': {
      name: 'Belle',
      age: 28,
    },
    '11111111': {
      name: 'John',
      age: 28,
    },
  })

})
