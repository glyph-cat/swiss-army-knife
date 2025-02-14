import { CleanupFunction, pickLast, TruthRecord } from '@glyph-cat/swiss-army-knife'

export interface IFocusNodeState {
  id: string
  ignoreSiblings: boolean
  focusedChild: string
  childNodes: TruthRecord<string>
}

export interface IFocusNode extends IFocusNodeState {
  parentNode: IFocusNode | undefined
  setFocus(id: string): CleanupFunction
}

export function createRegistrationReducers(layerId: string): [
  registerChildNode: (state: IFocusNodeState) => IFocusNodeState,
  unregisterChildNode: (state: IFocusNodeState) => IFocusNodeState,
] {
  return [
    (state: IFocusNodeState): IFocusNodeState => {
      const { [layerId]: _, ...nextChildNodesSubset } = state.childNodes
      const nextChildNodes: TruthRecord<string> = {
        ...nextChildNodesSubset,
        [layerId]: true,
      }
      return {
        ...state,
        focusedChild: layerId,
        childNodes: nextChildNodes,
      }
    },
    (state: IFocusNodeState): IFocusNodeState => {
      const { [layerId]: _, ...nextChildNodes } = state.childNodes
      return {
        ...state,
        focusedChild: pickLast(Object.keys(nextChildNodes)) ?? null,
        childNodes: nextChildNodes,
      }
    },
  ]
}
