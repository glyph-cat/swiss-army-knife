import type { ComponentType, JSX, PropsWithChildren, ReactNode } from 'react'

/**
 * @example
 * const Providers = createCompositeProvider(
 *   ThemeProvider,
 *   AuthProvider,
 * )
 * function App() {
 *   return {
 *     <Providers>
 *       <SomeScreenOrComponent />
 *     </Providers>
 *   }
 * }
 * @public
 */
export function createCompositeProvider(
  providers: Array<ComponentType<PropsWithChildren>>,
) {
  return function CompositeProvider({ children }: PropsWithChildren): ReactNode {
    return providers.reduceRight((child, Provider) => {
      return <Provider>{child}</Provider>
    }, children)
  }
}

/**
 * @example
 * export default withProviders([
 *   ThemeProvider,
 *   AuthProvider,
 * ])(App)
 * @public
 */
export function withProviders(providers: Array<ComponentType<PropsWithChildren>>) {
  const CompositeProvider = createCompositeProvider(providers)
  return function withCompositeProviders<Props extends JSX.IntrinsicAttributes>(
    Component: ComponentType<Props>,
  ): ComponentType<Props> {
    return function WithProviders(props: Props) {
      return (
        <CompositeProvider>
          <Component {...props} />
        </CompositeProvider>
      )
    }
  }
}
