import {
  addStyles,
  clientOnly,
  PrecedenceLevel,
  StyleMap,
} from '@glyph-cat/swiss-army-knife'
import { prefixBasicUIIdentifiers } from 'packages/react/src/ui/basic/_internals/prefixing'

export const styles = prefixBasicUIIdentifiers('scrim', [
  'input',
])

clientOnly(() => {
  addStyles(new StyleMap([
    [`.${styles.input}`, {
      // ...
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})
