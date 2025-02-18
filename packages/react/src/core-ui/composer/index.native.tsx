import { IDisposable, UnsupportedPlatformError } from '@glyph-cat/swiss-army-knife'
import { CoreUIComposerConfigs } from './abstractions'

/**
 * @public
 */
export class CoreUIComposer implements IDisposable {

  constructor(
    public readonly key: string,
    /**
     * @internal
     */
    private readonly configs: Readonly<CoreUIComposerConfigs>,
  ) {
    throw new UnsupportedPlatformError()
  }

  dispose(): void { /* nothing to do here */ }

}

// #region Miscellaneous exports
export * from './abstractions/public'
// #endregion Miscellaneous exports
