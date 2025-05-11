/**
 * @public
 */
export class AppUtils {

  constructor(readonly internalAppIdentifier: string) {
    this.createStorageKey = this.createStorageKey.bind(this)
  }

  createStorageKey(key: string): string {
    return `${this.internalAppIdentifier}/${key}`
  }

}
