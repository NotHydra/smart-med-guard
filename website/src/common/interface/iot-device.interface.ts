export interface IoTDeviceInterface {
    id: string;
    agency: string;
    floor: number;
    room: string;
}

export interface IoTDeviceDataReadingInterface {
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
