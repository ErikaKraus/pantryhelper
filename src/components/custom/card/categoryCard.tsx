'use client'
import {FunctionComponent} from 'react'
import Link from 'next/link'
import {Card,  CardTitle} from '@/components/ui/card'
import { motion } from 'framer-motion'

interface CategoryCardProps {
    title: string
    link: string
}

const CategoryCard: FunctionComponent<CategoryCardProps> = ({title, link}) => {
    return (
        <motion.div whileHover={{scale: 1.05}}>
            <Link href={link}>
                <Card className="min-h-40 flex items-center justify-center">
                    <CardTitle className="text-center text-lg sm:text-l md:text-xl lg:text-2xl">
                       {title}
                     </CardTitle>
                </Card>
            </Link>
        </motion.div>
    )
}

export default CategoryCard
