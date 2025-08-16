import { Calendar } from 'lucide-react';

export function Header() {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className="w-full flex-1">
                <h1 className="text-xl font-semibold">Smart Med Guard Dashboard</h1>

                <p className="text-sm text-muted-foreground">Real-Time Medical Facility Monitoring</p>
            </div>

            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>

                    <span className="text-muted-foreground">Connected To Server</span>
                </div>

                <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />

                    <span className="text-muted-foreground">{new Date().toLocaleDateString()}</span>
                </div>
            </div>
        </header>
    );
}
