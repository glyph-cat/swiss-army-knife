import { isNull } from '@glyph-cat/swiss-army-knife'
import { useContext } from 'react'
import { ICoreNavigation } from '../abstractions'
import {
  CoreNavigationBranchContext,
  CoreNavigationBranchItemContext,
  CoreNavigationStackContext,
  CoreNavigationStackItemContext,
} from '../constants'

// TODO: This should eventually replace the LayeredFocus API

/**
 * @public
 */
export function useCoreNavigation(): ICoreNavigation {
  const branch = useContext(CoreNavigationBranchContext)
  const stack = useContext(CoreNavigationStackContext)
  return { branch, stack }
}

/**
 * @returns `true` if the current component has navigation focus.
 * @public
 */
export function useCoreNavigationFocusState(): boolean {
  const branchItemContext = useContext(CoreNavigationBranchItemContext)
  const stackItemContext = useContext(CoreNavigationStackItemContext)
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
