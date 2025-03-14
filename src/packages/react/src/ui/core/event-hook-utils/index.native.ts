import { UnsupportedPlatformError } from '@glyph-cat/swiss-army-knife'

export function useKeyChordActivationListener(): void {
  throw new UnsupportedPlatformError()
}

export function useKeyDownListener(): void {
  throw new UnsupportedPlatformError()
}

export function useKeyUpListener(): void {
  throw new UnsupportedPlatformError()
}
