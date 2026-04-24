import { useEffect, useState } from 'react'

/**
 * @public
 */
export function useDocumentFocus(): boolean {
  const [isFocused, setFocusState] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFocusState(document.hasFocus())
    const onFocus = () => { setFocusState(true) }
    const onBlur = () => { setFocusState(false) }
    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
    }
  }, [])
  return isFocused
}
