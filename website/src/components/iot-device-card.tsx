'use client';

import { Clock, Droplets, Thermometer, User, Wifi } from 'lucide-react';
import { JSX } from 'react';

import { IoTDeviceInterface } from '@/common/interface/iot-device.interface';

import { Card, CardContent } from '@/components/ui/card';

import { numberToOrdinal } from '@/utility/number-to-ordinal.utility';

export function IoTDeviceCard({ iotDevice }: { iotDevice: IoTDeviceInterface }): JSX.Element {
    return (
        <Card className="relative overflow-hidden">
            {/* <div className={`absolute top-0 left-0 w-full h-1 ${device.status === 'online' ? 'bg-green-500' : device.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} /> */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-green-500`} />

            <CardContent className="p-3 space-y-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">{iotDevice.room}</h3>
                        </div>

                        <p className="text-xs text-muted-foreground mt-1">
                            {iotDevice.agency} • {numberToOrdinal(iotDevice.floor)} Floor
                        </p>
                    </div>

                    {/* <div className="flex items-center gap-1">{device.status === 'online' ? <Wifi className={`h-4 w-4 text-green-600`} /> : <WifiOff className={`h-4 w-4 text-red-600`} />}</div> */}
                    <div className="flex items-center gap-1">
                        <Wifi className={`h-4 w-4 text-green-600`} />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3 text-orange-600" />

                            <span className="text-xs text-muted-foreground">Temperature</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* <p className="text-lg font-semibold">{device.temperature} °C</p> */}
                            <p className="text-lg font-semibold">43.2 °C</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <Droplets className="h-3 w-3 text-cyan-600" />

                            <span className="text-xs text-muted-foreground">Humidity</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* <p className="text-lg font-semibold">{device.humidity}%</p> */}
                            <p className="text-lg font-semibold">45.2%</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-green-600" />

                            <span className="text-xs text-muted-foreground">Occupancy</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* <p className="text-lg font-semibold">{device.occupancy}</p> */}
                            <p className="text-lg font-semibold">1/1</p>
                        </div>
                    </div>
                </div>

                <div className="border-t">
                    <p className="text-xs text-muted-foreground flex items-center gap-1 pt-4">
                        {/* <Clock className="h-3 w-3" /> Last update: {device.lastUpdate} */}
                        <Clock className="h-3 w-3" /> Last Update: 16th August 2025 - 23:52:03
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
