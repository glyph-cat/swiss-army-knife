import { APIRoute } from '~constants'
import { networkGet } from '~utils/network'
import { APIGetAllSandboxesReturnData } from './abstractions'

export async function APIGetAllSandboxes(): Promise<APIGetAllSandboxesReturnData> {
  const res = await networkGet<undefined, APIGetAllSandboxesReturnData>(
    APIRoute.sandboxes.getAll,
  )
  return res.data
}
