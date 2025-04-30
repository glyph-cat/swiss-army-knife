import { SimpleFiniteStateManager, SimpleStateManager } from 'cotton-box'
import { isFunction } from '../../data'
import { waitForHTMLMediaElementToPlay } from '../../dom'
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

  private mediaStream: MediaStream

  readonly state = new SimpleFiniteStateManager(VideoCamera.State.CREATED, [
    [VideoCamera.State.CREATED, VideoCamera.State.STARTING],
    [VideoCamera.State.CREATED, VideoCamera.State.DISPOSED],
    [VideoCamera.State.STARTING, VideoCamera.State.STARTED],
    [VideoCamera.State.STARTING, VideoCamera.State.DENIED],
    [VideoCamera.State.DENIED, VideoCamera.State.DISPOSED],
    [VideoCamera.State.STARTED, VideoCamera.State.STOPPED],
    [VideoCamera.State.STOPPED, VideoCamera.State.STARTED],
    [VideoCamera.State.STOPPED, VideoCamera.State.DISPOSED],
  ], {
    serializeState(state) {
      return VideoCamera.State[state] ?? String(state)
    },
  })

  readonly videoElement: HTMLVideoElement
  readonly videoDimensions = new SimpleStateManager<Dimension2D>({
    height: 0,
    width: 0,
  })

  constructor() {
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.dispose = this.dispose.bind(this)
    this.videoElement = document.createElement('video')
    this.videoElement.autoplay = true // KIV: find out why we need this for live video input
    this.videoElement.className = TemplateStyles.hidden
    this.videoElement.controls = false
    this.videoElement.muted = true
    document.body.append(this.videoElement)
  }

  /**
   * @param preferredMediaDeviceId - This can be based on a persisted state or
   * user preference.
   */
  async start(preferredMediaDeviceId?: string): Promise<void> {
    this.state.set(VideoCamera.State.STARTING)
    try {
      const constraints = preferredMediaDeviceId
        ? exactDeviceIDConstraint(preferredMediaDeviceId)
        : defaultVideoConstraints
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      this.videoElement.srcObject = this.mediaStream
      await waitForHTMLMediaElementToPlay(this.videoElement)
      this.videoDimensions.set({
        height: this.videoElement.videoHeight,
        width: this.videoElement.videoWidth,
      })
      this.videoElement.height = this.videoElement.videoHeight
      this.videoElement.width = this.videoElement.videoWidth
      this.state.set(VideoCamera.State.STARTED)
    } catch (e) {
      console.error(e)
      this.state.set(VideoCamera.State.DENIED)
    }
  }

  async stop(): Promise<void> {
    if (this.state.get() === VideoCamera.State.STARTING) {
      await this.state.wait((s) => s > VideoCamera.State.STARTING)
    }
    if (isFunction(this.mediaStream?.getTracks)) {
      // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop
      const tracks = this.mediaStream.getTracks()
      for (const track of tracks) { track.stop() }
    }
    this.state.set(VideoCamera.State.STOPPED)
  }

  // TODO: [low priority] explore this approach
  // changeDevice(deviceId: string): void {
  //   // this.mediaStream.getVideoTracks()[0].applyConstraints({})
  //   // isNull(deviceId)
  //   //   ? defaultVideoConstraints
  //   //   : exactDeviceIDConstraint(deviceId)
  // }

  async dispose(): Promise<void> {
    this.videoElement?.remove()
    this.state.set(VideoCamera.State.DISPOSED)
    this.state.dispose()
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
