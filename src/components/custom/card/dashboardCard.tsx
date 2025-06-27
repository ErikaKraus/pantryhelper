'use client'
import {FunctionComponent} from 'react'
import Link from 'next/link'
import {motion} from 'framer-motion'
import {LucideIcon} from 'lucide-react'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'

interface DashboardCardProps {
  title: string
  description: string
  Icon: LucideIcon
  link: string
  [key: string]: any
}

const DashboardCard: FunctionComponent<DashboardCardProps> = ({title, description, Icon, link, ...props}) => {
  return (
    <motion.div whileHover={{scale: 1.05}} {...props}>
      <Link href={link}>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Icon size={20} />
              <CardTitle>{title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>{description}</CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

export default DashboardCard
