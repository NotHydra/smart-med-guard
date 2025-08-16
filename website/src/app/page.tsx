'use client';
import { Activity, AlertCircle, AlertTriangle, Clock, Droplets, MapPin, Stethoscope, Thermometer, Users, Wifi } from 'lucide-react';

import { Header } from '@/components/header';
import { IoTDeviceCard } from '@/components/iot-device-card';
import { RealTimeChart } from '@/components/real-time-chart';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
    const stats = {
        activeDevices: 24,
        totalReadings: 15847,
        avgTemperature: 22.3,
        avgHumidity: 45.2,
        offlineDevices: 2,
        criticalAlerts: 3,
    };

    const temperatureData = [
        { time: '10:00', value: 21.5 },
        { time: '10:15', value: 22.1 },
        { time: '10:30', value: 22.8 },
        { time: '10:45', value: 22.3 },
        { time: '11:00', value: 22.7 },
        { time: '11:15', value: 23.1 },
        { time: '11:30', value: 22.9 },
        { time: '11:45', value: 22.3 },
    ];

    const humidityData = [
        { time: '10:00', value: 42.5 },
        { time: '10:15', value: 43.1 },
        { time: '10:30', value: 44.8 },
        { time: '10:45', value: 45.2 },
        { time: '11:00', value: 46.7 },
        { time: '11:15', value: 47.1 },
        { time: '11:30', value: 46.9 },
        { time: '11:45', value: 45.2 },
    ];

    const occupancyData = [
        { time: '10:00', value: 18 },
        { time: '10:15', value: 19 },
        { time: '10:30', value: 22 },
        { time: '10:45', value: 24 },
        { time: '11:00', value: 23 },
        { time: '11:15', value: 21 },
        { time: '11:30', value: 20 },
        { time: '11:45', value: 18 },
    ];

    const recentAlerts = [
        { id: 1, type: 'temperature', message: 'Critical temperature in ICU Room 301 - Patient safety risk', severity: 'error', time: '2 min ago', room: 'ICU-301', agency: 'Pertamina Hospital' },
        { id: 2, type: 'connectivity', message: 'Device offline in Melati 205 - No data received', severity: 'error', time: '5 min ago', room: 'Melati-205', agency: 'Pertamina Hospital' },
        { id: 3, type: 'humidity', message: 'Low humidity in Mawar 150 - Air quality concern', severity: 'warning', time: '12 min ago', room: 'Mawar-150', agency: 'Kanojoso Hospital' },
        { id: 4, type: 'occupancy', message: 'Extended occupancy in Emergency Room 101', severity: 'info', time: '25 min ago', room: 'ER-101', agency: 'Pertamina Hospital' },
    ];

    const iotDevices = [
        {
            id: 'pertamina-1-melati-001',
            agency: 'Pertamina Hospital',
            floor: '1st Floor',
            room: 'Melati 001',
            roomType: 'General Ward',
            status: 'online' as const,
            temperature: 22.4,
            humidity: 45,
            occupancy: true,
            batteryLevel: 87,
            signalStrength: 95,
            lastUpdate: '30 seconds ago',
            temperatureTrend: 'stable' as const,
            humidityTrend: 'up' as const,
            alerts: [],
            patientCapacity: 2,
            currentPatients: 1,
            deviceHealth: 'excellent' as const,
        },
        {
            id: 'pertamina-1-melati-002',
            agency: 'Pertamina Hospital',
            floor: '1st Floor',
            room: 'Melati 002',
            roomType: 'General Ward',
            status: 'online' as const,
            temperature: 23.1,
            humidity: 42,
            occupancy: false,
            batteryLevel: 92,
            signalStrength: 88,
            lastUpdate: '45 seconds ago',
            temperatureTrend: 'up' as const,
            humidityTrend: 'stable' as const,
            alerts: ['temperature_high'],
            patientCapacity: 2,
            currentPatients: 0,
            deviceHealth: 'good' as const,
        },
        {
            id: 'pertamina-1-melati-003',
            agency: 'Pertamina Hospital',
            floor: '1st Floor',
            room: 'Melati 003',
            roomType: 'General Ward',
            status: 'online' as const,
            temperature: 21.8,
            humidity: 48,
            occupancy: true,
            batteryLevel: 76,
            signalStrength: 92,
            lastUpdate: '1 minute ago',
            temperatureTrend: 'down' as const,
            humidityTrend: 'stable' as const,
            alerts: [],
            patientCapacity: 2,
            currentPatients: 1,
            deviceHealth: 'good' as const,
        },
        {
            id: 'kanojoso-2-mawar-001',
            agency: 'Kanojoso Hospital',
            floor: '2nd Floor',
            room: 'Mawar 001',
            roomType: 'Private Room',
            status: 'online' as const,
            temperature: 22.9,
            humidity: 44,
            occupancy: true,
            batteryLevel: 68,
            signalStrength: 78,
            lastUpdate: '2 minutes ago',
            temperatureTrend: 'stable' as const,
            humidityTrend: 'down' as const,
            alerts: ['battery_low'],
            patientCapacity: 1,
            currentPatients: 1,
            deviceHealth: 'fair' as const,
        },
        {
            id: 'kanojoso-2-mawar-002',
            agency: 'Kanojoso Hospital',
            floor: '2nd Floor',
            room: 'Mawar 002',
            roomType: 'Private Room',
            status: 'offline' as const,
            temperature: null,
            humidity: null,
            occupancy: null,
            batteryLevel: 0,
            signalStrength: 0,
            lastUpdate: '15 minutes ago',
            temperatureTrend: 'unknown' as const,
            humidityTrend: 'unknown' as const,
            alerts: ['offline', 'connection_lost'],
            patientCapacity: 1,
            currentPatients: 0,
            deviceHealth: 'critical' as const,
        },
        {
            id: 'kanojoso-2-mawar-003',
            agency: 'Kanojoso Hospital',
            floor: '2nd Floor',
            room: 'Mawar 003',
            roomType: 'ICU',
            status: 'online' as const,
            temperature: 20.5,
            humidity: 38,
            occupancy: true,
            batteryLevel: 94,
            signalStrength: 96,
            lastUpdate: '15 seconds ago',
            temperatureTrend: 'stable' as const,
            humidityTrend: 'down' as const,
            alerts: ['humidity_low'],
            patientCapacity: 1,
            currentPatients: 1,
            deviceHealth: 'excellent' as const,
        },
    ];

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[160px_1fr] lg:grid-cols-[220px_1fr]">
            <Sidebar />

            <div className="flex flex-col">
                <Header />

                <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
                    {/* Enhanced Key Metrics */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
                                <Wifi className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.activeDevices}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">+2</span> since yesterday
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Offline Devices</CardTitle>
                                <AlertCircle className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{stats.offlineDevices}</div>
                                <p className="text-xs text-muted-foreground">Require attention</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Readings</CardTitle>
                                <Activity className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalReadings.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">+12.5%</span> from yesterday
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
                                <Thermometer className="h-4 w-4 text-orange-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.avgTemperature}°C</div>
                                <p className="text-xs text-muted-foreground">Optimal: 20-24°C</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Humidity</CardTitle>
                                <Droplets className="h-4 w-4 text-cyan-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.avgHumidity}%</div>
                                <p className="text-xs text-muted-foreground">Optimal: 40-60%</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-amber-600">{stats.criticalAlerts}</div>
                                <p className="text-xs text-muted-foreground">Last 24 hours</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Real-time Charts */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <RealTimeChart title="Temperature Monitoring" data={temperatureData} currentValue={22.3} unit="°C" color="#f97316" trend="stable" icon={<Thermometer className="h-4 w-4 text-orange-600" />} />
                        <RealTimeChart title="Humidity Levels" data={humidityData} currentValue={45.2} unit="%" color="#06b6d4" trend="up" icon={<Droplets className="h-4 w-4 text-cyan-600" />} />
                        <RealTimeChart title="Room Occupancy" data={occupancyData} currentValue={18} unit=" rooms" color="#10b981" trend="down" icon={<Users className="h-4 w-4 text-green-600" />} />
                    </div>

                    {/* Enhanced Alerts and IoT Device Grid */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Recent Alerts - Takes 1 column */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                                    Recent Alerts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentAlerts.map((alert) => (
                                        <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                                            <div className={`h-2 w-2 rounded-full mt-2 ${alert.severity === 'error' ? 'bg-red-500' : alert.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">{alert.message}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {alert.agency} - {alert.room}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* IoT Device Detailed Status - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Stethoscope className="h-5 w-5 text-blue-600" />
                                        IoT Device Monitoring
                                        <span className="ml-auto text-sm text-muted-foreground">
                                            {iotDevices.filter((d) => d.status === 'online').length} of {iotDevices.length} online
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {iotDevices.map((device) => (
                                            <IoTDeviceCard key={device.id} device={device} />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
