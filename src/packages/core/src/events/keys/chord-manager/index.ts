import { SimpleStateManager } from 'cotton-box'
import { IS_DEBUG_ENV } from '../../../constants'
import { devWarn } from '../../../dev'
import { UUIDFactory } from '../../../hash'
import { isNegative } from '../../../math/readability'
import { CleanupFunction, IDisposable } from '../../../types'

/**
 * @public
 */
export class KeyChordManager implements IDisposable {

  static readonly DEFAULT_ACTIVATION_KEY = 'k'
  static readonly DEFAULT_TIMEOUT = 3000

  /**
   * @internal
   */
  private readonly M$uuidFactory = new UUIDFactory()

  /**
   * @internal
   */

  private readonly M$requesters = new Set<string>()

  readonly isOccupied = new SimpleStateManager(false)
  readonly activationKey: string
  readonly timeout: number

  constructor(activationKey?: string, timeout?: number) {

    this.activationKey = activationKey ?? KeyChordManager.DEFAULT_ACTIVATION_KEY
    if (IS_DEBUG_ENV) {
      if (this.activationKey.length !== 1) {
        devWarn(`Expected chordActivationKey to be precisely 1 letter but received "${this.activationKey}" (${this.activationKey.length} letters)`)
      }
    }

    this.timeout = timeout ?? KeyChordManager.DEFAULT_TIMEOUT
    if (IS_DEBUG_ENV) {
      if (isNegative(this.timeout)) {
        devWarn(`Expected timeout to be greater than 0 but got ${this.timeout}`)
      }
    }

    this.occupyKeyChord = this.occupyKeyChord.bind(this)
    this.dispose = this.dispose.bind(this)
  }

  occupyKeyChord(): CleanupFunction {
    const id = this.M$uuidFactory.create()
    this.M$requesters.add(id)
    this.M$updateOccupiedState()
    return () => {
      this.M$requesters.delete(id)
      this.M$updateOccupiedState()
      this.M$uuidFactory.untrack(id)
    }
  }

  dispose(): void {
    this.isOccupied.dispose()
  }

  /**
   * @internal
   */
  private M$updateOccupiedState(): void {
    this.isOccupied.set(this.M$requesters.size > 0)
  }

}
