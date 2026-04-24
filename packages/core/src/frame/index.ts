/**
 * Gets the average interval between two rendered frames.
 * @param n - The number of intervals to average from.
 * @returns The average frame time.
 */
export function getFrameTime(n: number): Promise<number> {
  let lastSnapshotTime = performance.now()
  const snapshots: Array<number> = []
  return new Promise<number>((resolve) => {
    const callback = () => {
      const currentSnapshotTime = performance.now()
      snapshots.push(currentSnapshotTime - lastSnapshotTime)
      if (snapshots.length >= n) {
        resolve(snapshots.reduce((acc, value) => acc + value, 0) / snapshots.length)
        return // Early exit
      }
      lastSnapshotTime = currentSnapshotTime
    }
    requestAnimationFrame(callback)
  })
}
