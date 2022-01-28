import { createGCFactoryObject, GCFunctionalObject } from '../../bases'
import { isFunction } from '../../data/type-check'
import { useLayoutEffect } from '../../react/hooks/isomorphic-layout-effect'

/**
 * @public
 */
export interface PaymentPointerProtector extends GCFunctionalObject {
  /**
   * Start guarding the payment pointer.
   */
  guard(): void
  /**
   * Stop guarding the payment pointer.
   */
  release(): void
}

/**
 * Create a `PaymentPointerProtector` object.
 * @public
 */
export function createPaymentPointerProtector(
  paymentPointer: PaymentPointerProps['value']
): PaymentPointerProtector {

  const $factoryObject = createGCFactoryObject()

  // KIV: Properties 'name' and 'content' do not exist under mutationStack[number].target
  const ATTR_NAME = 'name'
  const ATTR_CONTENT = 'content'
  const META_NAME = 'monetization'
  let metaTagElement: HTMLMetaElement = null
  let metaObserver: MutationObserver = null
  let headObserver: MutationObserver = null

  const onMetaMutated = (mutationStack: Array<MutationRecord>): void => {
    // This makes the element seem like a read-only tag because attribute values
    // are reverted the moment a new value is commited to it
    for (const mutation of mutationStack) {
      if (mutation.target[ATTR_NAME] !== META_NAME) {
        mutation.target[ATTR_NAME] = META_NAME
      }
      if (mutation.target[ATTR_CONTENT] !== paymentPointer) {
        mutation.target[ATTR_CONTENT] = paymentPointer
      }
    }
  }

  const startMetaObserver = (): void => {
    metaTagElement = document.createElement('meta')
    metaTagElement.name = META_NAME
    metaTagElement.content = paymentPointer
    document.head.appendChild(metaTagElement)
    metaObserver = new MutationObserver(onMetaMutated)
    metaObserver.observe(metaTagElement, { attributes: true })
  }

  const stopMetaObserver = (): void => {
    if (isFunction(metaObserver?.disconnect)) {
      metaObserver.disconnect()
    }
    metaObserver = null
    if (isFunction(metaTagElement?.remove)) {
      metaTagElement.remove()
    }
    metaTagElement = null
  }

  // const a :MutationCallback
  const onHeadMutated = (mutationStack: Array<MutationRecord>): void => {
    // NOTE: People can still add a meta tag with attributes that do not match
    // 'monetization', then rename it to 'monetization' afterwards since no
    // observer attached to it, there will be 2 payment pointers then.
    for (const mutation of mutationStack) {
      for (const removedNode of mutation.removedNodes) {
        // In case own payment pointer is deleted
        if (
          removedNode[ATTR_NAME] === META_NAME &&
          removedNode[ATTR_CONTENT] === paymentPointer
        ) {
          stopMetaObserver()
          startMetaObserver() // New tag is created in the process
        }
      }
      for (const addedNode of mutation.addedNodes) {
        // In case someone else's payment pointer is added
        if (
          addedNode[ATTR_NAME] === META_NAME &&
          addedNode[ATTR_CONTENT] !== paymentPointer
        ) {
          document.head.removeChild(addedNode)
        }
      }
    }
  }

  const startHeadObserver = (): void => {
    headObserver = new MutationObserver(onHeadMutated)
    headObserver.observe(document.head, { childList: true })
  }

  const stopHeadObserver = (): void => {
    if (isFunction(headObserver?.disconnect)) {
      headObserver.disconnect()
    }
    headObserver = null
  }

  const guard = (): void => {
    startMetaObserver()
    startHeadObserver()
  }

  const release = (): void => {
    stopMetaObserver()
    stopHeadObserver()
  }

  return {
    ...$factoryObject,
    guard,
    release,
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
    const protector = createPaymentPointerProtector(paymentPointer)
    protector.guard()
    return () => {
      protector.release()
    }
  }, [paymentPointer])
}
