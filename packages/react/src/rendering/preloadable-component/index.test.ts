import { createContext, ReactNode, useContext } from 'react'
import { PreloadableComponent } from '.'

test('Normal usage', () => {
  function TestComponentWithoutContextProvider(): ReactNode {
    return null
  }
  const preloadableComponent = new PreloadableComponent(TestComponentWithoutContextProvider)
  expect(preloadableComponent.preload()).toBeTrue()
})

test('Component without context provider', () => {
  const TestContext = createContext<string>(null!)
  function TestComponentWithoutContextProvider(): ReactNode {
    const ctx = useContext(TestContext)
    ctx.toString() // this should cause an error, but should be suppressed.
    return null
  }
  const preloadableComponent = new PreloadableComponent(TestComponentWithoutContextProvider)
  expect(preloadableComponent.preload()).toBeFalse()
})
