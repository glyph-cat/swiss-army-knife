# Platform Availability
Some methods/variables/types with the `@availability` tag shows its availability
on each platform. Others that do not have this tag means it is written in plain
TypeScript/JavaScript and you should be able to use them virtually everywhere.

## Concerning Platforms
* **Node** — Node JS.
* **Web** — The web in general. Unless explicitly stated, this includes both
client-side and server-side rendering.
* **Android** — Android (React Native).
* **iOS** — iOS and iPadOS (React Native).
* **macOS** — macOS (React Native).
* **Windows** — Windows (React Native).
<br/>

## Indicators
These indicators refer to whether functions/variables/types are can be used in a
platform without experiencing errors or unexpected behaviours. So while the prop
`interface` of a React component may be available on all platforms, the component
itself might only be available on just a few.
* ✅ Supported
* ❌ Not supported
* 🟠 Not tested
<br/>
