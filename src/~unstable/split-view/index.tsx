import { Nullable, StringRecord } from '@glyph-cat/foundation'
import { BasicUILayout, View, ViewProps } from '@glyph-cat/swiss-army-knife-react'
import {
  Children,
  createContext,
  ForwardedRef,
  forwardRef,
  ReactElement,
  ReactNode,
  useContext,
  useImperativeHandle,
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
}

const SecretContext = createContext<Nullable<ISecretContext>>(null)

// -----------------------------------------------------------------------------

interface ISplitViewContext {
  sizes: Record<string, number | 'auto'>
  type: SplitViewType
  snap: boolean | number
}

const SplitViewContext = createContext<Nullable<ISplitViewContext>>(null)

export interface SplitViewProps extends ViewProps {
  children?: ReactNode
  key: string
}

export function SplitView({
  children,
  ...otherProps
}: SplitViewProps): ReactNode {
  const secret = useContext(SecretContext)
  const context = useContext(SplitViewContext)
  if (!secret || !context) {
    throw new Error('<SplitView> can only be used within a <SplitViewContainer>')
  }
  // console.log('context.sizes', context.sizes)
  // const size = context.sizes[secret.key] ?? (() => {
  //   throw new Error(`Missing size definition for <SplitView key="${String(secret.key)}">`)
  // })()
  const width = 0 // temp
  return (
    <View {...otherProps}>
      {children}
    </View>
  )
}

export type SplitViewType = 'relative' | 'absolute'

// relative = fixed container size
// absolute = container size changes according to content width

export interface SplitViewContainerProps extends ViewProps {
  children?: ReactNode
  sizes?: StringRecord<number | 'auto'> // default to equal proportions?
  /**
   * @defaultValue `'relative'`
   */
  type?: SplitViewType
  /**
   * @defaultValue `false`
   */
  snap?: boolean | number
  /**
   * @defaultValue `'horizontal'`
   */
  layout?: BasicUILayout
}

interface SplitViewReducedData {
  mappedChildren: Array<ReactNode>
  sizeSpecifications: Array<string>
  // sizeSpecifications: Array<`${number}%` | `${number}px` | '1fr'>
  atLeastOneChildHasRelativeWidth: boolean
  atLeastOneChildHasAbsoluteWidth: boolean
  handleNodes: Array<ReactNode>
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
  sizes: propSizes,
  type = SPLIT_VIEW_TYPE_RELATIVE,
  snap = false,
  layout = 'horizontal',
  style,
  ...viewProps
}: SplitViewContainerProps, ref: ForwardedRef<View>): ReactNode {

  const containerRef = useRef<View>(null!)
  useImperativeHandle(ref, () => containerRef.current, [])

  const [sizes, setSizes] = useState<ISplitViewContext['sizes']>(() => {
    return { ...propSizes }
  })

  // const children = Children.toArray($children) as Array<ReactElement<SplitViewProps>>
  const children = (
    Array.isArray($children) ? $children : [$children]
  ) as Array<ReactElement<SplitViewProps>>

  const {
    mappedChildren,
    handleNodes,
    sizeSpecifications,
    atLeastOneChildHasRelativeWidth,
    atLeastOneChildHasAbsoluteWidth,
  } = children.reduce(
    (acc, child, index, childArr) => {
      if (!Object.is(child?.type, SplitView)) {
        throw new Error('<SplitViewContainer> only allows <SplitView> as its direct children')
      }
      if (!child.key) {
        throw new Error('<SplitView> is missing the `key` prop')
      }
      const size = sizes[child.key] ?? (() => {
        throw new Error(`Missing size definition for <SplitView key="${String(child.key)}">`)
      })()
      // if both 'auto', first one will be absolute
      // if both absolute, last one will be auto
      acc.mappedChildren.push(
        <SecretContext key={child.key} value={{ key: child.key }}>
          {child}
        </SecretContext>
      )
      if (index < (childArr.length - 1)) {
        acc.handleNodes.push(
          <View
            key={child.key}
            style={{
              position: 'absolute',
            }}
          />
        )
      }
      acc.sizeSpecifications.push(size === AUTO
        ? '1fr'
        : (type === SPLIT_VIEW_TYPE_ABSOLUTE ? `${size}px` : `${size}%`)
      )
      return acc
    },
    {
      mappedChildren: [],
      sizeSpecifications: [],
      handleNodes: [],
      atLeastOneChildHasRelativeWidth: false,
      atLeastOneChildHasAbsoluteWidth: false,
    } as SplitViewReducedData
  )

  if (mappedChildren.length > 0) {
    if (!atLeastOneChildHasRelativeWidth) {
      sizeSpecifications[sizeSpecifications.length - 1] = '1fr'
    }
    // if (!atLeastOneChildHasAbsoluteWidth) {
    //   sizeSpecifications[0] = '1fr'
    // }
  }

  return (
    <View
      {...viewProps}
      ref={containerRef}
      style={{
        ...style,
        gridAutoFlow: layout === HORIZONTAL ? 'column' : 'row',
        ...(layout === HORIZONTAL ? {
          gridTemplateColumns: sizeSpecifications.join(' '),
        } : {
          gridTemplateRows: sizeSpecifications.join(' '),
        }),
      }}
    >
      <SplitViewContext value={{ sizes, type, snap }}>
        {mappedChildren}
        {handleNodes}
      </SplitViewContext>
    </View>
  )
})
