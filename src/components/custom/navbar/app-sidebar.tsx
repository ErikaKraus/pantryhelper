'use client'

import * as React from 'react'
import {Apple, CircleAlert, CookingPotIcon, RefreshCcwIcon, ShoppingCartIcon, Tags} from 'lucide-react'
import {NavMain} from '@/components/custom/navbar/nav-main'
import {NavUser} from '@/components/custom/navbar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {Profile} from '@models'
import {FunctionComponent} from 'react'

interface AppSidebarProps {
  user: Profile
}

type Props = AppSidebarProps & React.ComponentProps<typeof Sidebar>

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Voorraad',
      url: '/products',
      icon: Apple,
    },
    {
      title: 'Lage voorraad',
      url: '/products/lowstock',
      icon: RefreshCcwIcon,
    },
    {
      title: 'Korte THT',
      url: '/products/short-expiry',
      icon: CircleAlert,
    },
    {
      title: 'Categorieën',
      url: '/categories',
      icon: Tags,
    },
    {
      title: 'Gerechten',
      url: '/dishes',
      icon: CookingPotIcon,
    },
    {
      title: 'Boodschappenlijstjes',
      url: '/shoppinglists',
      icon: ShoppingCartIcon,
    },
  ],
}

export const AppSidebar: FunctionComponent<AppSidebarProps> = ({user, ...sidebarProps}: Props) => {
  return (
    <Sidebar collapsible="offcanvas" {...sidebarProps}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/">
                <span className="text-base font-semibold">Voorraadkamer</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
