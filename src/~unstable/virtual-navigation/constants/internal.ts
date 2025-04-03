import { createContext } from 'react'
import {
  IVirtualNavigationBranchContext,
  IVirtualNavigationBranchItemContext,
  IVirtualNavigationStackContext,
  IVirtualNavigationStackItemContext,
} from '../abstractions'

export const VirtualNavigationBranchContext = createContext<IVirtualNavigationBranchContext>(null)
export const VirtualNavigationBranchItemContext = createContext<IVirtualNavigationBranchItemContext>(null)
export const VirtualNavigationStackContext = createContext<IVirtualNavigationStackContext>(null)
export const VirtualNavigationStackItemContext = createContext<IVirtualNavigationStackItemContext>(null)
