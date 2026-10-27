/**
 * @public
 */
export type VersionedData<T> = [number, T]

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SerializedVersionedData = `[${number},${any}]`
