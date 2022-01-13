# Platform Availability
Some methods/variables/types with the `@availability` tag shows its availability
on each platform. Others that do not have this tag means it is written in plain
TypeScript/JavaScript and you should be able to use them virtually everywhere.

## Concerning Platforms
* **Node** — Node JS.
* **Web** — The web in general. Unless explicitly stated, this includes both
client-side and server-side rendering.
* **Android** — Android (React Native).
* **iOS** — iOS and iPadOS (React Native).
* **macOS** — macOS (React Native).
* **Windows** — Windows (React Native).
<br/>

## Indicators
These indicators refer to whether functions/variables/types can work properly on
each platform. At best, these functions/variables/types will do nothing if used
on unsupported platforms. However, you should still test their behaviours if you
intend to share code between different platforms as some might cause native
errors that require manual handling.

Also, it's worth noticing that while prop `interface`s of React
components may be available on every platforms, the components themselves might
only be available on just a few.

* ✅ Supported
* ❌ Not supported
* 🟠 Not tested

<br/>

# Support This Project

* Ko-fi: [`ko-fi.com/glyphcat`](https://ko-fi.com/glyphcat)
* BTC: [`bc1q5qp6a972l8m0k26ln9deuhup0nmldf86ndu5we`](bitcoin:bc1q5qp6a972l8m0k26ln9deuhup0nmldf86ndu5we)

<br/>
