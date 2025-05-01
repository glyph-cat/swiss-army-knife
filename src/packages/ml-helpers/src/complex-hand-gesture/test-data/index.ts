import { ComplexHandGesture, Finger, FingerCurl } from '..'
import ClosedFistFrontFacingThumbFront from './closed-fist-front-facing-thumb-front.json'
import ClosedFistFrontFacingThumbSide from './closed-fist-front-facing-thumb-side.json'

export const GesturePreset = {
  ClosedFist: new ComplexHandGesture({
    [Finger.THUMB]: { isNot: FingerCurl.STRAIGHT },
    [Finger.INDEX]: { is: FingerCurl.FULL },
    [Finger.MIDDLE]: { is: FingerCurl.FULL },
    [Finger.RING]: { is: FingerCurl.FULL },
    [Finger.PINKY]: { is: FingerCurl.FULL },
  }),
  OpenPalm: new ComplexHandGesture({
    [Finger.THUMB]: { is: FingerCurl.STRAIGHT },
    [Finger.INDEX]: { is: FingerCurl.STRAIGHT },
    [Finger.MIDDLE]: { is: FingerCurl.STRAIGHT },
    [Finger.RING]: { is: FingerCurl.STRAIGHT },
    [Finger.PINKY]: { is: FingerCurl.STRAIGHT },
  }),
  Victory: new ComplexHandGesture({
    [Finger.THUMB]: { is: FingerCurl.FULL },
    [Finger.INDEX]: { is: FingerCurl.STRAIGHT },
    [Finger.MIDDLE]: { is: FingerCurl.STRAIGHT },
    [Finger.RING]: { is: FingerCurl.FULL },
    [Finger.PINKY]: { is: FingerCurl.FULL },
  }),
  Thumb: new ComplexHandGesture({
    [Finger.THUMB]: { is: FingerCurl.STRAIGHT },
    [Finger.INDEX]: { is: FingerCurl.FULL },
    [Finger.MIDDLE]: { is: FingerCurl.FULL },
    [Finger.RING]: { is: FingerCurl.FULL },
    [Finger.PINKY]: { is: FingerCurl.FULL },
  }),
  ThreeFingers: new ComplexHandGesture({
    [Finger.THUMB]: { is: FingerCurl.FULL },
    [Finger.INDEX]: { is: FingerCurl.STRAIGHT },
    [Finger.MIDDLE]: { is: FingerCurl.STRAIGHT },
    [Finger.RING]: { is: FingerCurl.STRAIGHT },
    [Finger.PINKY]: { is: FingerCurl.FULL },
  }),
  FourFingers: new ComplexHandGesture({
    [Finger.THUMB]: { is: FingerCurl.FULL },
    [Finger.INDEX]: { is: FingerCurl.STRAIGHT },
    [Finger.MIDDLE]: { is: FingerCurl.STRAIGHT },
    [Finger.RING]: { is: FingerCurl.STRAIGHT },
    [Finger.PINKY]: { is: FingerCurl.STRAIGHT },
  })
} as const

export const HandGestureSample = {
  ClosedFist: {
    FrontFacing: {
      ThumbSide: ClosedFistFrontFacingThumbSide,
      ThumbFront: ClosedFistFrontFacingThumbFront,
    },
  },
} as const
