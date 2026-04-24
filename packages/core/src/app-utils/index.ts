const STORAGE_KEY_CONCAT_CHAR = '/'

/**
 * @public
 */
export class AppUtils {

  constructor(readonly internalAppIdentifier: string) {
    this.createStorageKey = this.createStorageKey.bind(this)
    this.clearStorage = this.clearStorage.bind(this)
    this.clearLocalStorage = this.clearLocalStorage.bind(this)
    this.clearSessionStorage = this.clearSessionStorage.bind(this)
    this.clearLocalAndSessionStorage = this.clearLocalAndSessionStorage.bind(this)
  }

  createStorageKey(key: string): string {
    return `${this.internalAppIdentifier}${STORAGE_KEY_CONCAT_CHAR}${key}`
  }

  clearStorage(storage: Storage): void {
    const storageKeyPrefix = `${this.internalAppIdentifier}${STORAGE_KEY_CONCAT_CHAR}`
    // Backward loop required because `storage.length` will change as keys get deleted
    for (let i = storage.length - 1; i >= 0; i--) {
      const key = storage.key(i)
      if (key?.startsWith(storageKeyPrefix)) {
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

  clearLocalAndSessionStorage(): void {
    this.clearLocalStorage()
    this.clearSessionStorage()
  }

}
