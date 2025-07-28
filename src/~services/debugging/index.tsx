import { delay, strictMerge, TimestampId } from '@glyph-cat/swiss-army-knife'
import { StateManager } from 'cotton-box'
import { createStorageKey } from '~utils/app'

const STORAGE_KEY = createStorageKey('custom-debugger')
const SOFT_RELOAD_KEY = createStorageKey('soft-reload')

export interface IDebugState {
  useStrictMode: boolean
  softReloadKey: string
  showPerformanceDebugger: boolean
  isRestartingServer: boolean
}

export class CustomDebugger {

  static readonly state = new StateManager<IDebugState>({
    useStrictMode: true,
    softReloadKey: '_',
    showPerformanceDebugger: true,
    isRestartingServer: false,
  }, {
    lifecycle: typeof window === 'undefined' ? {} : {
      init({ commit, commitNoop, defaultState }) {
        const rawState = localStorage.getItem(STORAGE_KEY)
        if (rawState) {
          const parsedState = JSON.parse(rawState)
          return commit(strictMerge(defaultState, parsedState)) // Early exit
        }
        commitNoop()
      },
      didSet({ state }) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      },
      didReset() {
        localStorage.removeItem(STORAGE_KEY)
      },
    },
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
