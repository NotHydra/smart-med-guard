export interface IoTDeviceInterface {
    id: string;
    agency: string;
    floor: number;
    room: string;
}

export interface HistoricalDataInterface {
    value: number;
    timestamp: string;
}

export interface TemperatureInterface {
    value: number;
    timestamp: string;
}

export interface HumidityInterface {
    value: number;
    timestamp: string;
}

export interface OccupancyInterface {
    value: number;
}

export interface IoTDeviceCurrentValueInterface {
    temperature: TemperatureInterface;
    humidity: HumidityInterface;
    occupancy: OccupancyInterface;
    timestamp: string;
}

export interface IoTDeviceHistoryInterface {
    temperature: TemperatureInterface[];
    humidity: HumidityInterface[];
}
