# Lazy Ref

Lazy refs allow us to declare expensive variables without compromising performance.
Because hooks run on every render, suppose if we do this:

```js
useRef(new Animated.Value(0))
```

A new `Animated.Value` instance will be created on every render, and that is
damn hurting the app's performance. So instead, we can do:

```js
import { Animated } from 'react-native'
import { useRef } from '@src/~hooks/react-x'
// TAKE NOTE: It is imported as "useRef", the same name as React's built-in hook.
// This is so that ESLint can treat it as React's `useRef` hook and check our
// code properly.

function App() {
  // Here, we are using a techinque called the factory pattern.
  // The value is created by the factory function only during the first render.
  const animator = useRef(() => new Animated.Value(0))
  return '...'
}
```

Extra note: You can also use `useRef` like React's built-in one, but don't use
it for functions —— functions should use the `useCallback` hook.

For primitive values:

```js
const counterA = useRef(() => 7)
const counterB = useRef(42) // You can also omit the factory pattern
console.log(counterA.current, counterB.current) // 7, 42
```
