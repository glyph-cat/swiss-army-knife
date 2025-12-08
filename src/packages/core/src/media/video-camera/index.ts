import { Dimension2D, PossiblyUndefined } from '@glyph-cat/foundation'
import { ReadOnlyStateManager, SimpleFiniteStateManager, SimpleStateManager } from 'cotton-box'
import { createEnumToStringConverter, isFunction } from '../../data'
import { TemplateStyles } from '../../styling'

/**
 * @public
 */
export class VideoCamera {

  static readonly DEFAULT_CONSTRAINTS: MediaStreamConstraints = {
    video: {
      facingMode: 'user',
      height: { min: 240, ideal: 240 },
      width: { min: 320, ideal: 320 },
      // KIV: max used to be 3840x2160, there seemed to be articles in the past mentioning that the `max` value is necessary for it to work in some browsers or their versions or under certain conditions, but it doesn't make sense for us to specify a `max` value because we only want them to be as low as possible.
    },
  }

  static createConstraintWithExactDeviceId(
    deviceId: string,
    otherOptions?: Omit<MediaStreamConstraints, 'video'>
  ): MediaStreamConstraints {
    return {
      ...otherOptions,
      video: {
        deviceId: {
          exact: deviceId,
        },
      },
    }
  }

  /**
   * @internal
   */
  private M$mediaStream: PossiblyUndefined<MediaStream>

  /**
   * @internal
   */
  private readonly M$state = new SimpleFiniteStateManager(VideoCamera.State.CREATED, [
    [VideoCamera.State.CREATED, VideoCamera.State.STARTING],
    [VideoCamera.State.CREATED, VideoCamera.State.DISPOSED],
    [VideoCamera.State.STARTING, VideoCamera.State.STARTED],
    [VideoCamera.State.STARTING, VideoCamera.State.DENIED],
    [VideoCamera.State.STARTING, VideoCamera.State.OVERCONSTRAINED],
    [VideoCamera.State.DENIED, VideoCamera.State.DISPOSED],
    [VideoCamera.State.OVERCONSTRAINED, VideoCamera.State.DISPOSED],
    [VideoCamera.State.STARTED, VideoCamera.State.STOPPED],
    [VideoCamera.State.STARTED, VideoCamera.State.DENIED],
    [VideoCamera.State.STOPPED, VideoCamera.State.STARTING],
    [VideoCamera.State.STOPPED, VideoCamera.State.DISPOSED],
  ], {
    name: 'VideoCamera',
    serializeState: createEnumToStringConverter(VideoCamera.State),
  })

  get state(): ReadOnlyStateManager<VideoCamera.State> {
    return this.M$state
  }

  /**
   * @internal
   */
  private readonly M$videoDimensions = new SimpleStateManager<Dimension2D>({
    height: 0,
    width: 0,
  })

  get videoDimensions(): ReadOnlyStateManager<Dimension2D> {
    return this.M$videoDimensions
  }

  readonly videoElement: HTMLVideoElement

  constructor(appendVideoElement = false) {
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.dispose = this.dispose.bind(this)
    this.videoElement = document.createElement('video')
    this.videoElement.className = TemplateStyles.hidden
    this.videoElement.controls = false
    this.videoElement.muted = true
    if (appendVideoElement) {
      document.body.append(this.videoElement)
    }
  }

  /**
   * @returns `true` if the operation is successful. Returns `false` if the
   * camera is starting, has already been started, or if permission is denied.
   */
  async start(constraints: MediaStreamConstraints): Promise<boolean> {
    if (!this.M$state.trySet(VideoCamera.State.STARTING)) {
      return false // Early exit
    }
    try {
      this.M$mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      this.videoElement.srcObject = this.M$mediaStream
      await this.videoElement.play()
      this.M$videoDimensions.set({
        height: this.videoElement.videoHeight,
        width: this.videoElement.videoWidth,
      })
      this.videoElement.height = this.videoElement.videoHeight
      this.videoElement.width = this.videoElement.videoWidth
      // KIV: How to listen for changes in permission
      // so that we can trigger state change from started to denied?
      // we would also need to unwatch when stopped,
      // suppose if it is influenced by external methods instead of using the `.stop` method
      // Not all browsers behave the same, in Firefox we can check the 'pause' event
      return this.M$state.trySet(VideoCamera.State.STARTED)
    } catch (error) {
      if (error instanceof OverconstrainedError) {
        this.M$state.set(VideoCamera.State.OVERCONSTRAINED)
      } else if (error instanceof DOMException) {
        this.M$state.set(VideoCamera.State.DENIED)
      } else {
        throw error
      }
      return false
    }
  }

  /**
   * @returns `false` if the camera is already stopped, otherwise `true`.
   */
  async stop(): Promise<boolean> {
    await this.M$state.wait((s) => s !== VideoCamera.State.STARTING)
    this.M$stopBase()
    return this.M$state.trySet(VideoCamera.State.STOPPED)
  }

  // TODO: [low priority] explore this approach
  // changeDevice(deviceId: string): void {
  //   // this.mediaStream.getVideoTracks()[0].applyConstraints({})
  //   // isNull(deviceId)
  //   //   ? defaultVideoConstraints
  //   //   : exactDeviceIDConstraint(deviceId)
  // }

  /**
   * @returns A promise that resolves to `false` if the instance is already disposed,
   * otherwise `true`.
   */
  async dispose(): Promise<boolean> {
    await this.state.wait((s) => s !== VideoCamera.State.STARTING)
    this.M$stopBase()
    this.videoElement?.remove()
    this.M$videoDimensions.dispose()
    const payload = this.M$state.trySet(VideoCamera.State.DISPOSED)
    this.M$state.dispose()
    return payload
  }

  /**
   * @internal
   */
  private M$stopBase(): void {
    // Ref: https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop
    if (isFunction(this.M$mediaStream?.getTracks)) {
      this.M$mediaStream.getTracks().forEach((track) => track.stop())
    }
    this.videoElement.pause()
  }

}

/**
 * @public
 */
export namespace VideoCamera {

  /**
   * @public
   */
  export enum State {
    CREATED,
    STARTING,
    DENIED,
    OVERCONSTRAINED,
    STARTED,
    STOPPED,
    DISPOSED,
  }

}
