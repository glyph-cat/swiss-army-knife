import { reflect1D } from '@glyph-cat/swiss-army-knife'
import {
  FaceLandmarker,
  FaceLandmarkerOptions,
  FaceLandmarkerResult,
  NormalizedLandmark,
} from '@mediapipe/tasks-vision'
import { BaseLandmarkAnalyzer, LandmarkAnalyzerOptions } from '../base-classes'

/**
 * @public
 */
export type OnePersonFaceMeshAnalyzerResult = Array<NormalizedLandmark>

/**
 * @public
 */
export class OnePersonFaceMeshAnalyzer extends BaseLandmarkAnalyzer<FaceLandmarker, OnePersonFaceMeshAnalyzerResult> {

  // baseOptions: {
  //   modelAssetPath: '/mediapipe/models/face_landmarker.task',
  //   delegate: 'GPU',
  // },
  // runningMode: 'VIDEO',

  // TODO: implement from base class????
  private static readonly M$cache: Record<string, Promise<FaceLandmarker>> = {}

  constructor(
    videoElement: HTMLVideoElement,
    faceLandmarkerOptions: Omit<FaceLandmarkerOptions, 'numFaces'>,
    private readonly options: LandmarkAnalyzerOptions,
  ) {
    super(videoElement, new Array(478).fill({
      x: 0,
      y: 0,
      z: 0,
      visibility: 0,
    }), async () => {
      const optionsKey = JSON.stringify(faceLandmarkerOptions)
      if (!OnePersonFaceMeshAnalyzer.M$cache[optionsKey]) {
        OnePersonFaceMeshAnalyzer.M$cache[optionsKey] = FaceLandmarker.createFromOptions(
          await BaseLandmarkAnalyzer.getVision(),
          {
            ...faceLandmarkerOptions,
            numFaces: 1,
          }
        )
      }
      return OnePersonFaceMeshAnalyzer.M$cache[optionsKey]
    }, 'OnePersonFaceMeshAnalyzer', options)
  }

  protected getProcessedResult(rawResult: FaceLandmarkerResult): OnePersonFaceMeshAnalyzerResult {
    const processedLandmarks: OnePersonFaceMeshAnalyzerResult = []
    if (rawResult.faceLandmarks?.length <= 0) { return }
    const flipHorizontally = this.options?.flipHorizontally
    const landmarks = rawResult.faceLandmarks[0]
    for (const landmark of landmarks) {
      processedLandmarks.push({
        ...landmark,
        // These values range between 0 to 1
        x: flipHorizontally ? reflect1D(landmark.x, 0.5) : landmark.x,
        visibility: 1,
      })
    }
    return processedLandmarks
  }

}

// /**
//  * @public
//  */
// export class UNSAFE_OnePersonFaceMeshAnalyzer extends UNSAFE_BaseLandmarkAnalyzer<FaceLandmarker, OnePersonFaceMeshAnalyzerResult> {

//   /**
//    * @internal
//    */
//   private static M$taskRunnerGetter = new LazyValue(async () => {
//     return FaceLandmarker.createFromOptions(
//       await UNSAFE_BaseLandmarkAnalyzer.getVision(),
//       {
//         baseOptions: {
//           modelAssetPath: '/mediapipe/models/face_landmarker.task',
//           delegate: 'GPU',
//         },
//         numFaces: 1,
//         runningMode: 'VIDEO',
//       }
//     )
//   })

//   constructor(videoElement: HTMLVideoElement) {
//     super(videoElement, new Array(478).fill({
//       x: 0,
//       y: 0,
//       z: 0,
//       visibility: 0,
//     }), UNSAFE_OnePersonFaceMeshAnalyzer.M$taskRunnerGetter, 'OnePersonFaceMeshAnalyzer')
//   }

//   protected getProcessedResult(rawResult: FaceLandmarkerResult): OnePersonFaceMeshAnalyzerResult {
//     const processedLandmarks: OnePersonFaceMeshAnalyzerResult = []
//     if (rawResult.faceLandmarks?.length <= 0) { return }
//     const landmarks = rawResult.faceLandmarks[0]
//     for (const landmark of landmarks) {
//       processedLandmarks.push({
//         ...landmark,
//         x: reflect1D(landmark.x, 0.5), // These values range between 0 to 1
//         visibility: 1,
//       })
//     }
//     return processedLandmarks
//   }

// }
