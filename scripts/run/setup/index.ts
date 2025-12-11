import chalk from 'chalk'
import { existsSync, readlinkSync, rmSync, symlinkSync, unlinkSync } from 'fs'
import Path from 'path'
import { isString } from '../../../src/packages/core/src/data'
import { Nullable } from '../../../src/packages/foundation/src/nullable'
import { getSiblingPackages } from '../../../tools/get-sibling-packages'

const node_modules = 'node_modules'

function main(): void {
  console.log(`Creating symlinks for ${node_modules}...`)
  const IGNORE_LIST = new Set([
    'localization-react',
    'project-helpers',
  ])
  const packageDirectoryNames = Object.keys(getSiblingPackages()).sort()
  for (const packageDirectoryName of packageDirectoryNames) {
    if (IGNORE_LIST.has(packageDirectoryName)) { continue }
    linkNodeModules(process.cwd(), packageDirectoryName)
  }
}

main()

function linkNodeModules(cwd: string, packageName: string): void {

  const sourcePath = Path.join(cwd, node_modules)
  const targetPath = Path.join(cwd, 'src', 'packages', packageName, node_modules)

  if (existsSync(targetPath)) {
    const symlinkPath = tryReadlinkSync(targetPath)
    if (isString(symlinkPath)) {
      if (symlinkPath === sourcePath) {
        console.log(chalk.gray(` ✓ ${packageName} · Already linked`))
        return // Early exit
      } else {
        try {
          unlinkSync(targetPath)
        } catch (e) {
          console.log(chalk.red(` × ${packageName} · Failed to link, another symlink already exists but could not be removed`))
          console.log(e)
          return // Early exit
        }
      }
    } else {
      try {
        rmSync(targetPath, { recursive: true })
      } catch (e) {
        console.log(chalk.red(` × ${packageName} · Failed to link, another folder already exists but could not be removed`))
        console.log(e)
        return // Early exit
      }
    }
  }

  try {
    symlinkSync(sourcePath, targetPath)
    console.log(chalk.green(` + ${packageName} · Link created`))
  } catch (e) {
    console.log(chalk.red(` × ${packageName} · Failed to create link`))
    console.error(e)
  }

}

function tryReadlinkSync(targetPath: string): Nullable<string> {
  try {
    return readlinkSync(targetPath)
  } catch (e) {
    return null
  }
}
