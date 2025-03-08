import { delay, TimestampId } from '@glyph-cat/swiss-army-knife'
import { SimpleStateManager } from 'cotton-box'
import { createStorageKey } from '~utils/create-storage-key'

const SOFT_RELOAD_KEY = createStorageKey('soft-reload')

export interface IDebugState {
  useStrictMode: boolean
  softReloadKey: string
  showPerformanceDebugger: boolean
  isRestartingServer: boolean
}

export class CustomDebugger {

  static readonly state = new SimpleStateManager<IDebugState>({
    useStrictMode: true,
    softReloadKey: '_',
    showPerformanceDebugger: true,
    isRestartingServer: false,
  })

  static toggleStrictMode(): void {
    CustomDebugger.state.set((previousState) => ({
      ...previousState,
      useStrictMode: !previousState.useStrictMode,
    }))
  }

  static async testForMemoryLeak(): Promise<void> {
    let newValue: string
    for (let i = 0; i < 20; i++) {
      newValue = TimestampId()
      CustomDebugger.state.set((previousState) => ({
        ...previousState,
        softReloadKey: newValue,
      }))
      await delay(10)
    }
    localStorage.setItem(SOFT_RELOAD_KEY, newValue)
  }

  static softReload(): void {
    const newValue = TimestampId()
    CustomDebugger.state.set((previousState) => ({
      ...previousState,
      softReloadKey: newValue,
    }))
    localStorage.setItem(SOFT_RELOAD_KEY, newValue)
  }

  static togglePerformanceDebugger(): void {
    CustomDebugger.state.set((previousState) => ({
      ...previousState,
      showPerformanceDebugger: !previousState.showPerformanceDebugger,
    }))
  }

}
