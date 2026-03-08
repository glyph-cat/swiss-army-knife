import {
  createRef,
  InternalError,
  Nullable,
  NullableRefObject,
  RefObject,
  StringRecord,
  Value2D,
} from '@glyph-cat/foundation'
import {
  BasicUILayout,
  Forward,
  useMergedRefs,
  View,
  ViewProps,
} from '@glyph-cat/swiss-army-knife-react'
import { isNumber } from '@glyph-cat/type-checking'
import {
  Children,
  createContext,
  ForwardedRef,
  forwardRef,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

const SPLIT_VIEW_TYPE_RELATIVE = 'relative'
const SPLIT_VIEW_TYPE_ABSOLUTE = 'absolute'
const AUTO = 'auto'
const HORIZONTAL = 'horizontal'
const VERTICAL = 'vertical'

export type Arrayish<T> = T | Array<T>

export type AsArray<T> = T extends Array<unknown> ? T : Array<T>

// -----------------------------------------------------------------------------

interface ISecretContext {
  key: string
  // index: number
}

const SecretContext = createContext<Nullable<ISecretContext>>(null)

interface ISplitViewContext {
  sizes: Exclude<SplitViewContainerProps['sizes'], undefined>
  layout: BasicUILayout
  snap: boolean | number
  viewRefs: StringRecord<NullableRefObject<View>>
}

const SplitViewContext = createContext<Nullable<ISplitViewContext>>(null)

// function useInternalContext(
//   component: 'SplitView' | 'SplitViewHandle'
// ): [ISplitViewContext, ISecretContext] {
//   const context = useContext(SplitViewContext)
//   const secret = useContext(SecretContext)
//   if (!context || !secret) {
//     throw new Error(`<${component}> only be used within a <SplitViewContainer>`)
//   }
//   return [context, secret]
// }

// -----------------------------------------------------------------------------

export interface SplitViewProps extends ViewProps {
  children?: ReactNode
  key: string
}

export const SplitView = forwardRef(function SplitView({
  children,
  style,
  ...otherProps
}: SplitViewProps, ref: ForwardedRef<View>): ReactNode {
  const context = useContext(SplitViewContext)
  const secret = useContext(SecretContext)
  if (!context || !secret) {
    throw new Error('<SplitView> only be used within a <SplitViewContainer>')
  }
  const viewRef = useMergedRefs(
    useRef<View>(null),
    ref,
    (node) => {
      if (!context.viewRefs[secret.key]) {
        // eslint-disable-next-line react-hooks/immutability
        context.viewRefs[secret.key] = createRef(null)
      }
      context.viewRefs[secret.key].current = node
    },
  )
  const size = context.sizes[secret.key]
  // const size = context.sizes[secret.key] ?? (() => {
  //   throw new Error(`Missing size definition for <SplitView key="${String(secret.key)}">`)
  // })()
  return (
    <View
      {...otherProps}
      ref={viewRef}
      style={{
        ...style,
        [context.layout === HORIZONTAL
          ? 'width'
          : 'height'
        ]: size !== 'auto' ? size : '1fr',
      }}
    >
      {children}
    </View>
  )
})

// -----------------------------------------------------------------------------

// export type SplitViewType = 'ratio' | 'fixed'

export interface SplitViewContainerProps extends ViewProps {
  children?: ReactNode
  // sizes?: StringRecord<number | 'auto'> // default to equal proportions?
  sizes?: StringRecord<number | `${number}%` | 'auto'>
  //               < absolute |   relative   | '1fr' >
  /**
   * @defaultValue `false`
   */
  snap?: boolean | number
  /**
   * @defaultValue `'horizontal'`
   */
  layout?: BasicUILayout
  handle?: ReactElement
}

interface SplitViewReducedData {
  childNodes: Array<ReactNode>
  handleNodes: Array<ReactNode>
  childCountByType: {
    absolute: number
    relative: number
    auto: number
  }
}

// size can be any arbitrary value, but when onChange we pass back a value that is calculated from current size ÷ container size

// Kiv: be mindful of padding and gap?

// TODO: This can be a separate helper

export function ChildrenReduce<C, U>(
  children: Array<C>,
  callbackFn: (accumulator: U, child: C, index: number) => U,
  accumulator: U,
): U {
  Children.forEach(children, (child, index) => {
    accumulator = callbackFn(accumulator, child, index)
  })
  return accumulator
}

export const SplitViewContainer = forwardRef(function SplitViewContainer({
  children: $children,
  sizes = {},
  snap = false,
  layout = 'horizontal',
  style,
  handle,
  ...viewProps
}: SplitViewContainerProps, ref: ForwardedRef<View>): ReactNode {

  const { current: viewRefs } = useRef<StringRecord<RefObject<View>>>({})
  const containerRef = useRef<View>(null!)
  useImperativeHandle(ref, () => containerRef.current, [])

  const children = (
    Array.isArray($children) ? $children : [$children]
  ) as Array<ReactElement<SplitViewProps>>

  const {
    childNodes: mappedChildren,
    handleNodes,
    childCountByType,
  } = children.reduce(
    (acc, child, index, childArr) => {
      if (!Object.is(child?.type, SplitView)) {
        throw new Error('<SplitViewContainer> only allows <SplitView> as its direct children')
      }
      if (!child.key) {
        throw new Error('<SplitView> is missing the `key` prop')
      }
      // If size not specified, assume is `[1, 'auto']`
      const size = sizes[child.key] ?? (() => {
        throw new Error(`Missing size definition for <SplitView key="${String(child.key)}">`)
      })()
      if (isNumber(size)) {
        acc.childCountByType.absolute += 1
      } else if (size.endsWith('%')) {
        acc.childCountByType.relative += 1
      } else if (size === 'auto') {
        acc.childCountByType.auto += 1
      }
      acc.childNodes.push(
        <SecretContext key={child.key} value={{ key: child.key }}>
          {child}
        </SecretContext>
      )
      if (index < (childArr.length - 1)) {
        acc.handleNodes.push(
          <SecretContext key={child.key} value={{ key: child.key }}>
            <SplitViewHandle element={handle || DEFAULT_HANDLE} />
          </SecretContext>
        )
      }
      return acc
    },
    {
      childNodes: [],
      handleNodes: [],
      childCountByType: {
        absolute: 0,
        relative: 0,
        auto: 0,
      }
    } as SplitViewReducedData
  )

  if (mappedChildren.length > 1) {
    if (childCountByType.auto <= 0) {
      throw new Error('[SplitViewContainer] At least one size definition must be \'auto\'')
    }
    if ((childCountByType.absolute + childCountByType.relative) <= 0) {
      throw new Error('[SplitViewContainer] At least one size definition must be a number or `${number}%`')
    }
  }

  return (
    <View
      {...viewProps}
      ref={containerRef}
      style={{
        ...style,
        gridAutoFlow: layout === HORIZONTAL ? 'column' : 'row',
        [layout === HORIZONTAL
          ? 'gridTemplateColumns'
          : 'gridTemplateRows'
        ]: 'max-content',
      }}
    >
      <SplitViewContext value={{ sizes, layout, snap, viewRefs }}>
        {mappedChildren}
        {handleNodes}
      </SplitViewContext>
    </View>
  )
})

// -----------------------------------------------------------------------------

interface SplitViewHandleProps {
  element: ReactElement
}

function SplitViewHandle({
  element,
}: SplitViewHandleProps): ReactNode {

  const context = useContext(SplitViewContext)
  if (!context) {
    throw new InternalError('[SplitView] Internal container context is missing')
  }
  const secret = useContext(SecretContext)
  if (!secret) {
    throw new InternalError('[SplitView] Internal context is missing')
  }

  const isHorizontal = context.layout === HORIZONTAL

  const handleRef = useRef<View>(null)
  const elementRef = useRef<View>(null)

  useEffect(() => {
    let pointerDownPosition: Nullable<Value2D> = null
    let pointerDragPosition: Nullable<Value2D> = null
    const onPointerDown = (e: PointerEvent) => {
      if (!handleRef.current) { return }
      if (
        Object.is(e.target, elementRef.current) ||
        Object.is(e.target, handleRef.current)
      ) {
        pointerDownPosition = { x: e.clientX, y: e.clientY }
        console.log('Pointer Down')
        e.preventDefault()
      }
    }
    const onPointerUp = () => {
      if (!pointerDownPosition) { return }
      pointerDownPosition = null
      pointerDragPosition = null
      console.log('Pointer Up')
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!pointerDownPosition) { return }
      pointerDragPosition = { x: e.clientX, y: e.clientY }
      const delta = isHorizontal
        ? pointerDragPosition.x - pointerDownPosition.x
        : pointerDragPosition.y - pointerDownPosition.y
      // TODO: Need to find a way to get numeric widths of all views then + delta
      // context.sizes[secret.key]
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointermove', onPointerMove)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [isHorizontal])

  const [startPosition, setStartPosition] = useState<Nullable<number>>(null)
  useLayoutEffect(() => {
    const splitView = context.viewRefs[secret.key].current
    const handleElement = elementRef.current
    if (!splitView || !handleElement) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStartPosition(null)
      return
    }
    const clientWidth = getDisplayNoneElementWidth(handleElement)
    setStartPosition(splitView.offsetLeft - (clientWidth / 2))
    // const bounds = context.viewRefs[secret.key]?.current?.getBoundingClientRect()
    // if (bounds?.left) {
    //   // eslint-disable-next-line react-hooks/set-state-in-effect
    //   setStartPosition(bounds.left)
    // }
    // console.log('x', context.viewRefs, secret.key, context.viewRefs[secret.key]?.current?.getBoundingClientRect().toJSON())
  }, [context.viewRefs, secret.key])

  return (
    <View
      ref={handleRef}
      style={{
        [isHorizontal ? 'height' : 'width']: '100%',
        position: 'absolute',
        ...(isNumber(startPosition) ? {
          // KIV: RTL?
          [isHorizontal ? 'left' : 'top']: startPosition,
        } : {
          display: 'none',
        }),
        // transform: `translate${isHorizontal ? 'X' : 'Y'}(${previewDelta}px)`,
      }}
    >
      <Forward ref={elementRef}>
        {element}
      </Forward>
    </View>
  )
}

const DEFAULT_HANDLE = (
  <View
    style={{
      backgroundColor: '#80808040',
      width: 10,
    }}
  />
)

function getDisplayNoneElementWidth(element: HTMLElement): number {
  const spyElement = element.cloneNode() as HTMLElement
  const spyContainer = document.createElement('div')
  spyContainer.style.opacity = '0'
  spyContainer.style.zIndex = '-9999'
  spyContainer.style.position = 'fixed'
  document.body.append(spyContainer)
  spyElement.style.display = 'block'
  spyContainer.append(spyElement)
  const spiedWidth = spyElement.clientWidth
  spyContainer.remove()
  return spiedWidth
}
