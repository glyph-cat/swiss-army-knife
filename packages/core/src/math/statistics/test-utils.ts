import { RefObject, TypedFunction } from '../../types'

type MethodName = 'sum' | 'mean' | 'median' | 'variance' | 'stddev'

export const spyFn: RefObject<TypedFunction<[MethodName], void>> = { current: null }
