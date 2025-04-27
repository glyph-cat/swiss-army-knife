import { Finger, FingerCurl, HandGesture } from '.'

// TODO

test.skip('temp', () => {

  const thumbHandGesture = new HandGesture({
    [Finger.THUMB]: FingerCurl.NO,
    [Finger.INDEX]: FingerCurl.YES,
    [Finger.MIDDLE]: FingerCurl.YES,
    [Finger.RING]: FingerCurl.YES,
    [Finger.PINKY]: FingerCurl.YES,
  })

  const hand = []
  thumbHandGesture.isFulfilledBy(hand)

})
