import { GesturePreset, HandGestureSample } from './test-data'

test('Proof of concept', () => {

  expect(GesturePreset.ClosedFist.isMatchedBy(
    HandGestureSample.ClosedFist.FaceFront.ThumbFront
  )).toBeTrue()

  expect(GesturePreset.ClosedFist.isMatchedBy(
    HandGestureSample.ClosedFist.FaceFront.ThumbSide
  )).toBeTrue()

})

// TODO: test matching gestures and expect result to be true
// TODO: test all other gestures and expect result to be false
