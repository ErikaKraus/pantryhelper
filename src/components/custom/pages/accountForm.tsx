'use client'

import {FunctionComponent,} from 'react'
import {Profile} from '@models'
import Actions from '@actions'
import ActionButton from '@/components/custom/button/actionButton'

interface AccountFormProps {
  profile: Profile
}

const AccountForm: FunctionComponent<AccountFormProps> = ({profile}) => {
  return (
    <div className="space-y-8 pb-8">
      <h1 className="text-3xl font-bold text-center">Mijn account</h1>

      <div className="mx-auto w-[75vw] max-w-3xl border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Persoonlijke gegevens</h2>

        <div className="mb-4">
          <span className="block text-sm font-medium text-muted-foreground">Voornaam</span>
          <p className="text-base">{profile.firstName}</p>
        </div>

        <div className="mb-4">
          <span className="block text-sm font-medium text-muted-foreground">Achternaam</span>
          <p className="text-base">{profile.lastName}</p>
        </div>

        <div className="mb-4">
          <span className="block text-sm font-medium text-muted-foreground">E-mail</span>
          <p className="text-base">{profile.email}</p>
        </div>

        <div className="mt-6">
          <ActionButton action={Actions.signOut} >
            Uitloggen
          </ActionButton>
        </div>
      </div>
    </div>
  )
}

export default AccountForm
