/**
 * @internal
 */
let idCounter = 0

/**
* The base structure of utility objects in this library.
* Factories(functions) will return objects that extends from this interface
* whereas classes will implement it.
* GC = Glyph Cat
* @public
*/
export interface GCFunctionalObject {
  $id: number
}

/**
 * @internal
 */
export function createGCFactoryObject(): GCFunctionalObject {
  return {
    $id: ++idCounter,
  }
}

// export function createGCFactory<A extends Array<unknown>, R>(
//   initializer: ({ self: GCFunctionalObject, params: A }) => R
// ): ((...params: A) => GCFunctionalObject & R) {
//   const self = createGCFactoryObject()
//   return (...params) => ({
//     ...self,
//     ...initializer({ self, params }),
//   })
// }

// export interface ExperimentalObject {
//   get(): number
// }

// export const createExperimentalObject = createGCFactory<[inputNum: number], ExperimentalObject>(
//   ({ params }) => {
//     const [inputNum] = params
//     const get = (): number => inputNum + 42
//     return {
//       get,
//     }
//   }
// )

// const experimentalObject = createExperimentalObject(10)

/**
 * @public
 */
export class GCClassObject implements GCFunctionalObject {

  $id: number

  constructor() {
    const baseObject = createGCFactoryObject()
    this.$id = baseObject.$id
  }

}
