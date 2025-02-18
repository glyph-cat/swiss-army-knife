import { CleanupFunction, pickLastWhere, StringRecord } from '@glyph-cat/swiss-army-knife'

export interface IFocusNodeState {
  id: string
  ignoreSiblings: boolean
  focusedChild: string
  childNodes: StringRecord<boolean>
}

export interface IFocusNode extends IFocusNodeState {
  parentNode: IFocusNode | undefined
  setFocus(id: string, ignoreSiblings: boolean): CleanupFunction
}

export function createRegistrationReducers(layerId: string, ignoreSiblings: boolean): [
  registerChildNode: (state: IFocusNodeState) => IFocusNodeState,
  unregisterChildNode: (state: IFocusNodeState) => IFocusNodeState,
] {
  return [
    (state: IFocusNodeState): IFocusNodeState => {
      const { [layerId]: _, ...nextChildNodesSubset } = state.childNodes
      const nextChildNodes: StringRecord<boolean> = {
        ...nextChildNodesSubset,
        [layerId]: !ignoreSiblings,
      }
      return {
        ...state,
        ...(ignoreSiblings ? {} : { focusedChild: layerId }),
        childNodes: nextChildNodes,
      }
    },
    (state: IFocusNodeState): IFocusNodeState => {
      const { [layerId]: _, ...nextChildNodes } = state.childNodes
      return {
        ...state,
        focusedChild: pickLastWhere(Object.keys(nextChildNodes), (key) => {
          return nextChildNodes[key] === true
        }),
        childNodes: nextChildNodes,
      }
    },
  ]
}
