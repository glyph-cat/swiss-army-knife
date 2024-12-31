import { UnsupportedPlatformError } from '@glyph-cat/swiss-army-knife'
import { JSX } from 'react'
import { PaymentPointerProps } from './abstractions'

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PaymentPointer(props: PaymentPointerProps): JSX.Element {
  throw new UnsupportedPlatformError()
}

/**
 * @public
 */
export function usePaymentPointer(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  paymentPointer: PaymentPointerProps['value']
): void {
  throw new UnsupportedPlatformError()
}

export * from './abstractions'
