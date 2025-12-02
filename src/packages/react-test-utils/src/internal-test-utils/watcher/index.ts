// NOTE: Adapted from 'cotton-box'.

export class Watcher<Args extends any[]> {

  /**
   * @internal
   */
  private M$isDisposed = false

  /**
   * @internal
   */
  private M$watcherCollection: Record<number, CallableFunction> = {}

  /**
   * @internal
   */
  private M$incrementalWatchId = 0

  constructor() {
    this.watch = this.watch.bind(this)
    this.refresh = this.refresh.bind(this)
    this.unwatchAll = this.unwatchAll.bind(this)
    this.dispose = this.dispose.bind(this)
  }

  watch(callback: ((...args: Args) => void)): (() => void) {
    const newId = ++this.M$incrementalWatchId
    this.M$watcherCollection[newId] = callback
    return () => { delete this.M$watcherCollection[newId] }
  }

  refresh(...args: Args): void {
    if (this.M$isDisposed) { return } // Early exit
    const callbackStack = Object.values(this.M$watcherCollection)
    for (let i = 0; i < callbackStack.length; i++) {
      callbackStack[i](...args)
    }
  }

  unwatchAll(): void {
    this.M$watcherCollection = {}
  }

  dispose(): void {
    this.M$isDisposed = true
    this.unwatchAll()
  }

}
