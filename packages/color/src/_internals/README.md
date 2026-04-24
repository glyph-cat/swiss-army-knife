## TL;DR

The `jest.spyOn` function:
- tampers with the prototype
- causes `instanceof` to not work properly
- Does not capture invocations correctly

There are too many problems with Jest's spying framework,
so a manual spy is implemented instead and will be excluded when generating
the final builds at compile time.

--------------------------------------------------------------------------------

## Spy on `Color`

Setup:
```ts
jest.spyOn(Color, 'rgb')
jest.spyOn(Color.rgb, 'fromString')
```

### When source code uses `RGBColor` and test tries to use `Color.rgb`
```
❌ TypeError: Class constructor RGBColor cannot be invoked without 'new'
```

### When source code uses `RGBColor` and test also uses `RGBColor`
```ts
new Color(new RGBColor(43, 128, 255))
```

```
❌ Invalid color value
```
Because source code `instanceof` to check for input parameter and there were no matches.

### When source code uses `Color.rgb`
```
❌ Property `fromString` does not exist in the provided object
```

--------------------------------------------------------------------------------

## `import * as NAMESPACE` then `jest.spyOn` exports

Source code
```ts
class RGBColor extends BaseColorObject {
  constructor() {
    console.log('Constructor invoked!')
  }
}
```

Setup:
```ts
jest.spyOn(RGB_NAMESPACE, 'RGBColor')
```

```
Constructor invoked!
Number of calls: 0
```
