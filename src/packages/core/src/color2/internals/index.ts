import { createRef } from '@glyph-cat/foundation'

export const rgbConstructorSpyRef = createRef<ReturnType<typeof jest.fn>>(null)

export const hexConstructorSpyRef = createRef<ReturnType<typeof jest.fn>>(null)

export const hslConstructorSpyRef = createRef<ReturnType<typeof jest.fn>>(null)
