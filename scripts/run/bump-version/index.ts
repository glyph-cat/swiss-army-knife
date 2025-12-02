import chalk from 'chalk'
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { PackageJson } from 'type-fest'
import { Encoding } from '../../../src/packages/foundation/src/encoding'

// What this script does:
// Bumps the versions of the root package along with its sub-packages.

function run(newVersion: string): void {

  if (!newVersion) {
    console.log(chalk.redBright(`Missing \`newVersion\``))
    process.exit(1)
  }

  if (!/^\d+\.\d+\.\d+(-[a-z]+\.\d+)?$/.test(newVersion)) {
    console.log(chalk.redBright(`\`newVersion\` is invalid: "${newVersion}"`))
    process.exit(1)
  }

  const gitStatusOutput = execSync('git status --porcelain', {
    encoding: Encoding.UTF_8,
  }).trim()

  if (gitStatusOutput) {
    console.log(chalk.redBright('Cannot bump version when there are uncommitted git changes'))
    process.exit(1)
  }

  const PACKAGE_JSON = 'package.json'
  const PACKAGES_PATH = path.join('.', 'src', 'packages')

  const rootPackageJsonPath = path.join('.', PACKAGE_JSON)
  const rootPackageJson = readPackageJson(rootPackageJsonPath)
  setPackageVersion(rootPackageJson, newVersion)
  writePackageJson(rootPackageJsonPath, rootPackageJson)

  const foundationPackageJsonPath = path.join(PACKAGES_PATH, 'foundation', PACKAGE_JSON)
  const foundationPackageJson = readPackageJson(foundationPackageJsonPath)
  setPackageVersion(foundationPackageJson, newVersion)
  writePackageJson(foundationPackageJsonPath, foundationPackageJson)

  const corePackageJsonPath = path.join(PACKAGES_PATH, 'core', PACKAGE_JSON)
  const corePackageJson = readPackageJson(corePackageJsonPath)
  setPackageVersion(corePackageJson, newVersion)
  setPeerDependencyVersion(corePackageJson, foundationPackageJson.name!, newVersion)
  writePackageJson(corePackageJsonPath, corePackageJson)

  const reactPackageJsonPath = path.join(PACKAGES_PATH, 'react', PACKAGE_JSON)
  const reactPackageJson = readPackageJson(reactPackageJsonPath)
  setPackageVersion(reactPackageJson, newVersion)
  setPeerDependencyVersion(reactPackageJson, foundationPackageJson.name!, newVersion)
  setPeerDependencyVersion(reactPackageJson, corePackageJson.name!, newVersion)
  writePackageJson(reactPackageJsonPath, reactPackageJson)

  execSync(`git add ${[
    rootPackageJsonPath,
    corePackageJsonPath,
    reactPackageJsonPath,
  ].join(' ')}`)
  execSync(`git commit -m 'v${newVersion}'`)
  execSync(`git tag 'v${newVersion}'`)

}

run(process.argv[2])

function readPackageJson(fromPath: string): PackageJson {
  return JSON.parse(readFileSync(fromPath, Encoding.UTF_8))
}

function writePackageJson(toPath: string, object: PackageJson): void {
  writeFileSync(toPath, JSON.stringify(object, null, 2), Encoding.UTF_8)
}

function setPackageVersion(
  packageObj: PackageJson,
  version: string,
): void {
  packageObj.version = version
}

function setPeerDependencyVersion(
  packageObj: PackageJson,
  dependencyName: string,
  version: string,
): void {
  if (!packageObj.peerDependencies) {
    packageObj.peerDependencies = {}
  }
  packageObj.peerDependencies[dependencyName] = version
}
