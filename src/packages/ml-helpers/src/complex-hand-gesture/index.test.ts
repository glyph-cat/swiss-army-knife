import { Finger, FingerCurl, ComplexHandGesture } from '.'

// TODO

test.skip('temp', () => {

  const thumbHandGesture = new ComplexHandGesture({
    [Finger.THUMB]: FingerCurl.STRAIGHT,
    [Finger.INDEX]: FingerCurl.FULL,
    [Finger.MIDDLE]: FingerCurl.FULL,
    [Finger.RING]: FingerCurl.FULL,
    [Finger.PINKY]: FingerCurl.FULL,
  })

  const hand = []
  thumbHandGesture.isFulfilledBy(hand)

})

// const selectHandGesture = new HandGesture({
//   [Finger.THUMB]: FingerCurl.ANY,
//   [Finger.INDEX]: FingerCurl.YES,
//   [Finger.MIDDLE]: FingerCurl.YES,
//   [Finger.RING]: FingerCurl.YES,
//   [Finger.PINKY]: FingerCurl.YES,
// })

// const HandGestureLookup: Readonly<Record<GesturePresets, HandGesture>> = {
//   [GesturePresets.ROCK]: new HandGesture({
//     [Finger.THUMB]: FingerCurl.YES,
//     [Finger.INDEX]: FingerCurl.YES,
//     [Finger.MIDDLE]: FingerCurl.YES,
//     [Finger.RING]: FingerCurl.YES,
//     [Finger.PINKY]: FingerCurl.YES,
//   }),
//   [GesturePresets.PAPER]: new HandGesture({
//     [Finger.THUMB]: FingerCurl.NO,
//     [Finger.INDEX]: FingerCurl.NO,
//     [Finger.MIDDLE]: FingerCurl.NO,
//     [Finger.RING]: FingerCurl.NO,
//     [Finger.PINKY]: FingerCurl.NO,
//   }),
//   [GesturePresets.SCISSORS]: new HandGesture({
//     [Finger.THUMB]: FingerCurl.YES,
//     [Finger.INDEX]: FingerCurl.NO,
//     [Finger.MIDDLE]: FingerCurl.NO,
//     [Finger.RING]: FingerCurl.YES,
//     [Finger.PINKY]: FingerCurl.YES,
//   }),
//   [GesturePresets.THUMBS]: new HandGesture({
//     [Finger.THUMB]: FingerCurl.NO,
//     [Finger.INDEX]: FingerCurl.YES,
//     [Finger.MIDDLE]: FingerCurl.YES,
//     [Finger.RING]: FingerCurl.YES,
//     [Finger.PINKY]: FingerCurl.YES,
//   }),
//   [GesturePresets.THREE]: new HandGesture({
//     [Finger.THUMB]: FingerCurl.YES,
//     [Finger.INDEX]: FingerCurl.NO,
//     [Finger.MIDDLE]: FingerCurl.NO,
//     [Finger.RING]: FingerCurl.NO,
//     [Finger.PINKY]: FingerCurl.YES,
//   }),
//   [GesturePresets.FOUR]: new HandGesture({
//     [Finger.THUMB]: FingerCurl.YES,
//     [Finger.INDEX]: FingerCurl.NO,
//     [Finger.MIDDLE]: FingerCurl.NO,
//     [Finger.RING]: FingerCurl.NO,
//     [Finger.PINKY]: FingerCurl.NO,
//   }),
// }
