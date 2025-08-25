// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { renderToString as $ } from 'react-dom/server'

import { ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'

/**
 * A client-side-optimized alternative to {@link $ | `renderToString`} from `'react-dom/server'`.
 *
 * Further reading: [Removing renderToString from the client code](https://react.dev/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)
 * @public
 */
export function renderToString(children: ReactNode): string {
  const container = document.createElement('div')
  const root = createRoot(container)
  flushSync(() => { root.render(children) })
  const payload = container.innerHTML
  root.unmount()
  container.remove()
  return payload
}
