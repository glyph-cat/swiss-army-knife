import {
  OnePersonBodyPoseAnalyzer,
  OnePersonHandGestureAnalyzer,
  OnePersonHandPoseAnalyzer,
  VisionAnalyzerState,
} from '@glyph-cat/ml-helpers'
import { createEnumToStringConverter, VideoCamera } from '@glyph-cat/swiss-army-knife'
import { SimpleFiniteStateManager } from 'cotton-box'

export class AppDelegate {

  readonly state = new SimpleFiniteStateManager(AppDelegate.State.STANDBY, [
    [AppDelegate.State.STANDBY, AppDelegate.State.STARTING],
    [AppDelegate.State.STANDBY, AppDelegate.State.DISPOSING],
    [AppDelegate.State.STARTING, AppDelegate.State.STARTED],
    [AppDelegate.State.STARTED, AppDelegate.State.STOPPING],
    [AppDelegate.State.STOPPING, AppDelegate.State.STANDBY],
    [AppDelegate.State.DISPOSING, AppDelegate.State.DISPOSED],
  ], {
    name: 'AppDelegate',
    serializeState: createEnumToStringConverter(AppDelegate.State),
  })

  readonly videoCamera = new VideoCamera()
  readonly bodyPoseAnalyzer = new OnePersonBodyPoseAnalyzer(this.videoCamera.videoElement)
  readonly handPoseAnalyzer = new OnePersonHandPoseAnalyzer(this.bodyPoseAnalyzer)
  // readonly handGestureAnalyzer = new OnePersonHandGestureAnalyzer(this.bodyPoseAnalyzer)

  async startVision(): Promise<void> {
    this.state.set(AppDelegate.State.STARTING)
    await this.videoCamera.start()
    await this.bodyPoseAnalyzer.state.wait(VisionAnalyzerState.STANDBY)
    await this.bodyPoseAnalyzer.start()
    await this.handPoseAnalyzer.state.wait(VisionAnalyzerState.STANDBY)
    await this.handPoseAnalyzer.start()
    // await this.handGestureAnalyzer.state.wait(VisionAnalyzerState.STANDBY)
    // await this.handGestureAnalyzer.start()
    this.state.set(AppDelegate.State.STARTED)
  }

  async stopVision(): Promise<void> {
    this.state.set(AppDelegate.State.STOPPING)
    await Promise.all([
      // this.handGestureAnalyzer?.stop(),
      this.handPoseAnalyzer?.stop(),
      this.bodyPoseAnalyzer?.stop(),
    ])
    await this.videoCamera?.stop()
    this.state.set(AppDelegate.State.STANDBY)
  }

  async dispose(): Promise<void> {
    this.state.set(AppDelegate.State.DISPOSING)
    await Promise.all([
      // this.handGestureAnalyzer?.dispose(),
      this.handPoseAnalyzer?.dispose(),
      this.bodyPoseAnalyzer?.dispose(),
    ])
    this.videoCamera?.dispose()
    this.state.set(AppDelegate.State.DISPOSED)
    this.state.dispose()
  }

}

export namespace AppDelegate {

  export enum State {
    STANDBY,
    STARTING,
    STARTED,
    STOPPING,
    DISPOSING,
    DISPOSED,
  }

}
