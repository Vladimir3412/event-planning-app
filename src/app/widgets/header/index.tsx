import { Button, Input } from '@mantine/core'
import { ThemeSwitcher } from '../theme'

export const Header = () => {
    return (
        <header className="lg:py-auto border-border bg-header sticky top-0 z-100 flex h-auto w-full flex-col items-center justify-between gap-3 border-b px-4 py-4 backdrop-blur-sm lg:h-20 lg:flex-row">
            <div className="flex w-full flex-row justify-between gap-2 lg:w-1/4">
                <h1 className="text-2xl font-semibold">GroupPlan</h1>
            </div>
            <div className="flex w-full flex-row items-center justify-between gap-3 lg:w-3/4 lg:justify-end">
                <div className="flex flex-row gap-1 lg:gap-3">
                    <ThemeSwitcher />
                </div>
            </div>
        </header>
    )
}
