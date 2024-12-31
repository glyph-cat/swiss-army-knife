import { PaymentPointerProtector } from '@glyph-cat/swiss-army-knife'
import { JSX, useLayoutEffect } from 'react'
import { PaymentPointerProps } from './abstractions'

/**
 * @public
 */
export function PaymentPointer(props: PaymentPointerProps): JSX.Element {
  const { value } = props
  usePaymentPointer(value)
  return null
}

/**
 * @public
 */
export function usePaymentPointer(
  paymentPointer: PaymentPointerProps['value']
): void {
  useLayoutEffect(() => {
    const protector = new PaymentPointerProtector(paymentPointer)
    protector.guard()
    return () => { protector.release() }
  }, [paymentPointer])
}

export * from './abstractions'
