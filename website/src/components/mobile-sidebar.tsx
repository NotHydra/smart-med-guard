'use client';

import { Activity, Menu, Shield } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function MobileSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" /> <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="flex flex-col p-0">
                <SheetHeader className="border-b px-4 py-4">
                    <SheetTitle className="flex items-center gap-2 text-left">
                        <Shield className="h-6 w-6 text-blue-600" /> <span className="text-blue-600">SmartMedGuard</span>
                    </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-2 p-4">
                    <div className="space-y-1">
                        <h4 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Monitoring</h4>

                        <Link href="/" className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:bg-accent hover:text-accent-foreground" onClick={() => setOpen(false)}>
                            <Activity className="h-4 w-4" /> Dashboard
                        </Link>
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
