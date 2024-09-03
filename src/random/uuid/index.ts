import { HASH_CHARSET, getRandomHash } from '../hash'

/**
 * @public
 */
export class UUIDFactory {

  private M$history: Record<string, true> = {}

  constructor(private readonly retainHistory: boolean = true) { }

  generate(): string {
    let uuid: string
    while (!uuid || this.M$history[uuid]) {
      uuid = [
        getRandomHash(8, HASH_CHARSET.HEX_LOWER_CASE),
        getRandomHash(4, HASH_CHARSET.HEX_LOWER_CASE),
        getRandomHash(4, HASH_CHARSET.HEX_LOWER_CASE),
        getRandomHash(4, HASH_CHARSET.HEX_LOWER_CASE),
        getRandomHash(12, HASH_CHARSET.HEX_LOWER_CASE),
      ].join('-')
    }
    if (this.retainHistory) { this.M$history[uuid] = true }
    return uuid
  }

  /**
   * Removes the generated UUID from the cache. Once removed, it becomes
   * possible for the revoked UUID string to be generated again.
   */
  revoke(uuid: string): void {
    delete this.M$history[uuid]
  }

  /**
   * Resets the history of generated UUIDs. Once reset, it becomes possible for
   * all previously generated UUIDs to be generated again.
   */
  reset(): void {
    this.M$history = {}
  }

  /**
   * Retrieves all generated UUIDs.
   */
  dump(): Array<string> {
    return Object.keys(this.M$history)
  }

  /**
   * Feeds an array of UUID that are supposedly already in use to the generator
   * so that it knows to avoid generating those values.
   * @param uuids - The array of UUIDs that are somehow already in use and
   * should not be generated.
   */
  hydrate(uuids: Array<string>): void {
    for (const uuid of uuids) {
      this.M$history[uuid] = true
    }
  }

}
