import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function KeyMetricCard({ title, icon, value }: { title: string; icon: React.ReactNode; value: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>

                {icon}
            </CardHeader>

            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}
