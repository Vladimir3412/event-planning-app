import '@mantine/core/styles.css'
import '@/app/shared/styles/index.css'
import '@mantine/dates/styles.css'

import type { Metadata } from 'next'
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from './widgets/header'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
})

export const metadata: Metadata = {
    title: 'Event Planning App',
    description: 'Creating an interactive service for planning group events'
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
            {...mantineHtmlProps}
        >
            <head>
                <ColorSchemeScript defaultColorScheme="auto" />
            </head>
            <body className="bg-header text-foreground min-h-full">
                <MantineProvider>
                    <div className="flex min-h-screen w-full flex-col">
                        <Header />
                        <main className="bg-content flex-1 p-8">{children}</main>
                    </div>
                </MantineProvider>
            </body>
        </html>
    )
}
