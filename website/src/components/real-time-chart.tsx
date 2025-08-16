'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface DataPoint {
    time: string;
    value: number;
}

interface RealTimeChartProps {
    title: string;
    data: DataPoint[];
    currentValue: number;
    unit: string;
    color: string;
    trend: 'up' | 'down' | 'stable';
    icon: React.ReactNode;
}

export function RealTimeChart({ title, data, currentValue, unit, color, trend, icon }: RealTimeChartProps) {
    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const range = maxValue - minValue || 1;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {currentValue}
                    {unit}
                </div>
                <div className="mt-4 h-[80px] w-full">
                    <svg className="w-full h-full" viewBox="0 0 300 80">
                        <defs>
                            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
                                <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.05 }} />
                            </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        <g stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5">
                            <line x1="0" y1="20" x2="300" y2="20" />
                            <line x1="0" y1="40" x2="300" y2="40" />
                            <line x1="0" y1="60" x2="300" y2="60" />
                        </g>

                        {/* Chart area */}
                        <path
                            d={`M ${data
                                .map((point, index) => {
                                    const x = (index / (data.length - 1)) * 300;
                                    const y = 80 - ((point.value - minValue) / range) * 60 - 10;
                                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                                })
                                .join(' ')}`}
                            stroke={color}
                            strokeWidth="2"
                            fill="none"
                        />

                        {/* Fill area */}
                        <path
                            d={`M ${data
                                .map((point, index) => {
                                    const x = (index / (data.length - 1)) * 300;
                                    const y = 80 - ((point.value - minValue) / range) * 60 - 10;
                                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                                })
                                .join(' ')} L 300 80 L 0 80 Z`}
                            fill={`url(#gradient-${color})`}
                        />

                        {/* Data points */}
                        {data.map((point, index) => {
                            const x = (index / (data.length - 1)) * 300;
                            const y = 80 - ((point.value - minValue) / range) * 60 - 10;
                            return <circle key={index} cx={x} cy={y} r="2" fill={color} />;
                        })}
                    </svg>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    {trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                    {trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                    <span className={`text-xs ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}`}>{trend === 'up' ? 'Trending up' : trend === 'down' ? 'Trending down' : 'Stable'}</span>
                </div>
            </CardContent>
        </Card>
    );
}
