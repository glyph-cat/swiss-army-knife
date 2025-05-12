/**
 * @public
 */
export class ActionNotExistError extends ReferenceError {

  constructor(actionKey: PropertyKey, availableActions: Array<PropertyKey>) {
    super(
      `Action '${String(actionKey)}' does not exist. ` +
      `Available actions are ${availableActions.map(v => `'${String(v)}'`).join(', ')}.`
    )
    this.name = 'ActionNotExistError'
  }

}

/**
 * @public
 */
export class ValueNotExistError extends ReferenceError {

  constructor(valueKey: PropertyKey, availableValues: Array<PropertyKey>) {
    super(
      `Value '${String(valueKey)}' does not exist. ` +
      `Available values are: ${availableValues.map(v => `'${String(v)}'`).join(', ')}.`
    )
    this.name = 'ValueNotExistError'
  }

}

// /**
//  * @public
//  */
// export class FailedToGetValueError extends Error {

//   constructor(valueKey: PropertyKey, error: unknown) {
//     super(`Encountered an error while attempting to get value '${String(valueKey)}'\n > ${String(error)}`)
//     this.name = 'FailedToGetValueError'
//   }

// }
