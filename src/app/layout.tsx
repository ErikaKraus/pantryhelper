import type {Metadata} from 'next'
import './globals.css'
import {FunctionComponent, PropsWithChildren} from 'react'

export const metadata: Metadata = {
    title: 'Pantry Helper',
    description: 'Keep track of your groceries.',
    authors: [
        {
            name: 'Erika Kraus',
        },
    ],
}

const RootLayout: FunctionComponent<PropsWithChildren> = ({children}) => {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    )
}

export default RootLayout
