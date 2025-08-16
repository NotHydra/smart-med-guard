'use client';

import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, Battery, CheckCircle, Clock, Droplets, Minus, Signal, Thermometer, TrendingDown, TrendingUp, Users, Wifi, WifiOff } from 'lucide-react';

interface IoTDevice {
    id: string;
    agency: string;
    floor: string;
    room: string;
    roomType: string;
    status: 'online' | 'offline' | 'warning';
    temperature: number | null;
    humidity: number | null;
    occupancy: boolean | null;
    batteryLevel: number;
    signalStrength: number;
    lastUpdate: string;
    temperatureTrend: 'up' | 'down' | 'stable' | 'unknown';
    humidityTrend: 'up' | 'down' | 'stable' | 'unknown';
    alerts: string[];
    patientCapacity: number;
    currentPatients: number;
    deviceHealth: 'excellent' | 'good' | 'fair' | 'critical';
}

interface IoTDeviceCardProps {
    device: IoTDevice;
}

export function IoTDeviceCard({ device }: IoTDeviceCardProps) {
    // Helper functions
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online':
                return 'text-green-600';
            case 'offline':
                return 'text-red-600';
            case 'warning':
                return 'text-amber-600';
            default:
                return 'text-gray-600';
        }
    };

    const getHealthColor = (health: string) => {
        switch (health) {
            case 'excellent':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'good':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'fair':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="h-3 w-3 text-red-500" />;
            case 'down':
                return <TrendingDown className="h-3 w-3 text-blue-500" />;
            case 'stable':
                return <Minus className="h-3 w-3 text-green-500" />;
            default:
                return <Minus className="h-3 w-3 text-gray-400" />;
        }
    };

    const getBatteryColor = (level: number) => {
        if (level > 80) return 'text-green-600';
        if (level > 50) return 'text-amber-600';
        if (level > 20) return 'text-orange-600';
        return 'text-red-600';
    };

    const getSignalColor = (strength: number) => {
        if (strength > 80) return 'text-green-600';
        if (strength > 60) return 'text-amber-600';
        return 'text-red-600';
    };

    const getTemperatureStatus = (temp: number | null) => {
        if (temp === null) return { status: 'unknown', color: 'text-gray-500' };
        if (temp < 18 || temp > 26) return { status: 'critical', color: 'text-red-600' };
        if (temp < 20 || temp > 24) return { status: 'warning', color: 'text-amber-600' };
        return { status: 'optimal', color: 'text-green-600' };
    };

    const getHumidityStatus = (humidity: number | null) => {
        if (humidity === null) return { status: 'unknown', color: 'text-gray-500' };
        if (humidity < 30 || humidity > 70) return { status: 'critical', color: 'text-red-600' };
        if (humidity < 40 || humidity > 60) return { status: 'warning', color: 'text-amber-600' };
        return { status: 'optimal', color: 'text-green-600' };
    };

    const temperatureStatus = getTemperatureStatus(device.temperature);
    const humidityStatus = getHumidityStatus(device.humidity);

    return (
        <Card className="relative overflow-hidden">
            {/* Status indicator */}
            <div className={`absolute top-0 left-0 w-full h-1 ${device.status === 'online' ? 'bg-green-500' : device.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />

            <CardContent className="p-4 space-y-3">
                {/* Device Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">{device.room}</h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getHealthColor(device.deviceHealth)}`}>{device.deviceHealth}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{device.agency}</p>
                        <p className="text-xs text-muted-foreground">
                            {device.floor} • {device.roomType}
                        </p>
                    </div>
                    <div className="flex items-center gap-1">
                        {device.status === 'online' ? (
                            <div className="flex items-center gap-1">
                                <Wifi className={`h-4 w-4 ${getStatusColor(device.status)}`} />
                                <CheckCircle className={`h-4 w-4 ${getStatusColor(device.status)}`} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <WifiOff className={`h-4 w-4 ${getStatusColor(device.status)}`} />
                                <AlertTriangle className={`h-4 w-4 ${getStatusColor(device.status)}`} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Environmental Data */}
                {device.status === 'online' ? (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1">
                                <Thermometer className="h-3 w-3 text-orange-600" />
                                <span className="text-xs text-muted-foreground">Temperature</span>
                                {getTrendIcon(device.temperatureTrend)}
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-semibold">{device.temperature}°C</p>
                                <span className={`text-xs px-1 py-0.5 rounded ${temperatureStatus.color} bg-opacity-10`}>{temperatureStatus.status}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1">
                                <Droplets className="h-3 w-3 text-cyan-600" />
                                <span className="text-xs text-muted-foreground">Humidity</span>
                                {getTrendIcon(device.humidityTrend)}
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-semibold">{device.humidity}%</p>
                                <span className={`text-xs px-1 py-0.5 rounded ${humidityStatus.color} bg-opacity-10`}>{humidityStatus.status}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-6">
                        <div className="text-center">
                            <WifiOff className="h-8 w-8 text-red-500 mx-auto mb-2" />
                            <span className="text-sm text-red-600 font-medium">Device Offline</span>
                            <p className="text-xs text-muted-foreground mt-1">No data available</p>
                        </div>
                    </div>
                )}

                {/* Patient & Device Info */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-muted-foreground">Occupancy</span>
                        </div>
                        <p className="text-sm font-medium">{device.status === 'online' ? `${device.currentPatients}/${device.patientCapacity} patients` : 'Unknown'}</p>
                        {device.status === 'online' && device.occupancy !== null && <p className="text-xs text-muted-foreground">{device.occupancy ? 'Currently occupied' : 'Currently vacant'}</p>}
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <Battery className={`h-3 w-3 ${getBatteryColor(device.batteryLevel)}`} />
                            <Signal className={`h-3 w-3 ${getSignalColor(device.signalStrength)}`} />
                            <span className="text-xs text-muted-foreground">Device</span>
                        </div>
                        <p className="text-sm">
                            <span className={`${getBatteryColor(device.batteryLevel)}`}>{device.batteryLevel}%</span>
                            <span className="text-muted-foreground"> • </span>
                            <span className={`${getSignalColor(device.signalStrength)}`}>{device.signalStrength}%</span>
                        </p>
                    </div>
                </div>

                {/* Active Alerts */}
                {device.alerts.length > 0 && (
                    <div className="pt-2 border-t">
                        <div className="flex items-center gap-1 mb-2">
                            <AlertCircle className="h-3 w-3 text-red-600" />
                            <span className="text-xs text-muted-foreground">Active Alerts</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {device.alerts.map((alert, index) => (
                                <span key={index} className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-50 text-red-700 border border-red-200">
                                    {alert.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Last Update */}
                <div className="pt-1 border-t">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last update: {device.lastUpdate}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
