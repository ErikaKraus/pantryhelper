'use client'
import {FunctionComponent} from 'react'
import DashboardCard from '@/components/custom/card/dashboardCard'
import {Apple, CookingPotIcon, ShoppingCartIcon} from 'lucide-react'

interface HomePageProps {}

const HomePage: FunctionComponent<HomePageProps> = () => {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 grid gap-6 grid-cols-1 md:grid-cols-3">
      <DashboardCard
        title="Voorraad"
        description="Beheer je producten in de voorraadkamer."
        Icon={Apple}
        link="/products"
        data-testid="productCard"
      />
      <DashboardCard
        title="Gerechten"
        description="Bekijk en beheer recepten gekoppeld aan je producten."
        Icon={CookingPotIcon}
        link="/dishes"
      />
      <DashboardCard
        title="Boodschappenlijstjes"
        description="Plan je inkopen voor de komende week."
        Icon={ShoppingCartIcon}
        link="/shoppinglists"
      />
    </main>
  )
}

export default HomePage
