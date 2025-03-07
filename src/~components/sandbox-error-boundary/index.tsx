import { Component, ErrorInfo, ReactNode } from 'react'
import { View } from '~core-ui'
import styles from './index.module.css'

export interface SandboxErrorBoundaryProps {
  children: ReactNode
}

export interface SandboxErrorBoundaryState {
  error?: Error
  errorInfo?: ErrorInfo
}

export class SandboxErrorBoundary extends Component<SandboxErrorBoundaryProps, SandboxErrorBoundaryState> {

  state: Readonly<SandboxErrorBoundaryState> = {}

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
