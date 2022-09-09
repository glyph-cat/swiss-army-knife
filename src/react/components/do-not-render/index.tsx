/**
 * @public
 */
export interface DoNotRenderProps {
  children: unknown
}

/**
 * A stop-gap measured type of component to temporarily disable components.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DoNotRender(props: DoNotRenderProps): JSX.Element {
  return null // So that it is compatible with React <18
}
