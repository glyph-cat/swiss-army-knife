import chalk from 'chalk'
import { readdirSync, readFileSync, statSync } from 'fs'
import path from 'path'
import { objectIsNotEmpty, pickLast, removeDuplicates } from '../../../src/packages/core/src/data'
import { Encoding } from '../../../src/packages/foundation/src/encoding'
import { Nullable } from '../../../src/packages/foundation/src/nullable'
import { StringRecord } from '../../../src/packages/foundation/src/records'
import { PACKAGE_JSON } from '../../../src/packages/project-helpers/src/constants'
import {
  getPackageDependencies,
} from '../../../src/packages/project-helpers/src/get-package-dependencies'
import { readPackageJson } from '../../../src/packages/project-helpers/src/read-package-json'
import { getSiblingPackages } from '../../../tools/get-sibling-packages'
import { PACKAGES_DIRECTORY, PROJECT_ROOT_DIRECTORY } from '../../constants'

console.log('Analyzing dependencies...')

// ———————————————————————————————————————————————————————————————————————————

const allSiblingPackages = getSiblingPackages()
// console.log('allSiblingPackages', allSiblingPackages)
const allRootPackageDependencies = getPackageDependencies(readPackageJson(PROJECT_ROOT_DIRECTORY))
// console.log('allRootPackageDependencies', allRootPackageDependencies)

function run(...args: Array<string>): void {

  const shouldShowGraph = !!args.find((arg) => arg === '--showGraph' || arg === '-g')

  // ———————————————————————————————————————————————————————————————————————————

  // Find all imports by crawling through every file
  const dependencyMap = allSiblingPackages.reduce((acc, packageDirectory, packageData) => {
    const foundImports = getAllImports(
      path.join(PACKAGES_DIRECTORY, packageDirectory),
    ).filter((foundImport) => {
      // Self reference would have been prohibited by TS, but this is just in case
      // self reference is made as a comment.
      return packageData.name !== foundImport
    })
    acc[packageData.name!] = foundImports
    return acc
  }, {} as StringRecord<Array<string>>)
  // console.log('dependencyMap', dependencyMap)

  // ———————————————————————————————————————————————————————————————————————————

  const glyphCatOnlyDependencyMap = Object.entries(dependencyMap).reduce(
    (acc, [packageName, imports]) => {
      acc[packageName] = imports.filter((imp) => allSiblingPackages.hasPackage(imp))
      return acc
    },
    {} as typeof dependencyMap
  )
  // console.log('glyphCatOnlyDependencyMap', glyphCatOnlyDependencyMap)

  // ———————————————————————————————————————————————————————————————————————————

  const aliasStore: Array<string> = []

  function getMermaidAlias(packageName: string): string {
    if (!aliasStore.includes(packageName)) {
      aliasStore.push(packageName)
      return `a${aliasStore.length}`
    } else {
      return `a${aliasStore.indexOf(packageName) + 1}`
    }
  }

  if (shouldShowGraph) {

    const flowchartBody = Object.entries(glyphCatOnlyDependencyMap).reduce((acc, [packageName, deps]) => {
      deps.forEach((dep) => {
        acc.push(`${getMermaidAlias(dep)} --> ${getMermaidAlias(packageName)}`)
      })
      return acc
    }, [] as Array<string>)

    const aliasDefinitions = aliasStore.map((packageName, index) => {
      return `a${index + 1}["${packageName}"]`
    })

    console.log('Dependency map:')
    console.log(chalk.grey([
      '```mermaid',
      'flowchart TD',
      aliasDefinitions.join('\n'),
      '',
      flowchartBody.join('\n'),
      '```',
    ].join('\n')))

  }

  // ———————————————————————————————————————————————————————————————————————————

  // then for each record, read deps -> get deps of deps recursively and store path in array
  // If array has repeating value, the a cyclic dependency is found, break loop, store error information and move on to check next sub-package
  const cyclicImportsFound = allSiblingPackages.reduce((acc, _, packageData) => {
    const cyclicImports = findCyclicImports(
      packageData.name!,
      glyphCatOnlyDependencyMap,
      [],
    )
    if (cyclicImports) {
      acc[packageData.name!] = cyclicImports
    }
    return acc
  }, {} as StringRecord<Array<string>>)
  // If no error, package name is not stored into accumulator
  // console.log('cyclicImportsFound', cyclicImportsFound)

  // TOFIX: Display chain seems to be incorrect
  if (objectIsNotEmpty(cyclicImportsFound)) {
    console.log(chalk.redBright('\nError - These packages have cyclic dependencies:'))
    Object.entries(cyclicImportsFound).forEach(([, cyclicImports]) => {
      console.log(chalk.grey(' - ') + cyclicImports.map((p, _, arr) => {
        return p === pickLast(arr) ? chalk.yellow(p) : p
      }).join(chalk.grey(' → ')))
    })
    process.exit(1)
  }

  // ———————————————————————————————————————————————————————————————————————————

  // Check if deps are listed in package.json
  const missingMentions = allSiblingPackages.reduce((acc, packageDirectory, packageData) => {
    const dependencies = dependencyMap[packageData.name!]
    const packageDependencies = Object.keys(getPackageDependencies(packageData))
    // NOTE: Version matching not required because there may be screw-ups in
    // dependent packages and we may want to fallback to earlier versions.
    // Instead, the `bump-version` script will help to update the package.json
    // in child dependencies when a package's version in bumped.
    const missingDependencies = dependencies.filter(dep => !packageDependencies.includes(dep))
    if (missingDependencies.length > 0) {
      acc[packageData.name!] = missingDependencies
    }
    return acc
  }, {} as StringRecord<Array<string>>)
  // If no error, package name is not stored into accumulator
  // `Array<string>` = names of dependencies missing in package.json
  // console.log('missingMentions', missingMentions)

  if (objectIsNotEmpty(missingMentions)) {
    const versionDictionary = removeDuplicates(
      Object.values(missingMentions).flat()
    ).reduce((acc, packageName) => {
      if (allSiblingPackages.hasPackage(packageName)) {
        const { version } = allSiblingPackages.getByName(packageName)
        acc[packageName] = version
      } else {
        const version = allRootPackageDependencies[packageName]
        acc[packageName] = version
      }
      return acc
    }, {} as StringRecord<string | undefined>)
    // console.log('versionDictionary', versionDictionary)
    console.log(chalk.redBright(`\nError - These packages have dependencies that are not mentioned ${PACKAGE_JSON}:`))
    Object.entries(missingMentions).forEach(([packageName, dependencies]) => {
      console.log(`${packageName} (${dependencies.length})`)
      console.log(chalk.yellow('```json'))
      console.log(chalk.yellowBright(dependencies.map((dep) => {
        const version = formatVersion(versionDictionary[dep])
        // console.log(`versionDictionary["${dep}"]`, versionDictionary[dep])
        // console.log('version', version)
        return `  "${dep}": "${version}",`
      }).join('\n')))
      console.log(chalk.yellow('```') + '\n')
    })
    process.exit(1)
  }

  console.log(chalk.green('✓') + ' Dependency analysis complete. No issues were found.')

}

const [, , ...args] = process.argv
run(...args)

function crawl(dirPath: string, callback: (filePath: string) => void) {
  const allItemsInDir = readdirSync(dirPath)
  for (const item of allItemsInDir) {
    const nextPath = path.join(dirPath, item)
    if (statSync(nextPath).isDirectory()) {
      crawl(nextPath, callback)
    } else {
      callback(nextPath)
    }
  }
}

function getAllImports(
  entryPoint: string,
): Array<string> {

  const ignorePattern = /\.(draft|old)\.?/
  const whitelistedFilePattern = /\.tsx?$/

  const foundImportLists: Array<Array<string>> = []
  const crawlHandler = (filePath: string) => {
    if (ignorePattern.test(filePath)) { return }
    if (!whitelistedFilePattern.test(filePath)) { return }
    const fileContents = readFileSync(filePath, Encoding.UTF_8)
    const extractedImports = fileContents.match(/(?<=from\s['"])[a-zA-Z0-9@/_-]+(?=['"])/g) ?? []
    foundImportLists.push(extractedImports)
  }

  crawl(path.join(entryPoint, 'src'), crawlHandler)
  crawl(path.join(entryPoint, 'scripts'), crawlHandler)

  const rootInstalledDeps = new Set(Object.keys(getPackageDependencies(readPackageJson(PROJECT_ROOT_DIRECTORY))))

  return removeDuplicates(foundImportLists.flat()).filter((imp) => {
    return rootInstalledDeps.has(imp) || allSiblingPackages.hasPackage(imp)
  }).sort()

}

function findCyclicImports(
  currentPackageName: string,
  dependencyMap: StringRecord<Array<string>>,
  dependencyChain: Array<string>,
): Nullable<Array<string>> {

  if (dependencyChain.includes(currentPackageName)) {
    if (currentPackageName !== pickLast(dependencyChain)) {
      return [...dependencyChain, currentPackageName]
    } else {
      // This indicates a direct self reference, which would be captured by TS compiler
      // Either that, or it is a self reference written as a comment only.
      return null
    }
  }

  const dependencies = dependencyMap[currentPackageName]
  for (const dependency of dependencies) {
    const result = findCyclicImports(
      dependency,
      dependencyMap,
      [...dependencyChain, currentPackageName],
    )
    if (result) { return result }
  }

  return null

}

function formatVersion(version: string | undefined): string {
  if (!version) { return '*' } // Early exit
  return /^\d+\.\d+\.\d+$/.test(version) ? `^${version}` : version
}
