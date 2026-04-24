import { createRef, InternalError } from '@glyph-cat/foundation'
import { IS_PRODUCTION_TARGET } from '../constants'

export const rgbConstructorSpyRef = createRef<ReturnType<typeof jest.fn>>(null)

export const hexConstructorSpyRef = createRef<ReturnType<typeof jest.fn>>(null)

export const hslConstructorSpyRef = createRef<ReturnType<typeof jest.fn>>(null)

export const rgbToStringSpyRef = createRef<ReturnType<typeof jest.fn>>(null)

export const hexToStringSpyRef = createRef<ReturnType<typeof jest.fn>>(null)

export const hslToStringSpyRef = createRef<ReturnType<typeof jest.fn>>(null)

export function throwInternalError(error: string | InternalError): never {
  console.error('This is most likely an internal software bug, please consider making a report at https://github.com/glyph-cat/swiss-army-knife/issues')
  if (error instanceof InternalError) {
    throw error
  } else {
    throw new InternalError(error)
  }
}

export function devError(...args: Parameters<typeof console.error>): void {
  if (IS_PRODUCTION_TARGET !== true) {
    console.error(...args)
  }
}
