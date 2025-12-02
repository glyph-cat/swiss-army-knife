import { TypedFunction } from '@glyph-cat/foundation'
import { createRef } from '../../data/ref'

type MethodName = 'sum' | 'mean' | 'median' | 'variance' | 'stddev'

export const spyFn = createRef<TypedFunction<[MethodName], void>>(null)
