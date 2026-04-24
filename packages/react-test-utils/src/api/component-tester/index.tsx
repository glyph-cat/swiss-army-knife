import { IDisposable, Nullable, StringRecord } from '@glyph-cat/foundation'
import { render, RenderResult } from '@testing-library/react'
import { ComponentType, createContext, JSX, StrictMode, useContext } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ComponentTesterContext = createContext<Nullable<ComponentTester<any>>>(null)

/**
 * @public
 */
export function useComponentTesterProbe(): void {
  const tester = useContext(ComponentTesterContext)
  if (tester) {
    /* eslint-disable react-hooks/immutability */
    tester.M$isProbeMounted = true
    tester.M$renderCount += 1
    /* eslint-enable react-hooks/immutability */
  }
}

/**
 * @public
 */
export class ComponentTester<P = StringRecord> implements IDisposable {

  /**
   * @internal
   */
  M$isProbeMounted = false

  /**
   * @internal
   */
  private readonly Component: ComponentType<P>

  /**
   * @internal
   */
  private M$renderResult: Nullable<RenderResult> = null
  get renderResult(): Nullable<RenderResult> {
    return this.M$renderResult
  }

  /**
   * @internal
   */
  M$renderCount: number = 0
  get renderCount(): number {
    if (!this.M$isProbeMounted) {
      throw new Error('To measure render count, the test component must `useComponentTesterProbe()`.')
    }
    return this.M$renderCount
  }

  constructor(
    Component: ComponentType<P>,
    readonly name?: string,
    readonly strictMode = false,
  ) {
    const AdapterComponent: typeof this.Component = (props) => {
      return (
        <ComponentTesterContext.Provider value={this}>
          <Component {...props as JSX.IntrinsicAttributes & P} />
        </ComponentTesterContext.Provider>
      )
    }
    if (strictMode) {
      this.Component = (props) => {
        return (
          <StrictMode>
            <AdapterComponent {...props as JSX.IntrinsicAttributes & P} />
          </StrictMode>
        )
      }
    } else {
      this.Component = AdapterComponent
    }
  }

  render(props?: P): void {
    this.M$renderResult = render(
      <this.Component {...props as JSX.IntrinsicAttributes & P} />
    )
  }

  dispose(): void {
    this.M$renderResult?.unmount()
  }

}
