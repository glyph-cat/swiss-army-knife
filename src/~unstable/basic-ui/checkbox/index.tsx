import { c } from '@glyph-cat/swiss-army-knife'
import { Input, MaterialSymbol, View } from '@glyph-cat/swiss-army-knife-react'
import { ChangeEvent, ForwardedRef, forwardRef, JSX, ReactNode, useCallback } from 'react'
import styles from './index.module.css'

const sizeStyle: Record<CheckboxProps['size'], string> = {
  's': styles.containerSizeS,
  'm': styles.containerSizeM,
  'l': styles.containerSizeL,
}

/**
 * @public
 */
export interface CheckboxProps {
  label?: ReactNode
  checked: boolean | 'indeterminate'
  onChange(newChecked: boolean, event: ChangeEvent<HTMLInputElement>): void
  /**
   * @defaultValue `false`
   */
  disabled?: boolean
  /**
   * @defaultValue `false`
   */
  loading?: boolean
  /**
   * @defaultValue `'m'`
   */
  size?: 's' | 'm' | 'l'
}

/**
 * @public
 */
export type ICheckbox = Input

/**
 * @public
 */
export const Checkbox = forwardRef(({
  label,
  checked,
  onChange,
  disabled: $disabled,
  loading,
  size,
}: CheckboxProps, ref: ForwardedRef<ICheckbox>): JSX.Element => {
  const disabled = $disabled ?? loading
  return (
    <label className={c(
      styles.container,
      sizeStyle[size] ?? sizeStyle.m,
    )}>
      <View className={styles.checkbox}>
        <Input
          ref={ref}
          className={styles.input}
          type='checkbox'
          checked={checked === true}
          onChange={useCallback((e) => { onChange(e.target.checked, e) }, [onChange])}
          disabled={disabled}
        />
        <View className={styles.checkmark}>
          <MaterialSymbol name='check' />
        </View>
      </View>
      {label && <View>{label}</View>}
    </label>
  )
})

// enum BasicComponentType {
//   CHECKBOX = 1,
// }

// /**
//  * @public
//  */
// export class BasicUIComposer {

//   /**
//    * @internal
//    */
//   private M$styleManager?: StyleManager

//   readonly components: Readonly<{
//     Input: IInputComponent
//     View: IViewComponent
//   }>

//   constructor(
//     public readonly key: string,
//     public readonly coreUIComposer: CoreUIComposer,
//   ) {
//     this.components = {
//       Input: coreUIComposer.createInputComponent(`BasicUI-${key}`),
//       View: coreUIComposer.createViewComponent(`BasicUI-${key}`),
//     }
//     if (typeof window !== 'undefined') {
//       this.M$styleManager = new StyleManager([], -1 as PrecedenceLevel)
//       // NOTE `-1` is an internal value for `PrecedenceLevel.INTERNAL`
//     }
//   }

//   createCheckboxComponent(key: string): ICheckboxComponent {

//     warnIfKeyIsInvalid(key)

//     const _ = this.M$createClassNames(BasicComponentType.CHECKBOX, key, [
//       'container',
//       'containerSizeS',
//       'containerSizeM',
//       'containerSizeL',
//       'checkbox',
//       'input',
//       'checkmark',
//     ])
//     const tokenDisabledColor = '--disabledColor'
//     const tokenSize = '--size'
//     this.M$styleManager?.set(`.${_.container}`, {
//       alignItems: 'center',
//       cursor: 'pointer',
//       display: 'grid',
//       gap: ThemeToken.spacingM,
//       gridAutoFlow: 'column',
//       gridTemplateColumns: 'max-content',
//       justifySelf: 'start',
//     }).set(`.${_.container}:has(.${_.input}:disabled)`, {
//       cursor: 'not-allowed',
//     }).set(`.${_.containerSizeS}`, {
//       [tokenSize]: 22,
//     }).set(`.${_.containerSizeM}`, {
//       [tokenSize]: 28,
//     }).set(`.${_.containerSizeL}`, {
//       [tokenSize]: 32,
//     }).set(`.${_.checkbox}`, {
//       height: `var(${tokenSize})`,
//       overflow: 'hidden',
//       width: `var(${tokenSize})`,
//     }).set(`.${_.input}`, {
//       appearance: 'none',
//       borderRadius: ThemeToken.inputElementBorderRadius,
//       border: `solid ${ThemeToken.inputElementBorderSize} #808080`,
//       cursor: 'inherit',
//       height: `var(${tokenSize})`,
//       width: `var(${tokenSize})`,
//       outline: 'none',
//     }).set(`.${_.input}:enabled:hover`, {
//       backgroundImage: `linear-gradient(${ThemeToken.tint40},${ThemeToken.tint40})`,
//       borderColor: ThemeToken.tint,
//     }).set(`.${_.input}:checked:enabled:hover`, {
//       backgroundImage: `linear-gradient(${ThemeToken.tintLighter},${ThemeToken.tintLighter})`,
//       borderColor: ThemeToken.tintLighter,
//     }).set(`.${_.input}:enabled:active`, {
//       backgroundImage: 'linear-gradient(#00000060, #00000060)',
//     }).set(`.${_.input}:enabled:checked`, {
//       backgroundColor: ThemeToken.tint,
//       borderColor: ThemeToken.tint,
//     }).set(`.${_.input}:disabled`, {
//       [tokenDisabledColor]: '#80808040',
//       borderColor: `var(${tokenDisabledColor})`,
//     }).set(`.${_.input}:disabled:checked`, {
//       backgroundColor: `var(${tokenDisabledColor})`,
//     }).set(`.${_.checkmark}`, {
//       color: '#ffffff',
//       display: 'none',
//       placeSelf: 'center',
//       pointerEvents: 'none',
//       position: 'absolute',
//     }).set(`.${_.input}:disabled + .${_.checkmark}`, {
//       color: '#808080',
//     }).set(`.${_.input}:checked + .${_.checkmark}`, {
//       display: 'grid',
//     })

//     const sizeStyle: Record<CheckboxProps['size'], string> = {
//       's': _.containerSizeS,
//       'm': _.containerSizeM,
//       'l': _.containerSizeL,
//     }

//     const { Input, View } = this.components
//     const Checkbox = forwardRef(({
//       label,
//       checked,
//       onChange,
//       disabled: $disabled,
//       loading,
//       size,
//     }: CheckboxProps, ref: ForwardedRef<ICheckbox>): JSX.Element => {
//       const disabled = $disabled ?? loading
//       return (
//         <label className={c(
//           _.container,
//           sizeStyle[size] ?? sizeStyle.m,
//         )}>
//           <View className={_.checkbox}>
//             <Input
//               ref={ref}
//               className={_.input}
//               type='checkbox'
//               checked={checked === true}
//               onChange={useCallback((e) => { onChange(e.target.checked, e) }, [onChange])}
//               disabled={disabled}
//             />
//             <View className={_.checkmark}>
//               <MaterialSymbol name='check' />
//             </View>
//           </View>
//           {label && <View>{label}</View>}
//         </label>
//       )
//     })
//     return Checkbox
//   }

//   // #region Internal methods

//   /**
//    * @internal
//    */
//   private M$getPrefixedClassName(
//     type: BasicComponentType,
//     subKey: string,
//     className: string,
//   ): string {
//     return withBasicUIPrefix(`${this.key}-${type}-${subKey}-${className}`)
//   }

//   /**
//    * @internal
//    */
//   private M$createClassNames<ClassName extends string>(
//     type: BasicComponentType,
//     subKey: string,
//     classNames: Array<ClassName>,
//   ): Readonly<Record<ClassName, string>> {
//     // let counter = 0
//     const styles = {} as Record<ClassName, string>
//     for (const minifiedClassName in classNames) {
//       // Index is used as minified classname.
//       // Also, because it is not at the start of the string, it is okay to be a number.
//       const readableClassName = classNames[minifiedClassName]
//       styles[readableClassName] = this.M$getPrefixedClassName(type, subKey, minifiedClassName)
//     }
//     return styles
//   }

//   // #endregion Internal methods

// }

// // #region Static helpers

// function withBasicUIPrefix(value: string): string {
//   return 'basic-ui-' + value
// }

// function warnIfKeyIsInvalid(key: string): void {
//   // TODO: Refactor and share with CoreUI
//   if (IS_DEBUG_ENV) {
//     if (!/^[a-z0-9_-]+$/i.test(key)) {
//       devWarn(`Keys should only contain alphanumeric characters, dashes, and/or underscores but received "${key}"`)
//     }
//   }
// }

// // #endregion Static helpers
