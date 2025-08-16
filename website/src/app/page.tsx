'use client';
import { AlertCircle, Droplets, Stethoscope, Thermometer, User, Wifi } from 'lucide-react';

import { Header } from '@/components/header';
import { IoTDeviceCard } from '@/components/iot-device-card';
import { KeyMetricCard } from '@/components/key-metric-card';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
    const iotDevices = [
        {
            id: 'cmecl1ysi07yqo50y5nhd0wto',
            agency: 'Pertamina Hospital',
            floor: '1st Floor',
            room: 'Melati 001',
        },
        {
            id: 'cm1234ysi07yqo50y5nhd0wto',
            agency: 'Pertamina Hospital',
            floor: '1st Floor',
            room: 'Melati 001',
        },
    ];

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[160px_1fr] lg:grid-cols-[220px_1fr]">
            <Sidebar />

            <div className="flex flex-col">
                <Header />

                <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <KeyMetricCard title="Active Devices" icon={<Wifi className="h-4 w-4 text-green-600" />} value={'18'} />

                        <KeyMetricCard title="Offline Devices" icon={<AlertCircle className="h-4 w-4 text-red-600" />} value={'2'} />

                        <KeyMetricCard title="Occupied Rooms" icon={<User className="h-4 w-4 text-green-600" />} value={'16'} />

                        <KeyMetricCard title="Unoccupied Rooms" icon={<User className="h-4 w-4 text-gray-500" />} value={'2'} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                        <KeyMetricCard title="Avg Temperature" icon={<Thermometer className="h-4 w-4 text-orange-600" />} value={'43.2 °C'} />

                        <KeyMetricCard title="Avg Humidity" icon={<Droplets className="h-4 w-4 text-blue-600" />} value={'45.2%'} />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Stethoscope className="h-5 w-5 text-blue-600" /> IoT Device Monitoring
                                <span className="ml-auto text-sm text-muted-foreground">18 of 20 online</span>
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                                {iotDevices.map((device) => (
                                    <IoTDeviceCard key={device.id} id={device.id} agency={device.agency} floor={device.floor} room={device.room} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
