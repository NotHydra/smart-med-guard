export interface IoTDevicePayload {
    agency: string;
    floor: string;
    room: string;
    temperature: number;
    humidity: number;
    occupancy: boolean;
}

export interface AvailableIoTDevice {
    id: string;
    agency: string;
    floor: string;
    room: string;
}
