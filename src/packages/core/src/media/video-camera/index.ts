import { ReadOnlyStateManager, SimpleFiniteStateManager, SimpleStateManager } from 'cotton-box'
import { createEnumToStringConverter, isFunction } from '../../data'
import { Dimension2D } from '../../math'
import { TemplateStyles } from '../../styling'

const defaultVideoConstraints: MediaStreamConstraints = {
  video: {
    facingMode: 'user',
    height: { min: 240, ideal: 240 },
    width: { min: 320, ideal: 320 },
    // KIV: max used to be 3840x2160, there seemed to be articles in the past mentioning that the `max` value is necessary for it to work in some browsers or their versions or under certain conditions, but it doesn't make sense for us to specify a `max` value because we only want them to be as low as possible.
  },
}

function exactDeviceIDConstraint(deviceId: string): MediaStreamConstraints {
  return {
    video: {
      deviceId: {
        exact: deviceId,
      },
    },
  }
}

/**
 * @public
 */
export class VideoCamera {

  /**
   * @internal
   */
  private mediaStream: MediaStream

  readonly videoElement: HTMLVideoElement

  /**
   * @internal
   */
  private readonly _state = new SimpleFiniteStateManager(VideoCamera.State.CREATED, [
    [VideoCamera.State.CREATED, VideoCamera.State.STARTING],
    [VideoCamera.State.CREATED, VideoCamera.State.DISPOSED],
    [VideoCamera.State.STARTING, VideoCamera.State.STARTED],
    [VideoCamera.State.STARTING, VideoCamera.State.DENIED],
    [VideoCamera.State.DENIED, VideoCamera.State.DISPOSED],
    [VideoCamera.State.STARTED, VideoCamera.State.STOPPED],
    [VideoCamera.State.STARTED, VideoCamera.State.DENIED],
    [VideoCamera.State.STOPPED, VideoCamera.State.STARTING],
    [VideoCamera.State.STOPPED, VideoCamera.State.DISPOSED],
  ], {
    name: 'VideoCamera',
    serializeState: createEnumToStringConverter(VideoCamera.State),
  })

  get state(): ReadOnlyStateManager<VideoCamera.State> {
    return this._state
  }

  /**
   * @internal
   */
  private readonly _videoDimensions = new SimpleStateManager<Dimension2D>({
    height: 0,
    width: 0,
  })

  get videoDimensions(): ReadOnlyStateManager<Dimension2D> {
    return this._videoDimensions
  }

  constructor() {
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.dispose = this.dispose.bind(this)
    this.videoElement = document.createElement('video')
    this.videoElement.className = TemplateStyles.hidden
    this.videoElement.controls = false
    this.videoElement.muted = true
    document.body.append(this.videoElement)
  }

  /**
   * @param preferredMediaDeviceId - This can be based on user preference
   * in a persisted state.
   * @returns `true` if the operation is successful. Returns `false` if the
   * camera is starting, has already been started, or if permission is denied.
   */
  async start(preferredMediaDeviceId?: string): Promise<boolean> {
    if (!this._state.trySet(VideoCamera.State.STARTING)) {
      return false // Early exit
    }
    try {
      const constraints = preferredMediaDeviceId
        ? exactDeviceIDConstraint(preferredMediaDeviceId)
        : defaultVideoConstraints
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      this.videoElement.srcObject = this.mediaStream
      await this.videoElement.play()
      this._videoDimensions.set({
        height: this.videoElement.videoHeight,
        width: this.videoElement.videoWidth,
      })
      this.videoElement.height = this.videoElement.videoHeight
      this.videoElement.width = this.videoElement.videoWidth
      // KIV: How to listen for changes in permission so that we can trigger state change to denied?
      // we would also need to unwatch when stopped
      // Not all browsers behave the same, in Firefox we can check the 'pause' event
      return this._state.trySet(VideoCamera.State.STARTED)
    } catch (error) {
      if (error instanceof DOMException) {
        this._state.set(VideoCamera.State.DENIED)
        return false
      } else {
        throw error
      }
    }
  }

  /**
   * @returns `false` if the camera is already stopped, otherwise `true`.
   */
  async stop(): Promise<boolean> {
    await this._state.wait((s) => s !== VideoCamera.State.STARTING)
    if (isFunction(this.mediaStream?.getTracks)) {
      // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop
      const tracks = this.mediaStream.getTracks()
      for (const track of tracks) { track.stop() }
    }
    this.videoElement.pause()
    return this._state.trySet(VideoCamera.State.STOPPED)
  }

  // TODO: [low priority] explore this approach
  // changeDevice(deviceId: string): void {
  //   // this.mediaStream.getVideoTracks()[0].applyConstraints({})
  //   // isNull(deviceId)
  //   //   ? defaultVideoConstraints
  //   //   : exactDeviceIDConstraint(deviceId)
  // }

  /**
   * @returns `false` if the instance is already disposed, otherwise `true`.
   */
  async dispose(): Promise<boolean> {
    await this.stop()
    this._videoDimensions.dispose()
    this.videoElement?.remove()
    const payload = this._state.trySet(VideoCamera.State.DISPOSED)
    this._state.dispose()
    return payload
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
    STARTED,
    STOPPED,
    DISPOSED,
  }

}
