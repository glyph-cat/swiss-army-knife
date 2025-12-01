import { createContext } from 'react'
import { getContext } from './get'

/**
 * @internal
 */
export const GCContext = createContext(getContext(false))
