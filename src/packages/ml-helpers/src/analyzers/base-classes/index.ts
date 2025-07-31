import {
  Awaitable,
  createEnumToStringConverter,
  LazyValue,
  StringRecord,
} from '@glyph-cat/swiss-army-knife'
import { FilesetResolver } from '@mediapipe/tasks-vision'
import { SimpleFiniteStateManager, SimpleStateManager } from 'cotton-box'
import { VisionAnalyzerState, VisionLandmarker, WasmFileset } from '../../abstractions'

/**
 * @public
 */
export class FilesetResolverPath {

  /**
   * @internal
   */
  static _isLocked = false

  /**
   * @internal
   */
  private static _value = '/mediapipe/wasm'

  static get(): string { return this._value }

  /**
   * This can a the path to the wasm hosted on your server.
   * Alternative: https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm
   */
  static set(path: string): void {
    if (this._isLocked) {
      throw new Error('WASM path cannot be changed because the fileset has been loaded')
    }
    this._value = path
  }

}

/**
 * @public
 */
export enum DetectionMethod {
  detectForVideo = 'detectForVideo',
  recognizeForVideo = 'recognizeForVideo',
}

/**
 * @public
 */
export interface VisionAnalyzerOptions {
  /**
   * @defaultValue `false`
   */
  initializeImmediately?: boolean
}

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseVisionAnalyzer<TaskRunner extends StringRecord<any>, Result> {

  /**
   * @internal
   */
  private static readonly _vision = new LazyValue<Promise<WasmFileset>>(() => {
    FilesetResolverPath._isLocked = true
    return FilesetResolver.forVisionTasks(FilesetResolverPath.get())
  })

  protected static async getVision(): Promise<WasmFileset> {
    return this._vision.value
  }

  protected taskRunner: TaskRunner
  protected lastRequestedAnimationFrame: number
  readonly result: SimpleStateManager<Result>
  readonly state: SimpleFiniteStateManager<VisionAnalyzerState>

  constructor(
    readonly videoElement: HTMLVideoElement,
    initialResult: Result,
    private readonly getTaskRunner: () => Awaitable<TaskRunner>,
    readonly detectionMethodName: DetectionMethod,
    classDisplayName: string,
    options: VisionAnalyzerOptions,
  ) {

    this.initialize = this.initialize.bind(this)
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.performAnalysis = this.performAnalysis.bind(this)
    this.getProcessedResult = this.getProcessedResult.bind(this)
    this.dispose = this.dispose.bind(this)

    // NOTE: `initialResult` was originally an extendable/inheritable property
    // https://stackoverflow.com/a/43595944/5810737
    this.result = new SimpleStateManager<Result>(initialResult)

    this.state = new SimpleFiniteStateManager(VisionAnalyzerState.CREATED, [
      [VisionAnalyzerState.CREATED, VisionAnalyzerState.INITIALIZING],
      [VisionAnalyzerState.CREATED, VisionAnalyzerState.DISPOSED],
      [VisionAnalyzerState.INITIALIZING, VisionAnalyzerState.STANDBY],
      [VisionAnalyzerState.STANDBY, VisionAnalyzerState.ACTIVE],
      [VisionAnalyzerState.STANDBY, VisionAnalyzerState.DISPOSED],
      [VisionAnalyzerState.ACTIVE, VisionAnalyzerState.STANDBY],
      [VisionAnalyzerState.ACTIVE, VisionAnalyzerState.DISPOSED],
    ], {
      name: classDisplayName,
      serializeState: createEnumToStringConverter(VisionAnalyzerState),
    })

    if (options.initializeImmediately) {
      this.initialize()
    }

  }

  async initialize(): Promise<void> {
    // The only "from-state" allowed is CREATED
    this.state.set(VisionAnalyzerState.INITIALIZING)
    this.taskRunner = await this.getTaskRunner()
    // In case state changed (for example, to disposed, halfway), then keep that state.
    this.state.set((s) => s === VisionAnalyzerState.INITIALIZING ? VisionAnalyzerState.STANDBY : s)
  }

  async start(): Promise<void> {
    // if created, throw error
    // if initializing, wait
    // if standby, proceed
    // if started, throw error
    // if disposed, throw error
    let wasInitializing = false
    if (this.state.get() === VisionAnalyzerState.INITIALIZING) {
      wasInitializing = true
      await this.state.wait((s) => s > VisionAnalyzerState.INITIALIZING)
    }
    if (wasInitializing && this.state.get() !== VisionAnalyzerState.STANDBY) {
      // This can happen, for example, when class is disposed while it is halfway initializing.
      return // Early exit
    }
    // State is set before requesting animation frame because the callback depends on the state.
    this.state.set(VisionAnalyzerState.ACTIVE)
    this.lastRequestedAnimationFrame = requestAnimationFrame(this.performAnalysis)
  }

  async stop(): Promise<void> {
    // if created, throw error
    // if initializing, wait
    // if standby, return false
    // if active, can stop
    // if disposed, throw error
    await this.state.wait((s) => s === VisionAnalyzerState.CREATED || s > VisionAnalyzerState.STANDBY)
    // For safety, we don't gate-keep the core stopping logic behind state-checking.
    this._stopBase()
    if (this.state.get() === VisionAnalyzerState.DISPOSED) { return } // Early exit
    this.state.set(VisionAnalyzerState.STANDBY)
  }

  async dispose(): Promise<void> {
    // if created, can dispose
    // if initializing, wait
    // if standby, can dispose
    // if active, can dispose
    // if disposed, throw error
    await this.state.wait((s) => s !== VisionAnalyzerState.INITIALIZING)
    cancelAnimationFrame(this.lastRequestedAnimationFrame)
    // taskRunner.close()
    this.result.dispose()
    this.state.trySet(VisionAnalyzerState.DISPOSED)
    this.state.dispose()
    // NOTE: `taskRunner.close()` is not called and is meant to be kept until
    // the app closes. Calling `taskRunner.close()` on a class lifecycle basis
    // causes a lot of issues:
    // - it seems like there is memory leakage even when `.close()` is called
    // - even if there is no memory leakage, having to fetch and close repeatedly
    //   make the app very slow
    // - This is caught from within React's StrictMode + rapidly repeated soft reloads
    // - This can be a problem when the user intentionally stops and resumes
    //   the session multiple times
  }

  /**
   * @internal
   */
  private _stopBase(): void {
    cancelAnimationFrame(this.lastRequestedAnimationFrame)
  }

  /**
   * @internal
   */
  private async performAnalysis(): Promise<void> {
    if (this.state.get() !== VisionAnalyzerState.ACTIVE) { return } // Early exit
    const result = this.taskRunner[this.detectionMethodName](this.videoElement, performance.now())
    const processedResult = this.getProcessedResult(result as ReturnType<TaskRunner[typeof this.detectionMethodName]>)
    if (processedResult) { this.result.set(processedResult) }
    this.lastRequestedAnimationFrame = requestAnimationFrame(this.performAnalysis)
  }

  protected abstract getProcessedResult(
    rawResult: ReturnType<TaskRunner[typeof this.detectionMethodName]>
  ): Result

}

/**
 * @public
 */
export interface LandmarkAnalyzerOptions extends VisionAnalyzerOptions {
  flipHorizontally?: boolean
}

/**
 * @public
 */
export abstract class BaseLandmarkAnalyzer<Landmarker extends VisionLandmarker, Result> extends BaseVisionAnalyzer<Landmarker, Result> {

  constructor(
    videoElement: HTMLVideoElement,
    initialResult: Result,
    getTaskRunner: () => Awaitable<Landmarker>,
    displayName: string,
    options: LandmarkAnalyzerOptions,
  ) {
    super(
      videoElement,
      initialResult,
      getTaskRunner,
      DetectionMethod.detectForVideo,
      displayName,
      options,
    )
  }

}
