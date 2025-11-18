'use client';

import { MobileSidebar } from '@/components/mobile-sidebar';

export function Header() {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <MobileSidebar />

            <div className="w-full flex-1">
                <h1 className="text-xl font-semibold">SmartMedGuard</h1>

                <p className="hidden md:block text-sm text-muted-foreground">Real-Time Patient Room Monitoring System</p>
            </div>
        </header>
    );
}
