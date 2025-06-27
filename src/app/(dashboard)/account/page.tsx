import {FunctionComponent} from 'react'
import {getSessionProfileOrRedirect} from '@mediators'
import AccountForm from '@/components/custom/pages/accountForm'

interface PageProps {}

const AccountPage: FunctionComponent<PageProps> = async () => {
  const profile = await getSessionProfileOrRedirect()

  return (
    <div className="p-8">
      <AccountForm profile={profile} />
    </div>
  )
}

export default AccountPage
