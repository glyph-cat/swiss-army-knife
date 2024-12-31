import { PaymentPointerProps } from '.'
import { UnsupportedPlatformError } from '../../error'

export function usePaymentPointer(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  paymentPointer: PaymentPointerProps['value']
): void {
  throw new UnsupportedPlatformError()
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PaymentPointer(props: PaymentPointerProps): JSX.Element {
  throw new UnsupportedPlatformError()
}
