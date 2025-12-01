import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { HookTester } from '@glyph-cat/react-test-utils'
import { useStateAlt } from '.'

const cleanupManager = new CleanupManager()
afterEach(() => { cleanupManager.run() })

test(useStateAlt.name, () => {

  const tester = new HookTester({
    useHook: () => {
      return useStateAlt(0)
    },
    actions: {
      increment(hook) {
        const [, setState] = hook
        setState((c: number) => c + 1)
      },
      reset(hook) {
        const [, , reset] = hook
        reset()
      },
    },
    values: {
      value(hook) {
        const [state] = hook
        return state
      },
    },
  }, cleanupManager)

  expect(tester.get('value')).toBe(0)

  tester.action('increment')
  expect(tester.get('value')).toBe(1)
  tester.action('increment')
  expect(tester.get('value')).toBe(2)

  tester.action('reset')
  expect(tester.get('value')).toBe(0)

})
