import { StringRecord } from '@glyph-cat/swiss-army-knife'
import {
  createContext,
  Dispatch,
  JSX,
  ReactNode,
  SetStateAction,
  useContext,
  useId,
  useState,
} from 'react'
import { SizeAwareContainer, useSizeAwareContext } from '../../../size-aware'
import { View } from '../../core/components/view'

interface IFormLayoutItemSpec {
  titleWidth: number
  childrenWidth: number
}

interface IFormLayoutContext {
  children: StringRecord<IFormLayoutItemSpec>
}

const FormLayoutContext = createContext<Dispatch<SetStateAction<IFormLayoutContext>>>(null)

export interface FormLayoutContainerProps {
  children?: ReactNode
  /**
   * @defaultValue `'auto'`
   */
  mode?: 'regular' | 'compact' | 'auto'
}

export function FormLayoutContainer(props: FormLayoutContainerProps): JSX.Element {
  return (
    <View>
      <SizeAwareContainer>
        <FormLayoutContainerContent {...props} />
      </SizeAwareContainer>
    </View>
  )
}

function FormLayoutContainerContent({
  children,
  mode: preferredMode = 'auto',
}: FormLayoutContainerProps): JSX.Element {
  const [state, setState] = useState<IFormLayoutContext>({ children: {} })
  const bounds = useSizeAwareContext()
  const isCompact = preferredMode === 'auto'
    ? bounds.width < 800
    : preferredMode === 'compact'
  return (
    <View
      style={{
        ...(isCompact ? {} : { gridTemplateColumns: '300px 1fr' }),
        height: bounds.height,
        width: bounds.width,
        position: 'absolute',
      }}
    >
      <FormLayoutContext.Provider value={setState}>
        {children}
      </FormLayoutContext.Provider>
    </View>
  )
}

export interface FormLayoutItemProps {
  title: ReactNode
  children?: ReactNode
}

export function FormLayoutItem({
  title,
  children,
}: FormLayoutItemProps): JSX.Element {

  const id = useId()
  const setState = useContext(FormLayoutContext)
  // setState((s) => {
  //   return {
  //     ...s,
  //     children: [],
  //   }
  // })

  return (
    <>
      <View
        style={{
          // border: 'solid 1px #ff0000',
          minHeight: 24, // TODO: this has to be dynamically measured
        }}
      >
        <SizeAwareContainer>
          <Title title={title} />
        </SizeAwareContainer>
      </View>
      <View
        style={{
          // border: 'solid 1px #00a0ff',
          minHeight: 24, // TODO: this has to be dynamically measured
        }}
      >
        <SizeAwareContainer>
          <Children>{children}</Children>
        </SizeAwareContainer>
      </View>
    </>
  )
}

function Title({ title }): JSX.Element {
  const bounds = useSizeAwareContext()
  return (
    <View
      style={{
        transition: 'top 0.2s, height 0.2s',
        position: 'fixed',
        ...bounds,
      }}
    >
      {title}
    </View>
  )
}

function Children({ children }): JSX.Element {
  const bounds = useSizeAwareContext()
  return (
    <View
      style={{
        transition: 'top 0.2s, height 0.2s',
        position: 'fixed',
        ...bounds,
      }}
    >
      {children}
    </View>
  )
}
