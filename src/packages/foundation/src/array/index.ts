/**
 * @public
 */
export type ReadWritableArray<T> = Array<T> | ReadonlyArray<T>

/**
 * @public
 * @deprecated Please use {@link ReadWritableArray|`ReadWritableArray`} instead.
 */
export type ReadonlyOrWritableArray<T> = ReadWritableArray<T>
