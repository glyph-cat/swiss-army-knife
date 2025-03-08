# CONTRIBUTING

Normally, there would be no need to refer to the written conventions here as
they would have been very obvious upon taking a look at the project structure.
But if ever in doubt, hopefully this file will be able to clarify things.

## Development

* Files and directories should be named using `camel-case`
* Except for API files and directories:
  * `MacroCase` should be used for classes, React components, namespaces, etc.
  * `camelCase` should be used for functions

## Tests

* There are two types of tests, one in `src` and one in `tests`.
* Tests in `src` are meant for testing internal component — the ones that are not exposed as APIs.
* Tests in `tests` are meant for testing exposed APIs.

### Tests in `src`

* They are plain and simple, no wrappers or helpers are required.
* They should only test what is contained in their folder.

### Tests in `tests`

* They are grouped by types `api`, `constants`, etc. (more might be added in the future if necessary)
* These tests should be run inside the `wrapper` to ensure that the bundled codes produces the desired results
* Preferably, name test files after the name of method to be tested.
* Tests for APIs should have the `API-` prefix; examples:
  * `.../Something/API-foo.test.ts`
  * `.../Something/API-bar.test.ts`
* Tests for special scenarios should have the `SPECIAL-` prefix; examples:
  * `.../Something/SPECIAL-foo.test.ts`
  * `.../Something/SPECIAL-bar.test.ts`
* If there is only one test file then `index.test.ts` is fine; examples:
  * `.../doSomeThing/index.test.ts`
  * `.../doAnotherThing/index.test.ts`

### Other things to take note

* Do not call `expect` conditionally or inside loops
* Note that [`jest/no-conditional-expect`](https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-conditional-expect.md) will show an error when `expect` is called conditionally, but not when they are called inside loops.

### Making sure State Managers are disposed after test

1. Perform search in VS Code: `new (Simple|Async)?StateManager` as regex with case sensitivity and only include: `.test.ts`
2. Take note of the search result count
3. Swap the value with `cleanupManager.append(TestState.dispose)` as plain text.
4. Compare the search result count, make sure they are the same as the count in #2.
