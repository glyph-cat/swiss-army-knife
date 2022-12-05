// NOTE: These guards are necessary because it can be hard to debug code when
// multiple `forEach-` series functions are nested together.

let counter = 0

/**
 * @internal
 */
class SymbolGenerator {

  private M$cache = new Map<symbol, void>()

  M$create(): symbol {
    const s = Symbol(++counter)
    this.M$cache.set(s)
    return s
  }

  M$has(s: symbol): boolean {
    return this.M$cache.has(s)
  }

  M$revoke(s: symbol): void {
    this.M$cache.delete(s)
  }

}

/**
 * @internal
 */
export const breakSymbolGenerator = new SymbolGenerator()
