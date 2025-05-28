import { objectSort } from '.'

test(objectSort.name, (): void => {

  interface DummyUserSchema {
    name: string
    age: number
  }

  const userCollection: Record<string, DummyUserSchema> = {
    'j8Jmawdf': {
      name: 'John',
      age: 28,
    },
    'V9ijpWih': {
      name: 'Alice',
      age: 24,
    },
    'aUis01qU': {
      name: 'Belle',
      age: 28,
    },
    'gezhL5kW': {
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
    'V9ijpWih': {
      name: 'Alice',
      age: 24,
    },
    'gezhL5kW': {
      name: 'David',
      age: 24,
    },
    'aUis01qU': {
      name: 'Belle',
      age: 28,
    },
    'j8Jmawdf': {
      name: 'John',
      age: 28,
    },
  })

})
