import {FunctionComponent, PropsWithChildren, ReactNode} from 'react'
import {SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar'
import {AppSidebar} from '@/components/custom/navbar/app-sidebar'
import {redirect} from 'next/navigation'
import {getSessionProfile} from '@mediators'

interface LayoutProps {
  children: ReactNode
}

const Layout: FunctionComponent<PropsWithChildren> = async ({children}) => {
  const profile = await getSessionProfile()
  if (!profile) {
    redirect('/login')
  }

  return (
    <SidebarProvider>
      <AppSidebar user={profile!} />
      <main className="flex-1 w-full p-6">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Layout
