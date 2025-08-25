import { createContext, JSX, useContext } from 'react'
import { PreloadableComponent } from '.'

test('Normal usage', () => {
  function TestComponentWithoutContextProvider(): JSX.Element {
    return null
  }
  const preloadableComponent = new PreloadableComponent(TestComponentWithoutContextProvider)
  expect(preloadableComponent.preload()).toBe(true)
})

test('Component without context provider', () => {
  const TestContext = createContext<string>(null)
  function TestComponentWithoutContextProvider(): JSX.Element {
    const ctx = useContext(TestContext)
    ctx.toString() // this should cause an error, but should be suppressed.
    return null
  }
  const preloadableComponent = new PreloadableComponent(TestComponentWithoutContextProvider)
  expect(preloadableComponent.preload()).toBe(false)
})
