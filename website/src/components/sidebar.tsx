import { Activity, Shield } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Shield className="h-6 w-6 text-blue-600" /> <span className="text-blue-600">SmartMedGuard</span>
                    </Link>
                </div>

                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <div className="space-y-1 pb-2">
                            <h4 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Monitoring</h4>

                            <Link href="/" className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:bg-accent hover:text-accent-foreground">
                                <Activity className="h-4 w-4" /> Dashboard
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
}
