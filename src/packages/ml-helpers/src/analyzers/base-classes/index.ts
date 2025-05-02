import {
  Awaitable,
  createEnumToStringConverter,
  LazyValue,
  NotImplementedError,
  StringRecord,
} from '@glyph-cat/swiss-army-knife'
import { FilesetResolver } from '@mediapipe/tasks-vision'
import { SimpleFiniteStateManager, SimpleStateManager } from 'cotton-box'
import { VisionLandmarker, WasmFileset } from '../../abstractions'
import { VisionAnalyzerState } from '../../constants'

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class BaseVisionAnalyzer<TaskRunner extends StringRecord<any>, Result> {

  private static _vision: Promise<WasmFileset>

  static async getVision(): Promise<WasmFileset> {
    if (!this._vision) {
      this._vision = FilesetResolver.forVisionTasks(
        // 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        '/mediapipe/wasm'
      )
    }
    return this._vision
  }

  protected taskRunner: TaskRunner
  protected lastRequestedAnimationFrame: number
  readonly result: SimpleStateManager<Result>
  readonly state = new SimpleFiniteStateManager(VisionAnalyzerState.CREATED, [
    [VisionAnalyzerState.CREATED, VisionAnalyzerState.INITIALIZING],
    [VisionAnalyzerState.CREATED, VisionAnalyzerState.DISPOSED],
    [VisionAnalyzerState.INITIALIZING, VisionAnalyzerState.STANDBY],
    [VisionAnalyzerState.ACTIVE, VisionAnalyzerState.STANDBY],
    [VisionAnalyzerState.STANDBY, VisionAnalyzerState.ACTIVE],
    [VisionAnalyzerState.STANDBY, VisionAnalyzerState.DISPOSED],
  ], {
    serializeState: createEnumToStringConverter(VisionAnalyzerState),
  })

  constructor(
    readonly videoElement: HTMLVideoElement,
    initialResult: Result,
    taskRunnerGetter: LazyValue<Awaitable<TaskRunner>>,
    readonly detectionMethodName: 'detectForVideo' | 'recognizeForVideo',
  ) {
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.getProcessedResult = this.getProcessedResult.bind(this)
    this.dispose = this.dispose.bind(this)
    this.result = new SimpleStateManager<Result>(initialResult)
    // NOTE: `initialResult` was originally an extendable/inheritable property
    // https://stackoverflow.com/a/43595944/5810737
    const asyncCb = async () => {
      this.state.set(VisionAnalyzerState.INITIALIZING)
      this.taskRunner = await taskRunnerGetter.value
      // In case state changed (for example, to disposed, halfway), then keep that state.
      this.state.set((s) => s === VisionAnalyzerState.INITIALIZING ? VisionAnalyzerState.STANDBY : s)
    }; asyncCb()
  }

  async start(): Promise<void> {
    if (this.state.get() < VisionAnalyzerState.STANDBY) {
      await this.state.wait((s) => s > VisionAnalyzerState.STANDBY)
    } else if (this.state.get() !== VisionAnalyzerState.STANDBY) {
      return // Early exit
    }
    this.state.set(VisionAnalyzerState.ACTIVE)
    this.lastRequestedAnimationFrame = requestAnimationFrame(this.performAnalysis)
  }

  async stop(): Promise<void> {
    await this.state.wait((s) => s === VisionAnalyzerState.CREATED || s > VisionAnalyzerState.STANDBY)
    if (this.state.get() === VisionAnalyzerState.DISPOSED) { return } // Early exit
    cancelAnimationFrame(this.lastRequestedAnimationFrame)
    this.state.set(VisionAnalyzerState.STANDBY)
  }

  async dispose(): Promise<void> {
    // NOTE: `landmarker.close()` is not called and is meant to be kept until
    // the app closes. Calling `landmarker.close()` on a class lifecycle basis
    // causes a lot of issues:
    // - it seems like there is memory leakage even when `.close()` is called
    // - even if there is no memory leakage, having to fetch and close repeatedly
    //   make the app very slow
    // - This is caught from within React's StrictMode + rapidly repeated soft reloads
    // - This can be a problem when the user intentionally stops and resumes
    //   the session multiple times
    this.result.dispose()
    this.state.set(VisionAnalyzerState.DISPOSED)
    this.state.dispose()
  }

  private performAnalysis = async (): Promise<void> => {
    if (this.state.get() !== VisionAnalyzerState.ACTIVE) { return } // Early exit
    const result = this.taskRunner[this.detectionMethodName](this.videoElement, performance.now())
    const processedResult = this.getProcessedResult(result as ReturnType<TaskRunner[typeof this.detectionMethodName]>)
    if (processedResult) { this.result.set(processedResult) }
    this.lastRequestedAnimationFrame = requestAnimationFrame(this.performAnalysis)
  }

  protected getProcessedResult(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rawResult: ReturnType<TaskRunner[typeof this.detectionMethodName]>
  ): Result {
    throw new NotImplementedError()
  }

}

/**
 * @public
 */
export class BaseLandmarkAnalyzer<Landmarker extends VisionLandmarker, Result> extends BaseVisionAnalyzer<Landmarker, Result> {

  constructor(
    videoElement: HTMLVideoElement,
    initialResult: Result,
    taskRunnerGetter: LazyValue<Awaitable<Landmarker>>,
  ) {
    super(videoElement, initialResult, taskRunnerGetter, 'detectForVideo')
  }

}
