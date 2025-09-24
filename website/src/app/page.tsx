'use client';

import axios, { AxiosResponse } from 'axios';
import { Stethoscope } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';

import { IoTDeviceInterface } from '@/common/interface/iot-device.interface';
import { ResponseFormatInterface } from '@/common/interface/response-format.interface';

import { Header } from '@/components/header';
import { IoTDeviceCard } from '@/components/iot-device-card';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
    const apiURL: string = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/iot-device/find/available`;
    const [iotDevices, setIoTDevices] = useState<IoTDeviceInterface[]>([]);

    useEffect((): void => {
        const fetchData = async (): Promise<void> => {
            try {
                const response: AxiosResponse<ResponseFormatInterface<IoTDeviceInterface[]>> = await axios.get(apiURL, {
                    headers: {
                        'X-API-Key': process.env.NEXT_PUBLIC_SERVER_API_KEY,
                    },
                });

                console.log(response);

                setIoTDevices(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [apiURL]);

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />

            <div className="flex flex-col">
                <Header />

                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <KeyMetricCard title="Active Devices" icon={<Wifi className="h-4 w-4 text-green-600" />} value={'18'} />

                        <KeyMetricCard title="Offline Devices" icon={<AlertCircle className="h-4 w-4 text-red-600" />} value={'2'} />

                        <KeyMetricCard title="Occupied Rooms" icon={<User className="h-4 w-4 text-green-600" />} value={'16'} />

                        <KeyMetricCard title="Unoccupied Rooms" icon={<User className="h-4 w-4 text-gray-500" />} value={'2'} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                        <KeyMetricCard title="Avg Temperature" icon={<Thermometer className="h-4 w-4 text-orange-600" />} value={'43.2 °C'} />

                        <KeyMetricCard title="Avg Humidity" icon={<Droplets className="h-4 w-4 text-blue-600" />} value={'45.2%'} />
                    </div> */}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Stethoscope className="h-5 w-5 text-blue-600" /> IoT Device Monitoring
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            {iotDevices.length > 0 ? (
                                <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
                                    {iotDevices.map(
                                        (iotDevice: IoTDeviceInterface): JSX.Element => (
                                            <IoTDeviceCard key={iotDevice.id} iotDevice={iotDevice} />
                                        ),
                                    )}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No IoT devices found</p>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
