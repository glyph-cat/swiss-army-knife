import { Nullable } from '@glyph-cat/foundation'
import path from 'path'
import { hasPackageJson } from '../has-package-json'

/**
 * Get the path that points to the root directory of the current project.
 * This is performed by checking for `package.json` file in directories that
 * preceed the current one.
 *
 * If current directory is not in any project directory at all, `null` will be returned.
 * @public
 */
export function getProjectRootDirectory(currentDirectory: string): Nullable<string> {
  const currentDirectoryChunks = currentDirectory.split(path.sep).filter((chunk) => !!chunk)
  for (let i = 1; i < currentDirectoryChunks.length; i++) {
    const probePath = path.join(...currentDirectoryChunks.slice(0, i))
    if (hasPackageJson(probePath)) {
      return probePath
    }
  }
  return currentDirectory
}
