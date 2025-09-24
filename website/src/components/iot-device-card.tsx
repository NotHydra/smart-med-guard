'use client';

import { Clock, Droplets, Minus, Thermometer, TrendingDown, TrendingUp, User, Wifi, WifiLow, WifiOff } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { io, Socket } from 'socket.io-client';

import { Status } from '@/common/enum/status.enum';
import { HistoricalDataInterface, HumidityInterface, IoTDeviceCurrentValueInterface, IoTDeviceHistoryInterface, IoTDeviceInterface, TemperatureInterface } from '@/common/interface/iot-device.interface';

import { Card, CardContent } from '@/components/ui/card';

import { numberToOrdinal } from '@/utility/number-to-ordinal.utility';

export function IoTDeviceCard({
    iotDevice, //
}: {
    iotDevice: IoTDeviceInterface;
}): JSX.Element {
    const [status, setStatus] = useState<Status>(Status.CONNECTING);
    const [currentValue, setCurrentValue] = useState<IoTDeviceCurrentValueInterface>();
    const [history, setHistory] = useState<IoTDeviceHistoryInterface>();

    const getTrend = <Type extends HistoricalDataInterface>(history: Type[] | undefined): 'up' | 'down' | 'stable' => {
        if (!history || history.length < 2) {
            return 'stable';
        }

        const recent: Type[] = history.slice(0, 3);
        if (recent.length < 2) {
            return 'stable';
        }

        const latest: number = recent[0].value;
        const previous: number = recent.slice(1).reduce((sum, item) => sum + item.value, 0) / (recent.length - 1);

        const difference: number = Math.abs(latest - previous);
        const threshold: number = previous * 0.05;

        if (difference < threshold) {
            return 'stable';
        }

        return latest > previous //
            ? 'up'
            : 'down';
    };

    const getTrendIcon = (trend: 'up' | 'down' | 'stable', size: number = 3): JSX.Element => {
        const className: string = `h-${size} w-${size}`;

        switch (trend) {
            case 'up':
                return <TrendingUp className={`${className} text-green-500`} />;

            case 'down':
                return <TrendingDown className={`${className} text-red-500`} />;

            default:
                return <Minus className={`${className} text-gray-400`} />;
        }
    };

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

                    const newValue: IoTDeviceCurrentValueInterface = {
                        temperature: data.temperature,
                        humidity: data.humidity,
                        occupancy: data.occupancy,
                        lastUpdate: new Date(),
                    };

                    setCurrentValue((): IoTDeviceCurrentValueInterface => {
                        setHistory((previousHistory: IoTDeviceHistoryInterface | undefined) => {
                            if (previousHistory !== undefined && previousHistory !== null) {
                                return {
                                    temperature: [newValue.temperature, ...previousHistory.temperature].slice(0, 10),
                                    humidity: [newValue.humidity, ...previousHistory.humidity].slice(0, 10),
                                };
                            }
                        });

                        return newValue;
                    });
                });

                socket.on('history', function (data) {
                    console.log(`📜 (${iotDevice.id}) History data:`, data);

                    setHistory(data);
                });
            },
            Math.random() * 3000 + 100,
        );

        return () => clearTimeout(timer);
    }, []);

    console.log(`🔄 (${iotDevice.id}) Current Value:`, currentValue);
    console.log(`📜 (${iotDevice.id}) History:`, history);

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

                    <div className="flex items-center gap-1">
                        {status === Status.CONNECTING ? (
                            <>
                                <span className="text-xs text-amber-600">Connecting</span> <WifiLow className="h-4 w-4 text-amber-600" />
                            </>
                        ) : status === Status.ONLINE ? (
                            <>
                                <span className="text-xs text-green-600">Online</span> <Wifi className="h-4 w-4 text-green-600" />
                            </>
                        ) : (
                            <>
                                <span className="text-xs text-red-600">Offline</span> <WifiOff className="h-4 w-4 text-red-600" />
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3 text-orange-600" />

                            <span className="text-xs text-muted-foreground">Temperature</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold">
                                {currentValue !== undefined //
                                    ? `${currentValue.temperature.value} °C`
                                    : '-'}
                            </p>

                            {currentValue !== undefined &&
                                history !== undefined && ( //
                                    <div className="flex items-center">{getTrendIcon(getTrend<TemperatureInterface>(history.temperature), 3)}</div>
                                )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <Droplets className="h-3 w-3 text-cyan-600" />

                            <span className="text-xs text-muted-foreground">Humidity</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold">
                                {currentValue !== undefined //
                                    ? `${currentValue.humidity.value}%`
                                    : '-'}
                            </p>

                            {currentValue !== undefined &&
                                history !== undefined && ( //
                                    <div className="flex items-center">{getTrendIcon(getTrend<HumidityInterface>(history.humidity), 3)}</div>
                                )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-green-600" />

                            <span className="text-xs text-muted-foreground">Occupancy</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold">
                                {currentValue !== undefined //
                                    ? `${currentValue.occupancy.value ? 1 : 0}/1`
                                    : '-'}
                            </p>

                            {currentValue !== undefined && (
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full ${currentValue.occupancy.value ? 'bg-green-500' : 'bg-gray-400'}`} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {history !== undefined && (history.temperature.length > 0 || history.humidity.length > 0) ? (
                        <>
                            <div className="space-y-2">
                                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-1 md:space-y-0">
                                    <div className="flex items-center gap-1">
                                        <Thermometer className="h-3 w-3 text-orange-600" />

                                        <span className="text-xs font-medium text-muted-foreground">Temperature History</span>
                                    </div>

                                    {history.temperature.length > 0 && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>Min: {Math.min(...history.temperature.map((item: TemperatureInterface): number => item.value)).toFixed(1)}°C</span>

                                            <span>Max: {Math.max(...history.temperature.map((item: TemperatureInterface): number => item.value)).toFixed(1)}°C</span>

                                            <span>Avg: {(history.temperature.reduce((sum: number, item: TemperatureInterface): number => sum + item.value, 0) / history.temperature.length).toFixed(1)}°C</span>
                                        </div>
                                    )}
                                </div>

                                {history.temperature.length > 0 ? (
                                    <div className="h-32">
                                        <ResponsiveContainer //
                                            width="100%"
                                            height="100%"
                                        >
                                            <LineChart
                                                data={history.temperature.toReversed().map((item: TemperatureInterface, index: number) => ({
                                                    value: item.value,
                                                    rawTimestamp: item.timestamp,
                                                    time: new Date(item.timestamp).toLocaleTimeString('en-GB', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                        hour12: false,
                                                    }),
                                                    fullDateTime: new Date(item.timestamp).toLocaleString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                        hour12: false,
                                                    }),
                                                    index: index + 1,
                                                }))}
                                                margin={{
                                                    top: 10,
                                                    right: 10,
                                                    left: 10,
                                                    bottom: 10,
                                                }}
                                            >
                                                <defs>
                                                    <linearGradient //
                                                        id="temperatureGradient"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop //
                                                            offset="5%"
                                                            stopColor="#EA580C"
                                                            stopOpacity={0.8}
                                                        />

                                                        <stop //
                                                            offset="95%"
                                                            stopColor="#EA580C"
                                                            stopOpacity={0.1}
                                                        />
                                                    </linearGradient>
                                                </defs>

                                                <CartesianGrid //
                                                    strokeDasharray="3 3"
                                                    stroke="#374151"
                                                    opacity={0.2}
                                                />

                                                <XAxis
                                                    dataKey="time"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fontSize: 9,
                                                        fill: '#6B7280',
                                                    }}
                                                    interval="preserveStartEnd"
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={40}
                                                />

                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fontSize: 9,
                                                        fill: '#6B7280',
                                                    }}
                                                    domain={['dataMin - 0.5', 'dataMax + 0.5']}
                                                    tickFormatter={(value) => `${value}°C`}
                                                    width={40}
                                                />

                                                <Tooltip
                                                    labelFormatter={(value, payload) => {
                                                        if (payload && payload[0]) {
                                                            return `${payload[0].payload.fullDateTime}`;
                                                        }

                                                        return `Time: ${value}`;
                                                    }}
                                                    formatter={(value, name, props) => [`${Number(value).toFixed(2)} °C`, 'Temperature']}
                                                    contentStyle={{
                                                        backgroundColor: '#1F2937',
                                                        border: '1px solid #374151',
                                                        borderRadius: '6px',
                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    }}
                                                    labelStyle={{
                                                        color: '#F3F4F6',
                                                    }}
                                                />

                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#EA580C"
                                                    strokeWidth={2.5}
                                                    fill="url(#temperatureGradient)"
                                                    dot={{
                                                        fill: '#EA580C',
                                                        strokeWidth: 1,
                                                        stroke: '#FFF',
                                                        r: 3,
                                                    }}
                                                    activeDot={{
                                                        r: 5,
                                                        stroke: '#EA580C',
                                                        strokeWidth: 2,
                                                        fill: '#FFF',
                                                    }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                                        <p className="text-xs text-muted-foreground">No temperature data available</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-1 md:space-y-0">
                                    <div className="flex items-center gap-1">
                                        <Droplets className="h-3 w-3 text-cyan-600" />

                                        <span className="text-xs font-medium text-muted-foreground">Humidity History</span>
                                    </div>

                                    {history.humidity.length > 0 && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>Min: {Math.min(...history.humidity.map((item: HumidityInterface): number => item.value)).toFixed(1)}%</span>

                                            <span>Max: {Math.max(...history.humidity.map((item: HumidityInterface): number => item.value)).toFixed(1)}%</span>

                                            <span>Avg: {(history.humidity.reduce((sum: number, item: HumidityInterface): number => sum + item.value, 0) / history.humidity.length).toFixed(1)}%</span>
                                        </div>
                                    )}
                                </div>

                                {history.humidity.length > 0 ? (
                                    <div className="h-32">
                                        <ResponsiveContainer //
                                            width="100%"
                                            height="100%"
                                        >
                                            <LineChart
                                                data={history.humidity.toReversed().map((item: HumidityInterface, index: number) => ({
                                                    value: item.value,
                                                    rawTimestamp: item.timestamp,
                                                    time: new Date(item.timestamp).toLocaleTimeString('en-GB', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                        hour12: false,
                                                    }),
                                                    fullDateTime: new Date(item.timestamp).toLocaleString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                        hour12: false,
                                                    }),
                                                    index: index + 1,
                                                }))}
                                                margin={{
                                                    top: 10,
                                                    right: 10,
                                                    left: 10,
                                                    bottom: 10,
                                                }}
                                            >
                                                <defs>
                                                    <linearGradient //
                                                        id="humidityGradient"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop //
                                                            offset="5%"
                                                            stopColor="#0891B2"
                                                            stopOpacity={0.8}
                                                        />

                                                        <stop //
                                                            offset="95%"
                                                            stopColor="#0891B2"
                                                            stopOpacity={0.1}
                                                        />
                                                    </linearGradient>
                                                </defs>

                                                <CartesianGrid //
                                                    strokeDasharray="3 3"
                                                    stroke="#374151"
                                                    opacity={0.2}
                                                />

                                                <XAxis
                                                    dataKey="time"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fontSize: 9,
                                                        fill: '#6B7280',
                                                    }}
                                                    interval="preserveStartEnd"
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={40}
                                                />

                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fontSize: 9,
                                                        fill: '#6B7280',
                                                    }}
                                                    domain={['dataMin - 2', 'dataMax + 2']}
                                                    tickFormatter={(value) => `${value}%`}
                                                    width={40}
                                                />

                                                <Tooltip
                                                    labelFormatter={(value, payload) => {
                                                        if (payload && payload[0]) {
                                                            return `${payload[0].payload.fullDateTime}`;
                                                        }

                                                        return `Time: ${value}`;
                                                    }}
                                                    formatter={(value, name, props) => [`${Number(value).toFixed(2)}%`, 'Humidity']}
                                                    contentStyle={{
                                                        backgroundColor: '#1F2937',
                                                        border: '1px solid #374151',
                                                        borderRadius: '6px',
                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    }}
                                                    labelStyle={{
                                                        color: '#F3F4F6',
                                                    }}
                                                />

                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#0891B2"
                                                    strokeWidth={2.5}
                                                    fill="url(#humidityGradient)"
                                                    dot={{
                                                        fill: '#0891B2',
                                                        strokeWidth: 1,
                                                        stroke: '#FFF',
                                                        r: 3,
                                                    }}
                                                    activeDot={{
                                                        r: 5,
                                                        stroke: '#0891B2',
                                                        strokeWidth: 2,
                                                        fill: '#FFF',
                                                    }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                                        <p className="text-xs text-muted-foreground">No humidity data available</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                            <div className="text-center space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">No Historical Data</p>

                                <p className="text-xs text-muted-foreground">Charts will appear once sensor data is received</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t">
                    <div className="text-xs text-muted-foreground pt-4 space-y-1">
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> <span>Last Update:</span>
                        </div>

                        <p>
                            {currentValue !== undefined //
                                ? currentValue.lastUpdate.toLocaleDateString('en-GB', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                  }) +
                                  ' - ' +
                                  currentValue.lastUpdate.toLocaleTimeString('en-GB', {
                                      hour12: false,
                                  })
                                : '-'}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
