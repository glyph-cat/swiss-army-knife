import { Nullable } from '@glyph-cat/foundation'
import path from 'path'
import { hasPackageJson } from '../has-package-json'

/**
 * Get the path that points to the directory of the current package.
 * This is useful when inside a subpackage of a monorepo.
 *
 * If path could not be found, the current directory path is returned as-is.
 * @public
 */
export function getCurrentPackageDirectory(currentDirectory: string): Nullable<string> {
  const currentDirectoryChunks = currentDirectory.split(path.sep).filter((chunk) => !!chunk)
  do {
    const probePath = (path.sep === '/' ? '/' : '') + path.join(...currentDirectoryChunks)
    if (hasPackageJson(probePath)) {
      return probePath
    }
    currentDirectoryChunks.pop()
  } while (currentDirectoryChunks.length > 0)
  return currentDirectory
}
