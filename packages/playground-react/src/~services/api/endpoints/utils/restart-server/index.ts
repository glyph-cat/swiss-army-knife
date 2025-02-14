import { APIRoute } from '~constants'
import { networkGet } from '~utils/network'

export async function APIUtilsRestartServer(): Promise<void> {
  await networkGet(APIRoute.utils.restartServer)
}
