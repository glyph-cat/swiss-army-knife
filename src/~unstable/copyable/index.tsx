import { NullableRefObject } from '@glyph-cat/foundation'
import { Forward } from '@glyph-cat/swiss-army-knife-react'
import ClipboardJS from 'clipboard'
import { hasProperty } from 'packages/core/src/data/object/property'
import { Nullable } from 'packages/foundation/src/nullable'
import { StringRecord } from 'packages/foundation/src/records'
import {
  createContext,
  JSX,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

interface ICopyableContext {
  isCopied: boolean
  elementRef: NullableRefObject<HTMLElement>
}

const CopyableContext = createContext<Nullable<ICopyableContext>>(null)

export interface CopyableProps {
  children: ReactNode
  copyButton?: ReactNode
}

export function Copyable({
  children,
  copyButton: CustomCopyButton,
}: CopyableProps): JSX.Element {

  const [isCopied, setCopiedState] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  // useEffect(() => {
  //   const target = elementRef.current
  //   if (!target) { return }
  //   let timeoutRef: ReturnType<typeof setTimeout>
  //   const onClick = () => {
  //     setCopiedState(true)
  //     timeoutRef = setTimeout(() => {
  //       setCopiedState(false)
  //     }, 3000)
  //   }
  //   target.addEventListener('click', onClick)
  //   return () => {
  //     target.removeEventListener('click', onClick)
  //     clearTimeout(timeoutRef)
  //   }
  // }, [])

  useEffect(() => {
    const target = elementRef.current
    if (!target) { return }
    const onClick = () => { ClipboardJS.copy(elementRef.current?.textContent ?? '') }
    target.addEventListener('click', onClick)
    return () => { target.removeEventListener('click', onClick) }
  }, [])

  const contextValue = useMemo(() => ({
    isCopied,
    elementRef,
  }), [isCopied])

  return (
    <CopyableContext.Provider value={contextValue}>
      <Forward ref={elementRef} displayName='Copyable'>
        {children}
      </Forward>
      {/* {CustomCopyButton ?? <DefaultCopyButton />} */}
    </CopyableContext.Provider>
  )
}

export function useCopyableContext(): ICopyableContext {
  const context = useContext(CopyableContext)
  if (!context) {
    throw new Error('useCopyableContext can only be used inside a <CopyableContext>')
  }
  return context
}

function DefaultCopyButton(): ReactNode {
  const { isCopied, elementRef } = useCopyableContext()!
  return (
    <button
      onClick={useCallback(() => {
        ClipboardJS.copy(elementRef.current?.textContent ?? '')
      }, [elementRef])}
    >
      {isCopied ? 'copied' : 'copy'}
    </button>
  )
}
