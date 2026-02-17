import { UnsupportedPlatformError } from '@glyph-cat/foundation'

export function useKeyChordActivationListener(): void {
  throw new UnsupportedPlatformError()
}

export function useKeyDownListener(): void {
  throw new UnsupportedPlatformError()
}

export function useKeyUpListener(): void {
  throw new UnsupportedPlatformError()
}
