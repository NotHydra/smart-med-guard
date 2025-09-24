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

export interface TemperatureInterface extends HistoricalDataInterface {}

export interface HumidityInterface extends HistoricalDataInterface {}

export interface OccupancyInterface {
    value: number;
}

export interface IoTDeviceCurrentValueInterface {
    temperature: TemperatureInterface;
    humidity: HumidityInterface;
    occupancy: OccupancyInterface;
    lastUpdate: Date;
}

export interface IoTDeviceHistoryInterface {
    temperature: TemperatureInterface[];
    humidity: HumidityInterface[];
}
