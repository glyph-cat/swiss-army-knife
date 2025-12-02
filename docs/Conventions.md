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

