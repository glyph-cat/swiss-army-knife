import { isNull } from '@glyph-cat/swiss-army-knife'
import { useContext } from 'react'
import { IVirtualNavigation } from '../abstractions'
import {
  VirtualNavigationBranchContext,
  VirtualNavigationBranchItemContext,
  VirtualNavigationStackContext,
  VirtualNavigationStackItemContext,
} from '../constants'

// TODO: This should eventually replace the LayeredFocus API

/**
 * @public
 */
export function useVirtualNavigation(): IVirtualNavigation {
  const branch = useContext(VirtualNavigationBranchContext)
  const stack = useContext(VirtualNavigationStackContext)
  return { branch, stack }
}

/**
 * @returns `true` if the current component has navigation focus.
 * @public
 */
export function useVirtualNavigationFocusState(): boolean {
  const branchItemContext = useContext(VirtualNavigationBranchItemContext)
  const stackItemContext = useContext(VirtualNavigationStackItemContext)
  if (isNull(stackItemContext)) {
    if (isNull(branchItemContext)) {
      // Do not restrict focus if is in neither context.
      return true
    } else {
      return branchItemContext.isFocused
    }
  } else {
    if (isNull(branchItemContext)) {
      return stackItemContext.isFocused
    } else {
      // Restrict focus based on both context, since both are available.
      return stackItemContext.isFocused && branchItemContext.isFocused
    }
  }
}
