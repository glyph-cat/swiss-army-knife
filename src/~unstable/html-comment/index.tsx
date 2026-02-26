import { forceUpdateReducer } from '@glyph-cat/swiss-army-knife-react'
import {
  Component,
  ErrorInfo,
  JSX,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useReducer,
} from 'react'
import { reactStaticSanitizeHTMLString } from '~unstable/react-sanitize'

// Inspired by https://stackoverflow.com/a/77161592/5810737

// KIV: NotFoundError "Failed to execute 'removeChild' on 'Node'" will be thrown
// This happens during unmounting.

export interface HTMLCommentProps {
  children?: unknown
}

export function HTMLComment({
  children,
}: HTMLCommentProps): JSX.Element {
  const [key, onError] = useReducer(forceUpdateReducer, 0)
  return (
    <HTMLCommentErrorBoundary key={key} onError={onError}>
      <HTMLCommentBase>{children}</HTMLCommentBase>
    </HTMLCommentErrorBoundary>
  )
}

interface HTMLCommentErrorBoundaryProps extends PropsWithChildren {
  onError(): void
}

interface HTMLCommentErrorBoundaryState {
  error: boolean
}

class HTMLCommentErrorBoundary extends Component<HTMLCommentErrorBoundaryProps, HTMLCommentErrorBoundaryState> {

  readonly state = { error: false }

  static getDerivedStateFromError(...args: any[]): HTMLCommentErrorBoundaryState {
    console.log('args', args)
    return { error: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log('error', error)
    console.log('errorInfo', errorInfo)
    this.props.onError()
  }

  render(): ReactNode {
    if (this.state.error) {
      return <>error</>
    } else {
      return this.props.children
    }
  }

}

function HTMLCommentBase({
  children,
}: Required<HTMLCommentProps>): JSX.Element {
  const comment = `<!-- ${reactStaticSanitizeHTMLString(String(children))} -->`
  const transformRefIntoComment = useCallback((node: HTMLElement): void => {
    if (node) {
      node.outerHTML = comment
    }
  }, [comment])
  return (
    <i
      ref={transformRefIntoComment}
      dangerouslySetInnerHTML={{ __html: comment }}
    />
  )
}
