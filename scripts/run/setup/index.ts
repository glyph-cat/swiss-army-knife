import chalk from 'chalk'
import { symlinkSync } from 'fs'

function main(): void {

  const PACKAGE_NAMES = [
    'foundation',
    'core',
    'react',
    'equality',
    'localization',
    // 'localization-react',
    'cleanup-manager',
    'react-test-utils',
    'cli-parameter-parser',
    // 'project-helpers',
    'ml-helpers',
    'crayon',
    'eslint-config',
    'playground-expo',
  ] as const

  const cwd = process.cwd()

  for (const packageName of PACKAGE_NAMES) {
    linkNodeModules(cwd, packageName)
  }

}

main()

function linkNodeModules(cwd: string, packageName: string): void {
  const node_modules = 'node_modules'
  try {
    symlinkSync(`${cwd}/${node_modules}`, `${cwd}/src/packages/${packageName}/node_modules`)
    console.log(chalk.green(' ✓ ') + `Linked ${node_modules} to ${packageName} package`)
  } catch (e) {
    console.log(chalk.red(' × ') + `Failed to link ${node_modules} to ${packageName} package`)
    console.error(e)
  }
}
