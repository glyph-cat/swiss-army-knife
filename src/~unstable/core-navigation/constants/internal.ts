import { createContext } from 'react'
import {
  ICoreNavigationBranchContext,
  ICoreNavigationBranchItemContext,
  ICoreNavigationStackContext,
  ICoreNavigationStackItemContext,
} from '../abstractions'

export const CoreNavigationBranchContext = createContext<ICoreNavigationBranchContext>(null)
export const CoreNavigationBranchItemContext = createContext<ICoreNavigationBranchItemContext>(null)
export const CoreNavigationStackContext = createContext<ICoreNavigationStackContext>(null)
export const CoreNavigationStackItemContext = createContext<ICoreNavigationStackItemContext>(null)
