import { ElementType, ReactNode } from 'react'

/**
 * @public
 */
export enum PortalType {
  JSX = 1,
  PARAMS,
}

/**
 * @public
 */
export interface PortalDataByJSX {
  type: PortalType.JSX
  children: ReactNode
}

/**
 * @public
 */
export interface PortalDataByParameters {
  type: PortalType.PARAMS
  children: ReactNode
  element: ElementType
  props: Record<string, unknown>
}

/**
 * @public
 */
export type IPortalFactoryState = Record<number, PortalDataByJSX | PortalDataByParameters>
