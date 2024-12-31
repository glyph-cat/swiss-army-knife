import { PaymentPointerProps } from '.'
import { useUnsupportedPlatformHandler } from '../../__internals__'

export function usePaymentPointer(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  paymentPointer: PaymentPointerProps['value']
): void {
  useUnsupportedPlatformHandler('Web monetization')
}

export function PaymentPointer(props: PaymentPointerProps): JSX.Element {
  const { value } = props
  usePaymentPointer(value)
  return null
}
