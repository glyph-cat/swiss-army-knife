import { PaymentPointerProtector } from '@glyph-cat/swiss-army-knife'
import { JSX } from 'react'
import { useIsomorphicLayoutEffect } from '../hooks/isomorphic-layout-effect'
import { PaymentPointerProps } from './abstractions'

/**
 * @public
 * @deprecated This now only serves as an example of the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver|`MutationObserver`}
 * could be used in the underlying code.
 */
export function PaymentPointer(props: PaymentPointerProps): JSX.Element {
  const { value } = props
  usePaymentPointer(value)
  return null
}

/**
 * @public
 * @deprecated This now only serves as an example of the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver|`MutationObserver`}
 * could be used in the underlying code.
 */
export function usePaymentPointer(
  paymentPointer: PaymentPointerProps['value']
): void {
  useIsomorphicLayoutEffect(() => {
    const protector = new PaymentPointerProtector(paymentPointer)
    protector.guard()
    return () => { protector.release() }
  }, [paymentPointer])
}

export * from './abstractions'
