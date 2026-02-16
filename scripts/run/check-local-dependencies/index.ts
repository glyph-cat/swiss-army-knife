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
import { PACKAGES_DIRECTORY } from '../../constants'

function run(): void {

  console.log('Analyzing dependencies...')

  // ———————————————————————————————————————————————————————————————————————————

  // Get all package directory name and NPM name
  const allPackages = getSiblingPackages()
  const allPackageEntries = Object.entries(allPackages)
  // console.log('allPackageEntries', allPackageEntries)

  // ———————————————————————————————————————————————————————————————————————————

  // Find all imports by crawling through every file
  const dependencyMap = allPackageEntries.reduce((acc, [packageDirectory, packageName]) => {
    const foundImports = getAllGlyphCatImports(
      path.join(PACKAGES_DIRECTORY, packageDirectory)
    ).filter((foundImport) => {
      // Self reference would have been prohibited by TS, but this is just in case
      // self reference is made as a comment.
      return packageName !== foundImport
    })
    acc[packageName] = foundImports
    return acc
  }, {} as StringRecord<Array<string>>)
  // console.log('dependencyMap', dependencyMap)

  // ———————————————————————————————————————————————————————————————————————————

  const aliasStore: Array<string> = []

  function getAlias(packageName: string): string {
    if (!aliasStore.includes(packageName)) {
      aliasStore.push(packageName)
      return `a${aliasStore.length}`
    } else {
      return `a${aliasStore.indexOf(packageName) + 1}`
    }
  }

  const flowchartBody = Object.entries(dependencyMap).reduce((acc, [packageName, deps]) => {
    deps.forEach((dep) => {
      acc.push(`${getAlias(dep)} --> ${getAlias(packageName)}`)
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

  // ———————————————————————————————————————————————————————————————————————————

  // then for each record, read deps -> get deps of deps recursively and store path in array
  // If array has repeating value, the a cyclic dependency is found, break loop, store error information and move on to check next sub-package
  const cyclicImportsFound = allPackageEntries.reduce((acc, [, packageName]) => {
    const cyclicImports = findCyclicImports(packageName, dependencyMap, [])
    if (cyclicImports) {
      acc[packageName] = cyclicImports
    }
    return acc
  }, {} as StringRecord<Array<string>>)
  // If no error, package name is not stored into accumulator
  // console.log('cyclicImportsFound', cyclicImportsFound)

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
  const missingMentions = allPackageEntries.reduce((acc, [packageDirectory, packageName]) => {
    const dependencies = dependencyMap[packageName]
    const packageDependencies = getPackageDependencies(
      readPackageJson(path.join(PACKAGES_DIRECTORY, packageDirectory))
    )
    // NOTE: Version matching not required because there may be screw-ups in
    // dependent packages and we may want to fallback to earlier versions.
    // Instead, the `bump-version` script will help to update the package.json
    // in child dependencies when a package's version in bumped.
    const missingDependencies = dependencies.filter(dep => !packageDependencies.includes(dep))
    if (missingDependencies.length > 0) {
      acc[packageName] = missingDependencies
    }
    return acc
  }, {} as StringRecord<Array<string>>)
  // If no error, package name is not stored into accumulator
  // `Array<string>` = names of dependencies missing in package.json

  if (objectIsNotEmpty(missingMentions)) {
    const versionDictionary = removeDuplicates(
      Object.values(missingMentions).flat()
    ).reduce((acc, packageName) => {
      const packageDirectory = allPackageEntries.find(([_, entryPackageName]) => {
        return packageName === entryPackageName
      })![0]
      const { version } = readPackageJson(path.join(PACKAGES_DIRECTORY, packageDirectory))
      acc[packageName] = version
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

}

run()

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

function getAllGlyphCatImports(entryPoint: string): Array<string> {

  const ignorePattern = /\.(draft|old)\.?/
  const whitelistedFilePattern = /\.(j|t)sx?$/

  const foundImportLists: Array<Array<string>> = []
  const crawlHandler = (filePath: string) => {
    if (ignorePattern.test(filePath)) { return }
    if (!whitelistedFilePattern.test(filePath)) { return }
    const fileContents = readFileSync(filePath, Encoding.UTF_8)
    const extractedGlyphCatImports = extractGlyphCatImports(fileContents)
    foundImportLists.push(extractedGlyphCatImports)
  }

  crawl(path.join(entryPoint, 'src'), crawlHandler)
  crawl(path.join(entryPoint, 'scripts'), crawlHandler)

  return removeDuplicates(foundImportLists.flat())

}

function extractGlyphCatImports(sourceCode: string): Array<string> {
  return /from '@glyph-cat\/.+'/g.exec(sourceCode)?.map((y) => {
    const suffix = 'from \''
    return y.substring(suffix.length, y.length - 1)
  }) ?? []
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
