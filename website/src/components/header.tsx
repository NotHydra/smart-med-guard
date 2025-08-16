'use client';

import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
    const [currentDate, setCurrentDate] = useState<string>('');

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString());
    }, []);

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className="w-full flex-1">
                <h1 className="text-xl font-semibold">Smart Med Guard Dashboard</h1>

                <p className="text-sm text-muted-foreground">Real-Time Medical Facility Monitoring</p>
            </div>

            <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />

                <span className="text-muted-foreground">{currentDate}</span>
            </div>
        </header>
    );
}
