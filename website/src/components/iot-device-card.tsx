'use client';

import { Clock, Droplets, Thermometer, User, Wifi, WifiLow, WifiOff } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { Status } from '@/common/enum/status.enum';
import { IoTDeviceCurrentValueInterface, IoTDeviceInterface } from '@/common/interface/iot-device.interface';

import { Card, CardContent } from '@/components/ui/card';

import { numberToOrdinal } from '@/utility/number-to-ordinal.utility';

export function IoTDeviceCard({ iotDevice }: { iotDevice: IoTDeviceInterface }): JSX.Element {
    const [status, setStatus] = useState<Status>(Status.CONNECTING);
    const [currentValue, setCurrentValue] = useState<IoTDeviceCurrentValueInterface>();

    useEffect(() => {
        const timer: NodeJS.Timeout = setTimeout(
            () => {
                const socket: Socket = io(process.env.NEXT_PUBLIC_SERVER_WEBSOCKET_URL, {
                    transports: ['websocket'],
                    timeout: 5000,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                });

                socket.on('connect', function () {
                    console.log(`✅ (${iotDevice.id}) Connected to the Socket.IO server! 🚀`);
                    console.log(`🆔 (${iotDevice.id}) Socket ID: ${socket.id}`);
                    console.log(`🔌 (${iotDevice.id}) Transport: ${socket.io.engine.transport.name}`);

                    socket.emit('hello', 'Hello from debug client!');

                    console.log(`📤 (${iotDevice.id}) Sent hello message to server`);

                    setStatus(Status.ONLINE);
                });

                socket.on('connect_error', function (err) {
                    console.log(`❌ (${iotDevice.id}) Socket.IO connection error:`, err.message);
                    console.log(`🔍 (${iotDevice.id}) Error details:`, err);

                    setStatus(Status.OFFLINE);
                });

                socket.on('disconnect', function (reason) {
                    console.log(`🔌 (${iotDevice.id}) Disconnected from server. Reason: ${reason}`);

                    setStatus(Status.OFFLINE);
                });

                socket.on('reconnect', function (attemptNumber) {
                    console.log(`🔄 (${iotDevice.id}) Reconnected after ${attemptNumber} attempts`);

                    setStatus(Status.CONNECTING);
                });

                socket.on('reconnect_attempt', function (attemptNumber) {
                    console.log(`🔄 (${iotDevice.id}) Reconnection attempt #${attemptNumber}`);

                    setStatus(Status.CONNECTING);
                });

                socket.on('reconnect_error', function (err) {
                    console.log(`❌ (${iotDevice.id}) Reconnection error:`, err.message);

                    setStatus(Status.OFFLINE);
                });

                socket.on('reconnect_failed', function () {
                    console.log(`❌ (${iotDevice.id}) Reconnection failed after all attempts`);

                    setStatus(Status.OFFLINE);
                });

                socket.emit('iot-device-topic-join', iotDevice.id);

                socket.on('new', function (data) {
                    console.log(`📡 (${iotDevice.id}) New data:`, data);

                    setCurrentValue({
                        temperature: data.temperature,
                        humidity: data.humidity,
                        occupancy: data.occupancy,
                        lastUpdate: new Date(),
                    });
                });

                socket.on('history', function (data) {
                    console.log(`📜 (${iotDevice.id}) History data:`, data);
                });
            },
            Math.random() * 3000 + 100,
        );

        return () => clearTimeout(timer);
    }, []);

    return (
        <Card className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${status === Status.CONNECTING ? 'bg-amber-500' : status === Status.ONLINE ? 'bg-green-500' : 'bg-red-500'}`} />

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

                    <div className="flex items-center gap-1">{status === Status.CONNECTING ? <WifiLow className={`h-4 w-4 text-amber-600`} /> : status === Status.ONLINE ? <Wifi className={`h-4 w-4 text-green-600`} /> : <WifiOff className={`h-4 w-4 text-red-600`} />}</div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3 text-orange-600" />

                            <span className="text-xs text-muted-foreground">Temperature</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold">{currentValue !== undefined ? `${currentValue.temperature.value} °C` : '-'}</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <Droplets className="h-3 w-3 text-cyan-600" />

                            <span className="text-xs text-muted-foreground">Humidity</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold">{currentValue !== undefined ? `${currentValue.humidity.value}%` : '-'}</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-green-600" />

                            <span className="text-xs text-muted-foreground">Occupancy</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold">{currentValue !== undefined ? `${currentValue.occupancy.value ? 1 : 0}/1` : '-'}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t">
                    <p className="text-xs text-muted-foreground flex items-center gap-1 pt-4">
                        <Clock className="h-3 w-3" /> Last Update: {currentValue !== undefined ? currentValue.lastUpdate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + ' - ' + currentValue.lastUpdate.toLocaleTimeString('en-GB', { hour12: false }) : '-'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
