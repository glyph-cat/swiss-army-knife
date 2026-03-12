import chalk from 'chalk'
import { execSync } from 'child_process'
import { existsSync, readlinkSync, rmSync, symlinkSync, unlinkSync } from 'fs'
import path from 'path'
import { Nullable } from '../../../src/packages/foundation/src/nullable'
import { isString } from '../../../src/packages/type-checking/src/is-string'
import { getSiblingPackages } from '../../../tools/get-sibling-packages'

const node_modules = 'node_modules'

function main(): void {

  const cwd = process.cwd()
  const siblingPackages = getSiblingPackages()
  const BASE_IGNORE_LIST = [
    'localization-react',
  ]


  console.log(`Creating symlinks for ${node_modules}...`)
  const SYMLINKS_IGNORE_LIST = [
    ...BASE_IGNORE_LIST,
  ]
  siblingPackages.forEach((packageDirectory) => {
    if (!SYMLINKS_IGNORE_LIST.includes(packageDirectory)) {
      linkNodeModules(cwd, packageDirectory)
    }
  })

  console.log('Forwarding exports...')
  const AFE_IGNORE_LIST = [
    ...BASE_IGNORE_LIST,
    'eslint-config',
    'sleep-sort',
  ]
  siblingPackages.forEach((packageDirectory) => {
    if (!AFE_IGNORE_LIST.includes(packageDirectory)) {
      try {
        execSync(`yarn --cwd "${path.join('.', 'src', 'packages', packageDirectory)}" afe`)
        console.log(chalk.gray(` ✓ ${packageDirectory} · Automatically forwarded exports`))
      } catch (e) {
        console.log(chalk.red(` × ${packageDirectory} · Failed to forward exports`))
      }
    }
  })

}

main()

function linkNodeModules(cwd: string, packageDirectory: string): void {

  const sourcePath = path.join(cwd, node_modules)
  const targetPath = path.join(cwd, 'src', 'packages', packageDirectory, node_modules)

  if (existsSync(targetPath)) {
    const symlinkPath = tryReadlinkSync(targetPath)
    if (isString(symlinkPath)) {
      if (symlinkPath === sourcePath) {
        console.log(chalk.gray(` ✓ ${packageDirectory} · Already linked`))
        return // Early exit
      } else {
        try {
          unlinkSync(targetPath)
        } catch (e) {
          console.log(chalk.red(` × ${packageDirectory} · Failed to link, another symlink already exists but could not be removed`))
          console.log(e)
          return // Early exit
        }
      }
    } else {
      try {
        rmSync(targetPath, { recursive: true })
      } catch (e) {
        console.log(chalk.red(` × ${packageDirectory} · Failed to link, another folder already exists but could not be removed`))
        console.log(e)
        return // Early exit
      }
    }
  }

  try {
    symlinkSync(sourcePath, targetPath)
    console.log(chalk.green(` + ${packageDirectory} · Link created`))
  } catch (e) {
    console.log(chalk.red(` × ${packageDirectory} · Failed to create link`))
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
