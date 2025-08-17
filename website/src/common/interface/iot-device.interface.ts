export interface IoTDeviceInterface {
    id: string;
    agency: string;
    floor: number;
    room: string;
}

export interface IoTDeviceCurrentValueInterface {
    temperature: {
        value: number;
        timestamp: string;
    };
    humidity: {
        value: number;
        timestamp: string;
    };
    occupancy: {
        value: number;
    };
    lastUpdate: Date;
}

export interface IoTDeviceHistoryInterface {
    temperature: {
        value: number;
        timestamp: string;
    }[];

    humidity: {
        value: number;
        timestamp: string;
    }[];
}
