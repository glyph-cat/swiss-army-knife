import { UnsupportedPlatformError } from '../../error'

/**
 * @public
 */
export class PaymentPointerProtector {

  constructor() {
    throw new UnsupportedPlatformError()
  }

}
