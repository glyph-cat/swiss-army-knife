import { copyFileSync } from 'fs'

function run(): void {

  const packages = [
    'core',
    'react',
  ]

  for (const packageName of packages) {
    copyFileSync('./LICENSE', `./packages/${packageName}/LICENSE`)
    copyFileSync('./README.md', `./packages/${packageName}/README.md`)
  }

}

run()
