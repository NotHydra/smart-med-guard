'use client';

import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

import { MobileSidebar } from '@/components/mobile-sidebar';

export function Header() {
    const [currentDate, setCurrentDate] = useState<string>('');

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString());
    }, []);

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <MobileSidebar />

            <div className="w-full flex-1">
                <h1 className="text-xl font-semibold">SmartMedGuard</h1>

                <p className="hidden md:block text-sm text-muted-foreground">Real-Time Patient Room Monitoring System</p>
            </div>

            <div className="hidden md:block">
                <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />

                    <span className="text-muted-foreground">{currentDate}</span>
                </div>
            </div>
        </header>
    );
}
