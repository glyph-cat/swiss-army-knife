import clsx from 'clsx'
import {
  createElement,
  forwardRef,
  JSX,
  useImperativeHandle,
  useRef,
} from 'react'
import { VIEW_STYLES } from '../_internals'

/**
 * @public
 */
export type ViewProps = JSX.IntrinsicElements['div']

/**
 * @public
 */
export interface View extends HTMLDivElement { (props: ViewProps): JSX.Element }

/**
 * A drop-in replacement for the `<div>` element where
 * the display is set to `'grid'` and position is set to `'relative'`.
 * @public
 */
export const View = forwardRef<HTMLDivElement, ViewProps>(({
  children,
  className,
  ...otherProps
}, ref): JSX.Element => {
  const divRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => divRef.current)
  // eslint-disable-next-line react/forbid-elements
  return createElement('div', {
    ref: divRef,
    className: clsx(VIEW_STYLES, className),
    ...otherProps,
  }, children)
})

/**
 * @public
 */
export interface FocusableViewProps extends ViewProps {
  /**
   * @defaultValue `true`
   */
  allowRefocus?: boolean
  /**
   * @defaultValue `true`
  */
  effective?: boolean
  /**
   * @defaultValue `false`
   */
  ignoreSiblings?: boolean
}

// /**
//  * @public
//  */
// export interface IFocusableView extends View { (props: FocusableViewProps): JSX.Element }

// /**
//  * A drop-in replacement for the `<div>` element.
//  * This is similar to {@link View} except it can track focus using the {@link LayeredFocusManager}.
//  *
//  * Notes:
//  * - Input components track focus using {@link InputFocusTracker} instead.
//  * - {@link LayeredFocusManager} and {@link InputFocusTracker} do not interfere with each other.
//  *
//  * @public
//  */
// export const FocusableView = forwardRef<HTMLDivElement, FocusableViewProps>(({
//   children,
//   className,
//   allowRefocus = true,
//   ignoreSiblings,
//   effective = true,
//   ...otherProps
// }, ref): JSX.Element => {
//   // TODO: Should intercept props `onFocus` and `onBlur`; `addEventListener` for focus and blur; imperative ref `.focus` and `.blur` ... first of all, find of if it is possible for divs to be focused (semantically speaking / based on the web standard)
//   const divRef = useRef<HTMLDivElement>(null)
//   useImperativeHandle(ref, () => divRef.current)
//   return (
//     <FocusLayer ignoreSiblings={ignoreSiblings} effective={effective}>
//       <div // eslint-disable-line react/forbid-elements
//         ref={divRef}
//         className={c(VIEW_STYLES, className)}
//         {...otherProps}
//       >
//         {children}
//       </div>
//       <FocusObserver
//         elementRef={divRef}
//         allowRefocus={allowRefocus}
//       />
//     </FocusLayer>
//   )
// })
