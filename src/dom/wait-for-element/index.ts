/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
 * @public
 */
export enum HTMLMediaElementReadyState {
  HAVE_NOTHING,
  HAVE_METADATA,
  HAVE_CURRENT_DATA,
  HAVE_FUTURE_DATA,
  HAVE_ENOUGH_DATA,
}

/**
 * Waits for a HTML media element is completely ready.
 * @param element - The HTML media element to wait for.
 * @returns A promise that resolves when the HTML media element is completely ready.
 * @public
 */
export function waitForHTMLMediaElementData(element: HTMLMediaElement): Promise<void> {
  if (element.readyState >= HTMLMediaElementReadyState.HAVE_ENOUGH_DATA) {
    return Promise.resolve()
  } else {
    return new Promise((resolve) => {
      const onLoadedData = () => {
        element.removeEventListener('loadeddata', onLoadedData)
        resolve()
      }
      element.addEventListener('loadeddata', onLoadedData)
    })
  }
}

/**
 * Checks if a HTML media element is playing.
 * @param element - The HTML media element to check.
 * @returns `true` if the HTML media element is playing, otherwise `false`.
 * @public
 */
export function isPlaying(element: HTMLMediaElement): boolean {
  return element.readyState >= HTMLMediaElementReadyState.HAVE_ENOUGH_DATA &&
    !element.paused && !element.ended
}

/**
 * Waits for a HTML media element to play.
 * @param element - The HTML media element to wait for.
 * @returns A promise that resolves when the HTML media element starts playing.
 * @public
 */
export function waitForHTMLMediaElementToPlay(element: HTMLMediaElement): Promise<void> {
  // Reference: https://stackoverflow.com/a/6647216/5810737
  if (isPlaying(element)) {
    return Promise.resolve()
  } else {
    return new Promise((resolve) => {
      const onPlay = () => {
        element.removeEventListener('play', onPlay)
        resolve()
      }
      element.addEventListener('play', onPlay)
    })
  }
}
