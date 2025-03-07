import { APIRoute } from '~constants'
import { networkPost } from '~utils/network'
import { APICreateSandboxParams } from './abstractions'

export async function APICreateSandbox(params: APICreateSandboxParams): Promise<void> {
  const res = await networkPost<undefined, APICreateSandboxParams, void>(
    APIRoute.sandboxes.create,
    undefined,
    params,
  )
  return res.data
}
