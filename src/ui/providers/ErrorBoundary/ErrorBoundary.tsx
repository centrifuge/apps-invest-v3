import { Component, ErrorInfo, ReactNode } from 'react'
import { DefaultFallback } from './DefaultFallback'

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export interface FallbackProps {
  error: Error
  resetError: () => void
  errorInfo?: ErrorInfo
}

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ComponentType<FallbackProps>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  onReset?: () => void
  resetKeys?: Array<string | number>
  resetOnPropsChange?: boolean
  hideLoading?: () => void
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null
  private prevResetKeys: Array<string | number> = []

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
    this.prevResetKeys = props.resetKeys || []
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Hide loading indicators when error occurs
    if (this.props.hideLoading) {
      this.props.hideLoading()
    }

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error)
      console.error('Error Info:', errorInfo)
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state

    if (hasError && resetKeys && resetKeys !== this.prevResetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key: string | number, index: number) => key !== this.prevResetKeys[index]
      )

      if (hasResetKeyChanged) {
        this.prevResetKeys = resetKeys
        this.resetErrorBoundary()
      }
    }

    if (hasError && resetOnPropsChange && prevProps !== this.props) {
      this.resetErrorBoundary()
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })

    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state
    const { children, fallback: Fallback = DefaultFallback } = this.props

    if (hasError && error) {
      const fallbackProps: FallbackProps = {
        error,
        resetError: this.resetErrorBoundary,
        errorInfo: errorInfo || undefined,
      }

      const fallbackElement = <Fallback {...fallbackProps} />

      return fallbackElement
    }

    return children
  }
}
