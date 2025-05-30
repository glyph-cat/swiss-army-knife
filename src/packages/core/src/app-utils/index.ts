/**
 * @public
 */
export class AppUtils {

  constructor(readonly internalAppIdentifier: string) {
    this.createStorageKey = this.createStorageKey.bind(this)
    this.clearStorage = this.clearStorage.bind(this)
    this.clearLocalStorage = this.clearLocalStorage.bind(this)
    this.clearSessionStorage = this.clearSessionStorage.bind(this)
    this.clearAllStorage = this.clearAllStorage.bind(this)
  }

  createStorageKey(key: string): string {
    return `${this.internalAppIdentifier}/${key}`
  }

  clearStorage(storage: Storage): void {
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key.startsWith(this.internalAppIdentifier)) {
        storage.removeItem(key)
      }
    }
  }

  clearLocalStorage(): void {
    this.clearStorage(localStorage)
  }

  clearSessionStorage(): void {
    this.clearStorage(sessionStorage)
  }

  clearAllStorage(): void {
    this.clearLocalStorage()
    this.clearSessionStorage()
  }

}
