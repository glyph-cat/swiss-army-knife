import { copyFileSync } from 'fs'

function main(): void {

  const packages = [
    'core',
    'react',
  ]

  for (const packageName of packages) {
    copyFileSync('./LICENSE', `./src/packages/${packageName}/LICENSE`)
    copyFileSync('./README.md', `./src/packages/${packageName}/README.md`)
  }

}

main()
