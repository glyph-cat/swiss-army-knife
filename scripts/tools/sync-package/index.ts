import { copyFileSync } from 'fs'

export function syncPackage(): void {
  copyFileSync('../../../LICENSE', `./LICENSE`)
  copyFileSync('../../../README.md', `./README.md`)
}
