import { existsSync } from 'node:fs'
import path from 'node:path'

/**
 * @returns `true` if the current directory contains a `rush.json` file.
 */
export function hasRushJson(directoryPath: string): boolean {
  return existsSync(path.join(directoryPath, 'rush.json'))
}
