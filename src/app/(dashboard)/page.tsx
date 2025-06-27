import {FunctionComponent} from 'react'
import Homepage from '@/components/custom/pages/homepage'
import {getSessionProfileOrRedirect} from '@mediators'

interface PageProps {}

const Page: FunctionComponent<PageProps> = async () => {
  const profile = await getSessionProfileOrRedirect()

  return <Homepage />
}

export default Page
