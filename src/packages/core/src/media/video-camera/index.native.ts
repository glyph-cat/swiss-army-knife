import { UnsupportedPlatformError } from '../../error'

/**
 * @public
 */
export class VideoCamera {

  constructor() {
    throw new UnsupportedPlatformError()
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
    RESTARTING,
    STOPPED,
    DISPOSED,
  }

}
