/* eslint-disable @typescript-eslint/no-explicit-any */

import { Nullable } from '@glyph-cat/foundation'
import { isFunction } from '@glyph-cat/type-checking'

const ATTR_NAME = 'name'
const ATTR_CONTENT = 'content'
const META_NAME = 'monetization'

/**
 * @public
 * @deprecated This now only serves as an example of the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver|`MutationObserver`}
 * could be used.
 */
export class PaymentPointerProtector {

  /**
   * @internal
   */
  private M$metaTagElement: Nullable<HTMLMetaElement> = null

  /**
   * @internal
   */
  private M$metaObserver: Nullable<MutationObserver> = null

  /**
   * @internal
   */
  private M$headObserver: Nullable<MutationObserver> = null
  // Properties 'name' and 'content' do not exist under mutationStack[number].target

  constructor(readonly paymentPointer: string) {
    this.guard = this.guard.bind(this)
    this.release = this.release.bind(this)
  }

  /**
   * @internal
   */
  private M$onMetaMutated = (mutationStack: Array<MutationRecord>): void => {
    // This makes the element seem like a read-only tag because attribute values
    // are reverted the moment a new value is committed to it
    for (const mutation of mutationStack) {
      if ((mutation.target as any)[ATTR_NAME] !== META_NAME) {
        (mutation.target as any)[ATTR_NAME] = META_NAME
      }
      if ((mutation.target as any)[ATTR_CONTENT] !== this.paymentPointer) {
        (mutation.target as any)[ATTR_CONTENT] = this.paymentPointer
      }
    }
  }

  /**
   * @internal
   */
  private M$startMetaObserver = (): void => {
    this.M$metaTagElement = document.createElement('meta')
    this.M$metaTagElement.name = META_NAME
    this.M$metaTagElement.content = this.paymentPointer
    document.head.appendChild(this.M$metaTagElement)
    this.M$metaObserver = new MutationObserver(this.M$onMetaMutated)
    this.M$metaObserver.observe(this.M$metaTagElement, { attributes: true })
  }

  /**
   * @internal
   */
  private M$stopMetaObserver = (): void => {
    if (isFunction(this.M$metaObserver?.disconnect)) {
      this.M$metaObserver.disconnect()
    }
    this.M$metaObserver = null
    if (isFunction(this.M$metaTagElement?.remove)) {
      this.M$metaTagElement.remove()
    }
    this.M$metaTagElement = null
  }

  /**
   * @internal
   */
  private M$onHeadMutated = (mutationStack: Array<MutationRecord>): void => {
    // NOTE: People can still add a meta tag with attributes that do not match
    // 'monetization', then rename it to 'monetization' afterwards since no
    // observer attached to it, there will be 2 payment pointers then.
    for (const mutation of mutationStack) {
      for (const removedNode of mutation.removedNodes) {
        // In case own payment pointer is deleted
        if (
          (removedNode as any)[ATTR_NAME] === META_NAME &&
          (removedNode as any)[ATTR_CONTENT] === this.paymentPointer
        ) {
          this.M$stopMetaObserver()
          this.M$startMetaObserver() // New tag is created in the process
        }
      }
      for (const addedNode of mutation.addedNodes) {
        // In case someone else's payment pointer is added
        if (
          (addedNode as any)[ATTR_NAME] === META_NAME &&
          (addedNode as any)[ATTR_CONTENT] !== this.paymentPointer
        ) {
          document.head.removeChild(addedNode)
        }
      }
    }
  }

  /**
   * @internal
   */
  private M$startHeadObserver = (): void => {
    this.M$headObserver = new MutationObserver(this.M$onHeadMutated)
    this.M$headObserver.observe(document.head, { childList: true })
  }

  /**
   * @internal
   */
  private M$stopHeadObserver = (): void => {
    if (isFunction(this.M$headObserver?.disconnect)) {
      this.M$headObserver.disconnect()
    }
    this.M$headObserver = null
  }

  /**
   * Start guarding the payment pointer.
   */
  guard(): void {
    this.M$startMetaObserver()
    this.M$startHeadObserver()
  }

  /**
   * Stop guarding the payment pointer.
   */
  release(): void {
    this.M$stopMetaObserver()
    this.M$stopHeadObserver()
  }

}
