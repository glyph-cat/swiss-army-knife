## Internal Properties
- ✅ Use the `M$` prefix (Example: `M$value`)
- ❌ **Do not** use the `_` prefix (Example: `_value`)
  - The `_` prefix is a common standard, we do not want to risk this library failing to communicate with other libraries in case variable minification goes wrong.

## Local imports in `scripts/` and `tools/`
- Always use relative imports
- Always import from the specific file
- Use this regex to search for violations: `src\/packages\/([a-z_-]+)\/src'`
- This reduces chances of failure and allows scripting tools to continue working in case there is a problem with the package
- If there is really a problem with the build, the error will surface at some point later in the build process with more appropriate/detailed error information.

✅ Do:
```js
import { isBoolean } from '../../src/packages/core/src/data/type-check'
```

❌ Don't:
```js
import { isBoolean } from '../../../src/packages/core/src'
```

## Naming Conventions

**Variables** should use `camelCase`.
Example:
```ts
let scrollPosition = 0
```

**Constants** should use `MACRO_CASE`.
Example:
```ts
const CONVERSION_FACTOR_DEG_TO_RAD = Math.PI / 180
```

**Enums** should use `PascalCase`.
Example:
```ts
enum ShortBool {
  NO,
  YES,
}
```

**Objects** containing constants as sub-properties are treated as namespaces and should use `PascalCase`.
Example:
```ts
const SafeAreaInset = {
  TOP: 'env(safe-area-inset-top)',
  LEFT: 'env(safe-area-inset-left)',
  RIGHT: 'env(safe-area-inset-right)',
  BOTTOM: 'env(safe-area-inset-bottom)',
} as const
```

### Boolean
- Should start with words such as `is-`, `should-`, `has-`
- Then followed by adjectives or verbs
- Examples: `isVisible`, `shouldRender`, `hasRefreshed`


## Code Formatting
- Tab: spaces
- Size: 2
- Prefer single quotes, as it doesn't require pressing the shift key (which is easier to type).
- No semicolons at end of line.
- Prefer to use named exports, only use default exports where necessary (mandated by a framework/library)


