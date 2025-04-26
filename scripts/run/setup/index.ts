import chalk from 'chalk'
import { symlinkSync } from 'fs'

function main(): void {

  const cwd = process.cwd()

  linkNodeModules(cwd, 'core')
  linkNodeModules(cwd, 'react')
  linkNodeModules(cwd, 'ml-helpers')
  linkNodeModules(cwd, 'cleanup-manager')
  linkNodeModules(cwd, 'cli-parameter-parser')
  linkNodeModules(cwd, 'react-test-utils')

}

main()

type PackageName = 'core' | 'react' | 'ml-helpers' | 'cleanup-manager' | 'cli-parameter-parser' | 'react-test-utils'

function linkNodeModules(cwd: string, packageName: PackageName): void {
  const node_modules = 'node_modules'
  try {
    symlinkSync(`${cwd}/${node_modules}`, `${cwd}/src/packages/${packageName}/node_modules`)
    console.log(chalk.green(' ✓ ') + `Linked ${node_modules} to ${packageName} package`)
  } catch (e) {
    console.log(chalk.red(' × ') + `Failed to link ${node_modules} to ${packageName} package`)
    console.error(e)
  }
}