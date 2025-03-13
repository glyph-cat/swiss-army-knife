import { createRegistrationReducers, IFocusNodeState } from '.'

// TODO: test when `ignoreSiblings = true`

describe('ignoreSiblings = false', () => {

  test('Has no other existing child nodes', () => {

    const [register, unregister] = createRegistrationReducers(':r1:', false)

    const initialState: IFocusNodeState = {
      id: ':r0:',
      ignoreSiblings: false,
      focusedChild: null,
      childNodes: {},
    }

    const registeredState = register(initialState)
    expect(registeredState).toStrictEqual({
      id: ':r0:',
      ignoreSiblings: false,
      focusedChild: ':r1:',
      childNodes: {
        ':r1:': true,
      },
    })

    const unregisteredState = unregister(registeredState)
    expect(unregisteredState).toStrictEqual({
      id: ':r0:',
      ignoreSiblings: false,
      focusedChild: null,
      childNodes: {},
    })

  })

  test('Has other existing child nodes', () => {

    const [register, unregister] = createRegistrationReducers(':r3:', false)

    const initialState: IFocusNodeState = {
      id: ':r0:',
      ignoreSiblings: false,
      focusedChild: ':r2:',
      childNodes: {
        ':r1:': true,
        ':r2:': true,
      },
    }

    const registeredState = register(initialState)
    expect(registeredState).toStrictEqual({
      id: ':r0:',
      ignoreSiblings: false,
      focusedChild: ':r3:',
      childNodes: {
        ':r1:': true,
        ':r2:': true,
        ':r3:': true,
      },
    })

    const unregisteredState = unregister(registeredState)
    expect(unregisteredState).toStrictEqual({
      id: ':r0:',
      ignoreSiblings: false,
      focusedChild: ':r2:',
      childNodes: {
        ':r1:': true,
        ':r2:': true,
      },
    })

  })

  test('Regain focus', () => {

    const [register, unregister] = createRegistrationReducers(':r2:', false)

    const initialState: IFocusNodeState = {
      id: ':r0:',
      ignoreSiblings: false,
      focusedChild: ':r3:',
      childNodes: {
        ':r1:': true,
        ':r2:': true,
        ':r3:': true,
      },
    }

    const registeredState = register(initialState)
    expect(registeredState).toStrictEqual({
      id: ':r0:',
      ignoreSiblings: false,
      focusedChild: ':r2:',
      childNodes: {
        ':r1:': true,
        ':r3:': true,
        ':r2:': true,
      },
    })

    const unregisteredState = unregister(registeredState)
    expect(unregisteredState).toStrictEqual({
      id: ':r0:',
      ignoreSiblings: false,
      focusedChild: ':r3:',
      childNodes: {
        ':r1:': true,
        ':r3:': true,
      },
    })

  })

})
