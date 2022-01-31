import { GCObject } from '../../bases'
import { isFunction } from '../../data/type-check'
import { useLayoutEffect } from '../../react/hooks/isomorphic-layout-effect'

const ATTR_NAME = 'name'
const ATTR_CONTENT = 'content'
const META_NAME = 'monetization'

/**
 * @public
 */
export class PaymentPointerProtector extends GCObject {

  private paymentPointer: string
  private metaTagElement: HTMLMetaElement
  private metaObserver: MutationObserver
  private headObserver: MutationObserver
  // KIV: Properties 'name' and 'content' do not exist under mutationStack[number].target

  constructor(paymentPointer: PaymentPointerProps['value']) {
    super()
    this.paymentPointer = paymentPointer
  }

  private onMetaMutated(mutationStack: Array<MutationRecord>): void {
    // This makes the element seem like a read-only tag because attribute values
    // are reverted the moment a new value is commited to it
    for (const mutation of mutationStack) {
      if (mutation.target[ATTR_NAME] !== META_NAME) {
        mutation.target[ATTR_NAME] = META_NAME
      }
      if (mutation.target[ATTR_CONTENT] !== this.paymentPointer) {
        mutation.target[ATTR_CONTENT] = this.paymentPointer
      }
    }
  }

  private startMetaObserver(): void {
    this.metaTagElement = document.createElement('meta')
    this.metaTagElement.name = META_NAME
    this.metaTagElement.content = this.paymentPointer
    document.head.appendChild(this.metaTagElement)
    this.metaObserver = new MutationObserver(this.onMetaMutated)
    this.metaObserver.observe(this.metaTagElement, { attributes: true })
  }

  private stopMetaObserver(): void {
    if (isFunction(this.metaObserver?.disconnect)) {
      this.metaObserver.disconnect()
    }
    this.metaObserver = null
    if (isFunction(this.metaTagElement?.remove)) {
      this.metaTagElement.remove()
    }
    this.metaTagElement = null
  }

  private onHeadMutated(mutationStack: Array<MutationRecord>): void {
    // NOTE: People can still add a meta tag with attributes that do not match
    // 'monetization', then rename it to 'monetization' afterwards since no
    // observer attached to it, there will be 2 payment pointers then.
    for (const mutation of mutationStack) {
      for (const removedNode of mutation.removedNodes) {
        // In case own payment pointer is deleted
        if (
          removedNode[ATTR_NAME] === META_NAME &&
          removedNode[ATTR_CONTENT] === this.paymentPointer
        ) {
          this.stopMetaObserver()
          this.startMetaObserver() // New tag is created in the process
        }
      }
      for (const addedNode of mutation.addedNodes) {
        // In case someone else's payment pointer is added
        if (
          addedNode[ATTR_NAME] === META_NAME &&
          addedNode[ATTR_CONTENT] !== this.paymentPointer
        ) {
          document.head.removeChild(addedNode)
        }
      }
    }
  }

  private startHeadObserver(): void {
    this.headObserver = new MutationObserver(this.onHeadMutated)
    this.headObserver.observe(document.head, { childList: true })
  }

  private stopHeadObserver(): void {
    if (isFunction(this.headObserver?.disconnect)) {
      this.headObserver.disconnect()
    }
    this.headObserver = null
  }

  /**
   * Start guarding the payment pointer.
   */
  guard(): void {
    this.startMetaObserver()
    this.startHeadObserver()
  }

  /**
   * Stop guarding the payment pointer.
   */
  release(): void {
    this.stopMetaObserver()
    this.stopHeadObserver()
  }

}

/**
 * @public
 */
export interface PaymentPointerProps {
  value: string
}

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
    return () => {
      protector.release()
    }
  }, [paymentPointer])
}
