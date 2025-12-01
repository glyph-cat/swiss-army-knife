import { useHydrationState } from '.'
import { GCProvider } from '../../../provider'

describe(`Without ${GCProvider.name}`, () => {

  test('Server-side rendering', () => {

    // ...

  })

  test('Client-side rendering', () => {

    // 1st render
    // ...

    // subsequent renders
    // ...

  })

})

describe(`With ${GCProvider.name}`, () => {

  test('Server-side rendering', () => {

    // ...

  })

  test('Client-side rendering', () => {

    // 1st render
    // ...

    // subsequent renders
    // ...

  })

})
