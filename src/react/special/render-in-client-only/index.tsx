import { ReactNode, useEffect, useState } from 'react'

/**
 * @public
 */
export interface ClientOnlyProps {
  children?: ReactNode
}

/**
 * Suppresses the error in server-side rendered projects:
 * "Expected server HTML to contain a matching <div> in <div>"
 *
 * Notes:
 * - In React Native, the children will still be rendered accordingly.
 * - Might not be a good practice. Use sparingly.
 *
 * @see https://github.com/vercel/next.js/discussions/17443#discussioncomment-637879
 * @public
 */
export function ClientOnly(
  props: ClientOnlyProps
): JSX.Element {
  const { children } = props
  const [selfIsMounted, setMountedStatus] = useState(false)
  useEffect(() => { setMountedStatus(true) }, [])
  return selfIsMounted ? children as JSX.Element : null
}
