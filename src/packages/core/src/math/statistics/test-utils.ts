import { createRef, TypedFunction } from '@glyph-cat/foundation'

type MethodName = 'sum' | 'mean' | 'median' | 'variance' | 'stddev'

export const spyFn = createRef<TypedFunction<[MethodName], void>>(null)
