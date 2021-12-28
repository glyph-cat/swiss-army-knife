import createPortalSet from './internals'

// === IMPORTANT ===
// Although `createPortalSet()` can be used to create many instances of portals,
// it is advised to only use one throughout the project for code clarity and
// ease of debug. Unless facing edge cases where there are no other solution,
// only create a new portal set, otherwise import from this file with the
// already create one.

/**
 * The `renderInPortal` function accepts the same parameters as
 * `React.createElement` because it works similarly.
 *
 * ```js
 * renderInPortal(View, { style: { height: 100 } }, children)
 * ```
 *
 * Also, the code below are qeuivalent
 *
 * ```js
 * function App() {
 *   return React.createElement(View, { style: { height: 100 } }, children)
 * }
 * ```
 *
 * ```js
 * function App() {
 *  return (
 *    <View style={{ height: 100 }}>
 *      {children}
 *    </View>
 *  )
 * }
 * ```
 */
const portalObj = createPortalSet()

/**
 * @public
 */
export const Portal = portalObj.Portal

/**
 * @public
 */
export const PortalCanvas = portalObj.Canvas

/**
 * @public
 */
export const removeFromPortal = portalObj.removeFromPortal

/**
 * @public
 */
export const renderInPortal = portalObj.renderInPortal
