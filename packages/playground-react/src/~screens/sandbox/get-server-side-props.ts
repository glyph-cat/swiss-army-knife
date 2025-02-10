import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import type { SandboxScreenProps } from '.'

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<SandboxScreenProps>> {
  return {
    props: {
      name: String(context.query.name),
    },
  }
}
