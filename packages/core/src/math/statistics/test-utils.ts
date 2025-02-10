import { createRef } from '../../data/ref'
import { TypedFunction } from '../../types'

type MethodName = 'sum' | 'mean' | 'median' | 'variance' | 'stddev'

export const spyFn = createRef<TypedFunction<[MethodName], void>>(null)
