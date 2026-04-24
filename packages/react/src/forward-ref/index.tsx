import { BuildType, PossiblyUndefined } from '@glyph-cat/foundation'
import { devError, devWarn, TemplateStyles } from '@glyph-cat/swiss-army-knife'
import {
  Children,
  createElement,
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  Ref,
  useImperativeHandle,
  useRef,
} from 'react'
import { BUILD_TYPE } from '../constants'
import { useMergedRefs } from '../merge-refs'

/**
 * @public
 */
export interface ForwardProps<T> {
  ref?: Ref<T>
  children?: ReactNode
  /**
   * @defaultValue `false`
   */
  byMerging?: boolean
  /**
   * Override the name displayed when logging warnings/errors from this component.
   * This is meant for library authors only.
   *
   * This interface should be extended as this property would not be included in
   * the final bundle.
   * @internal
   */
  displayName?: string
}

/**
 * @public
 */
export const Forward = forwardRef(function Forward<T>({
  children,
  byMerging,
  displayName,
}: ForwardProps<T>, ref: ForwardedRef<T>): ReactNode {
  // If display name is provided, assume component is used by library author
  // who is supposed to be aware that `byMerging` is not required in RN.
  if (BUILD_TYPE === BuildType.RN && !displayName) {
    const trailingMessage = ' in React Native, as it is the only possible way to forward refs. The prop can be omitted here will still always be treated as `true`.'
    if (byMerging) {
      devWarn('`byMerging` prop is not needed' + trailingMessage)
    } else {
      devError('`byMerging` prop cannot be `false`' + trailingMessage)
    }
  }
  if (BUILD_TYPE === BuildType.RN || byMerging) {
    return (
      <ForwardByMergingRefs ref={ref}>
        {children}
      </ForwardByMergingRefs>
    )
  } else {
    // Finding DOM element is preferred as it is more versatile and safer since
    // it does not intercept or modify the props, nor does it reconstruct a new
    // element instance.
    // TODO: Check if this part is excluded from React Native bundle.
    return (
      <ForwardByFindingDOMElement ref={ref} displayName={displayName}>
        {children}
      </ForwardByFindingDOMElement>
    )
  }
})

const ForwardByMergingRefs = forwardRef(function ForwardByMergingRefs<T>(
  { children: $children }: PropsWithChildren,
  ref: ForwardedRef<T>,
): ReactNode {
  const children = Children.only($children) as ReactElement<{ ref: Ref<T> }>
  const mergedRef = useMergedRefs(ref, children.props.ref)
  return createElement(children.type, {
    ...children.props,
    ref: mergedRef,
  })
})

interface ForwardByFindingDOMElementProps extends PropsWithChildren {
  displayName: PossiblyUndefined<string>
}

const ForwardByFindingDOMElement = forwardRef(function ForwardByFindingDOMElement<T>(
  { children, displayName }: ForwardByFindingDOMElementProps,
  ref: ForwardedRef<T>,
): ReactNode {
  const leadingRef = useRef<HTMLDivElement>(null)
  const trailingRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => {
    const candidate = leadingRef.current?.nextElementSibling
    if (!candidate) { return null as T }
    if (Object.is(candidate, trailingRef.current)) { return null as T }
    if (!Object.is(candidate.nextElementSibling, trailingRef.current)) {
      if (leadingRef.current) {
        leadingRef.current.outerHTML = '<!-- Please inspect below this line -->'
      }
      if (trailingRef.current) {
        trailingRef.current.outerHTML = '<!-- Please inspect above this line -->'
      }
      const errorMessage = `<${displayName || 'Forward'}> can only have one DOM element child`
      console.error(errorMessage, candidate.parentElement)
      throw new Error(errorMessage)
    }
    return candidate as T
  }, [displayName])
  return (
    <>
      <i
        ref={leadingRef}
        className={TemplateStyles.display_none}
      // dangerouslySetInnerHTML={{ __html: '<!-- Forward boundary start -->' }}
      />
      {children}
      <i
        ref={trailingRef}
        className={TemplateStyles.display_none}
      // dangerouslySetInnerHTML={{ __html: '<!-- Forward boundary end -->' }}
      />
    </>
  )
})

function formatCandidateName(candidate: Element): string {
  if (candidate) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (candidate.tagName || candidate.nodeName || (candidate as any).name).toLowerCase()
  } else {
    return String(candidate)
  }
}
