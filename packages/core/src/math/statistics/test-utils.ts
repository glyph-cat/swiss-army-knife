import { createRef, Fn } from '@glyph-cat/foundation'

type MethodName = 'sum' | 'mean' | 'median' | 'variance' | 'stddev'

export const spyFn = createRef<Fn<[MethodName], void>>(null)
