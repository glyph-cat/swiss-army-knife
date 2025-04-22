import {
  CleanupFunction,
  CSSProperties,
  isFunction,
  isNull,
  isNullOrUndefined,
  RectangularBoundary,
  serializePixelValue,
  StringRecord,
  TypedFunction,
} from '@glyph-cat/swiss-army-knife'
import {
  GenericHTMLProps,
  Portal,
  useClickAwayListener,
  useCoreNavigationBranch,
  useCoreNavigationStack,
  useKeyDownListener,
  usePointerLeaveListener,
  View,
} from '@glyph-cat/swiss-army-knife-react'
import { Property } from 'csstype'
import { __getTypeMarker, __setTypeMarker, TypeMarker } from 'packages/react/src/_internals'
import {
  Children,
  createContext,
  JSX,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

// #region Popover

type ITriggerElementContext = ReturnType<typeof useState<HTMLElement>>
const TriggerElementContext = createContext<ITriggerElementContext>(null)

export interface PopoverProps {
  children: ReactNode
}

export function Popover({ children: $children }: PopoverProps): JSX.Element {
  const stateHook = useState<HTMLElement>(null)
  const [
    triggerElement,
    ...children
  ] = Children.toArray($children) as Array<ReactElement>
  if (
    __getTypeMarker(triggerElement.type) !== TypeMarker.PopoverTrigger &&
    __getTypeMarker(triggerElement.type) !== TypeMarker.MenuTrigger // special case
  ) {
    throw new Error('The first children of <Popover> must be a <PopoverTrigger>')
  }
  return (
    <TriggerElementContext value={stateHook}>
      {triggerElement}
      <PopoverContentController>
        {children}
      </PopoverContentController>
    </TriggerElementContext>
  )
}

// #endregion Popover

// #region Popover Trigger

export interface PopoverTriggerProps {
  children: ReactNode
}

export function PopoverTrigger({
  children,
}: PopoverTriggerProps): JSX.Element {
  Children.only(children)
  const child = children as ReactElement<GenericHTMLProps>
  const { type: Component, props: { ref: propRef, ...props }, key } = child
  const [, setTriggerRef] = useContext(TriggerElementContext)
  // TODO: Allow ref to make programmatically opening/dismissing possible
  return (
    <Component
      ref={useCallback((node: HTMLElement) => {
        let cleanupRef: CleanupFunction
        setTriggerRef(node)
        if (propRef) {
          if (isFunction(propRef)) {
            cleanupRef = (propRef(node) as TypedFunction) ?? (() => { propRef(null) })
          } else {
            propRef.current = node
            cleanupRef = () => { propRef.current = null }
          }
        }
        return () => {
          setTriggerRef(null)
          cleanupRef?.()
        }
      }, [propRef, setTriggerRef])}
      // TODO data-popover-triggered={}???
      {...props as StringRecord}
      {...(isNullOrUndefined(key) ? {} : { key })}
    />
  )
}

__setTypeMarker(PopoverTrigger, TypeMarker.PopoverTrigger)

// #endregion Popover Trigger

// #region Popover Content Controller

interface PopoverContentControllerProps {
  children: ReactNode
}

function PopoverContentController({
  children,
}: PopoverContentControllerProps): JSX.Element {
  const [triggerElement] = useContext(TriggerElementContext)
  const navStack = useCoreNavigationStack()
  const navBranch = useCoreNavigationBranch()
  const isFocused = navStack.isFocused && navBranch.isFocused
  return (!isNull(triggerElement) && isFocused) && <>{children}</>
}

// #endregion Popover Content Controller

// #region Popover Content

export enum PopoverTriggerType {
  CLICK = 1,
  CONTEXT,
}

export interface PopoverContentProps {
  children: ReactElement
  /**
   * @defaultValue `'click'`
   */
  triggerEvent?: keyof HTMLElementEventMap
  shouldTrigger?(e: Event): boolean
  /**
   * @defaultValue `'block-end'`
   */
  position?: PopoverContentPosition
  /**
   * @defaultValue `'center'`
   */
  align?: PopoverContentAlignment
  /**
   * @defaultValue `10`
   */
  offset?: Property.Margin<number>
  /**
   * Additional offset for the secondary direction.
   * Only applicable when align is not `'center'`.
   * @defaultValue `0`
   */
  sideOffset?: Property.Margin<number>
  /**
   * @defaultValue `true`
   */
  dismissOnClickAway?: boolean
  /**
   * @defaultValue `false`
   */
  dismissOnPointerLeave?: boolean
  /**
   * @defaultValue `true`
   */
  dismissOnEscape?: boolean
}

export type PopoverContentPosition =
  | 'block-start'
  | 'block-end'
  | 'inline-start'
  | 'inline-end'

export type PopoverContentAlignment = 'start' | 'center' | 'end'

export function PopoverContent({
  children,
  triggerEvent = 'click',
  shouldTrigger,
  position = 'block-end',
  align = 'center',
  offset = 10,
  sideOffset = 0,
  dismissOnClickAway = true,
  dismissOnPointerLeave = false,
  dismissOnEscape = true,
}: PopoverContentProps): JSX.Element {

  const [anchorBounds, setAnchorBounds] = useState<RectangularBoundary>(null)
  const [shouldShowMenu, setMenuVisibility] = useState(false)
  const [triggerElement] = useContext(TriggerElementContext)
  useEffect(() => {
    if (!triggerElement) { return }
    const onActivation = (e: Event) => {
      // If `shouldTrigger` is not provided or if it evaluates to `true`:
      if (!shouldTrigger || shouldTrigger(e)) {
        setMenuVisibility(true)
        setAnchorBounds(getElementBound(triggerElement))
        e.preventDefault()
      }
    }
    triggerElement.addEventListener(triggerEvent, onActivation)
    return () => { triggerElement.removeEventListener(triggerEvent, onActivation) }
  }, [shouldTrigger, triggerEvent, triggerElement])

  useEffect(() => {
    if (!shouldShowMenu) { return } // Early exit
    const onClick = () => { setMenuVisibility(false) }
    triggerElement.addEventListener('click', onClick)
    return () => { triggerElement.removeEventListener('click', onClick) }
  }, [shouldShowMenu, triggerElement])

  const triggerElementRef = useRef<typeof triggerElement>(null)
  triggerElementRef.current = triggerElement

  useClickAwayListener(() => {
    setMenuVisibility(false)
  }, [], triggerElementRef, dismissOnClickAway)

  usePointerLeaveListener(() => {
    setMenuVisibility(false)
  }, [], triggerElementRef, dismissOnPointerLeave)

  useKeyDownListener((e) => {
    if (e.key === 'Escape') {
      setMenuVisibility(false)
    }
  }, [], dismissOnEscape)

  const viewRef = useRef<View>(null)
  const [contentBound, setContentBound] = useState<RectangularBoundary>(null)
  useLayoutEffect(() => {
    if (!shouldShowMenu) { return } // Early exit
    setTimeout(() => {
      setContentBound(getElementBound(viewRef.current))
    })
    return () => { setContentBound(null) }
  }, [setContentBound, shouldShowMenu])

  if (!shouldShowMenu) { return null } //Early exit

  return (
    <Portal>
      <View
        ref={viewRef}
        style={{
          ...resolvePopoverStyle(
            anchorBounds,
            contentBound,
            position,
            align,
            offset,
            sideOffset,
          ),
          position: 'fixed',
          zIndex: 1,
        }}
      >
        {children}
      </View>
    </Portal>
  )

}

function resolvePopoverStyle(
  anchorBounds: RectangularBoundary,
  contentBound: RectangularBoundary,
  position: PopoverContentPosition,
  align: PopoverContentAlignment,
  offset: Property.Margin<number>,
  sideOffset: Property.Margin<number>,
): CSSProperties {
  if (!contentBound) {
    return {
      opacity: 0,
      pointerEvents: 'none',
    } // Early exit
  }
  // TODO: auto align if exceed screen visible area
  const serializedSideOffset = (align === 'start' ? '-' : '') + serializePixelValue(align !== 'center' ? sideOffset : 0)
  switch (position) {
    case 'block-start': return {
      top: `calc(${anchorBounds.top - contentBound.height}px - ${serializePixelValue(offset)})`,
      left: `calc(${anchorBounds.left + getHorizontalAlignOffset(
        align,
        anchorBounds,
        contentBound,
      )}px - ${serializedSideOffset})`,
    }
    case 'block-end': return {
      top: `calc(${anchorBounds.top + anchorBounds.height}px + ${serializePixelValue(offset)})`,
      left: `calc(${anchorBounds.left + getHorizontalAlignOffset(
        align,
        anchorBounds,
        contentBound,
      )}px - ${serializedSideOffset})`,
    }
    case 'inline-start': return {
      left: `calc(${anchorBounds.left - contentBound.width}px - ${serializePixelValue(offset)})`,
      top: `calc(${anchorBounds.top + getVerticalAlignOffset(
        align,
        anchorBounds,
        contentBound,
      )}px - ${serializedSideOffset})`,
    }
    case 'inline-end': return {
      // marginInlineStart: offset,
      left: `calc(${anchorBounds.left + anchorBounds.width}px + ${serializePixelValue(offset)})`,
      top: `calc(${anchorBounds.top + getVerticalAlignOffset(
        align,
        anchorBounds,
        contentBound,
      )}px - ${serializedSideOffset})`,
    }
    default: throw new Error(`Invalid position "${position}"`)
  }
}

function getHorizontalAlignOffset(
  align: PopoverContentAlignment,
  anchorBounds: RectangularBoundary,
  contentBound: RectangularBoundary,
): number {
  if (align === 'start') {
    return 0
  } else if (align === 'end') {
    return anchorBounds.width - contentBound.width
  } else {
    return (anchorBounds.width - contentBound.width) / 2
  }
}

function getVerticalAlignOffset(
  align: PopoverContentAlignment,
  anchorBounds: RectangularBoundary,
  contentBound: RectangularBoundary,
): number {
  if (align === 'start') {
    return 0
  } else if (align === 'end') {
    return anchorBounds.height - contentBound.height
  } else {
    return (anchorBounds.height - contentBound.height) / 2
  }
}

function getElementBound(element: HTMLElement): RectangularBoundary {
  if (!element) { return null }
  const { left, top, width, height } = element.getBoundingClientRect()
  return { left, top, width, height }
}

// #endregion Popover Content
