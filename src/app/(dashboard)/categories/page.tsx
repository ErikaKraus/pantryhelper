import {FunctionComponent} from 'react'
import {getSessionProfileOrRedirect} from '@mediators'
import {getAllCategories} from '@dal'
import CategoryCard from '@/components/custom/card/categoryCard'
import {CreateDialog} from '@/components/custom/dialog/createDialog'
import {createCategorySchema} from '@schemas'
import {createCategory} from '@actions'
import {Input} from '@/components/ui/input'
import AddCategoryDialog from '@/components/custom/dialog/addCategoryDialog'


const CategoriesPage: FunctionComponent = async () => {
    const profile = await getSessionProfileOrRedirect()
    const categories = await getAllCategories(profile.groupId)

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Categorieën</h1>
                <AddCategoryDialog />

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {categories.map(category => (
                <CategoryCard key={category.id} title={category.name} link={`/categories/${category.id}`}  />
            ))}
            </div>

        </div>

    )
}

export default CategoriesPage
