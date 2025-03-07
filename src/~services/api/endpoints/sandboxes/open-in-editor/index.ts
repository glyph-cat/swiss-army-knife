import { APIRoute } from '~constants'
import { networkPost } from '~utils/network'
import { APIOpenSandboxInEditorParams } from './abstractions'

export async function APIOpenSandboxInEditor(
  params: APIOpenSandboxInEditorParams,
): Promise<void> {
  await networkPost<undefined, APIOpenSandboxInEditorParams, void>(
    APIRoute.sandboxes.openInEditor,
    undefined,
    params,
  )
}
