import { createRef } from '@glyph-cat/foundation'

export const rgbConstructorSpyRef = createRef<ReturnType<typeof jest.fn>>(null)

export const hexConstructorSpyRef = createRef<ReturnType<typeof jest.fn>>(null)

export const hslConstructorSpyRef = createRef<ReturnType<typeof jest.fn>>(null)

export const rgbToStringSpyRef = createRef<ReturnType<typeof jest.fn>>(null)

export const hexToStringSpyRef = createRef<ReturnType<typeof jest.fn>>(null)

export const hslToStringSpyRef = createRef<ReturnType<typeof jest.fn>>(null)
