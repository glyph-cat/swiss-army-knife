import { APIRoute } from '~constants'
import { networkPost } from '~utils/network'
import { APICreateSandboxParams } from './abstractions'

export async function APICreateSandbox(): Promise<void> {
  const res = await networkPost<undefined, APICreateSandboxParams, void>(
    APIRoute.sandboxes.create,
  )
  return res.data
}
