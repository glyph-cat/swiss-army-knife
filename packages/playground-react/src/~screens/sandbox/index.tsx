import { Component, ErrorInfo, JSX, lazy, ReactNode, Suspense } from 'react'
import { View } from '~core-ui'
import styles from './index.module.css'

export interface SandboxScreenProps {
  name: string
}

function SandboxScreen({ name: sandboxName }: SandboxScreenProps): JSX.Element {
  const SandboxComponent = lazy(() => import(`~sandboxes/${sandboxName}`))
  return (
    <ErrorBoundary>
      <Suspense fallback={<Fallback />}>
        <SandboxComponent />
      </Suspense>
    </ErrorBoundary>
  )
}

export default SandboxScreen

function Fallback(): JSX.Element {
  return (
    <View className={styles.fallbackContainer}>
      {'Loading...'}
    </View>
  )
}

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {

  state: Readonly<ErrorBoundaryState> = {}

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo })
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <View className={styles.errorBoundaryContainer}>
          <View>
            <span>An error occurred.</span>
            <span>{String(this.state.error)}</span>
            <pre className={styles.details}>
              <code>
                {this.state.errorInfo.componentStack}
              </code>
            </pre>
          </View>
        </View>
      )
    } else {
      return this.props.children
    }
  }

}
