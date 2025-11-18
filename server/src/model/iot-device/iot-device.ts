export interface IoTDevicePayload {
    agency: string;
    floor: number;
    room: string;
    temperature: number;
    humidity: number;
    occupancy: boolean;
    timestamp: string;
}

export interface AvailableIoTDevice {
    id: string;
    agency: string;
    floor: number;
    room: string;
}
