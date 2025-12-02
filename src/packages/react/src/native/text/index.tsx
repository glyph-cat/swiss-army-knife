import { createContext, JSX, useContext, useMemo } from 'react'
import { Text as $Text, TextProps as $TextProps } from 'react-native'

interface ITextContext {
  style: $TextProps['style']
}

const DEFAULT_TEXT_CONTEXT: ITextContext = { style: {} }

const TextContext = createContext(DEFAULT_TEXT_CONTEXT)

/**
 * @public
 */
export interface TextProps extends $TextProps {
  /**
   * @defaultValue `false`
   */
  disableInheritance?: boolean
}

/**
 * Equivalent of React Native's {@link $Text|`<Text>`} component but with style
 * inheritance when nested.
 * @public
 */
export function Text({
  disableInheritance,
  children,
  style,
  ...props
}: TextProps): JSX.Element {
  const parentContext = useContext(TextContext)
  const nextContext = useMemo<ITextContext>(() => {
    if (disableInheritance) {
      return DEFAULT_TEXT_CONTEXT
    } else {
      return {
        ...parentContext,
        style: {
          ...parentContext.style,
          ...style,
        }
      }
    }
  }, [disableInheritance, parentContext, style])
  return (
    <TextContext.Provider value={nextContext}>
      <$Text {...props}>
        {children}
      </$Text>
    </TextContext.Provider>
  )
}
