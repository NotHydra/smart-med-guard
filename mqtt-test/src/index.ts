import mqtt, { IClientOptions, MqttClient } from "mqtt";

interface IoTDeviceConfig {
    agency: string;
    floor: number;
    room: string;
}

const MQTT_HOST: string | undefined = process.env.MQTT_HOST;
if (MQTT_HOST === undefined) {
    throw new Error("MQTT_HOST environment variable is not set.");
}

const MQTT_PORT: string | undefined = process.env.MQTT_PORT;
if (MQTT_PORT === undefined) {
    throw new Error("MQTT_PORT environment variable is not set.");
}

const BROKER_ADDRESS: string = `mqtt://${MQTT_HOST}:${MQTT_PORT}`;
const IOT_DEVICES: IoTDeviceConfig[] = [
    {
        agency: "Pertamina Hospital",
        floor: 1,
        room: "Melati 001",
    },
    {
        agency: "Pertamina Hospital",
        floor: 1,
        room: "Melati 002",
    },
    {
        agency: "Pertamina Hospital",
        floor: 1,
        room: "Melati 003",
    },
    {
        agency: "Pertamina Hospital",
        floor: 2,
        room: "Anggrek 001",
    },
    {
        agency: "Pertamina Hospital",
        floor: 2,
        room: "Anggrek 002",
    },
    {
        agency: "Pertamina Hospital",
        floor: 3,
        room: "Tulip 001",
    },
    {
        agency: "Kanojoso Hospital",
        floor: 1,
        room: "Dahlia 001",
    },
    {
        agency: "Kanojoso Hospital",
        floor: 1,
        room: "Dahlia 002",
    },
    {
        agency: "Kanojoso Hospital",
        floor: 2,
        room: "Mawar 001",
    },
    {
        agency: "Kanojoso Hospital",
        floor: 2,
        room: "Mawar 002",
    },
    {
        agency: "Kanojoso Hospital",
        floor: 2,
        room: "Mawar 003",
    },
    {
        agency: "Kanojoso Hospital",
        floor: 3,
        room: "Sakura 001",
    },
    {
        agency: "Siloam Hospital",
        floor: 1,
        room: "Kenanga 001",
    },
    {
        agency: "Siloam Hospital",
        floor: 1,
        room: "Kenanga 002",
    },
    {
        agency: "Siloam Hospital",
        floor: 2,
        room: "Teratai 001",
    },
    {
        agency: "Siloam Hospital",
        floor: 2,
        room: "Teratai 002",
    },
    {
        agency: "RS Budi Kemuliaan",
        floor: 1,
        room: "Seruni 001",
    },
    {
        agency: "RS Budi Kemuliaan",
        floor: 1,
        room: "Seruni 002",
    },
    {
        agency: "RS Budi Kemuliaan",
        floor: 2,
        room: "Kamboja 001",
    },
    {
        agency: "RS Budi Kemuliaan",
        floor: 2,
        room: "Kamboja 002",
    },
];

function simulateIoTDevice(iotDeviceConfig: IoTDeviceConfig): void {
    const { agency, floor, room }: IoTDeviceConfig = iotDeviceConfig;
    const name: string = `${agency}-${floor}-${room}`;
    const topic: string = `iot-device/${agency}/${floor}/${room}`;

    console.log(`Starting IoT device for ${name}...`);

    const clientId: string = `iot-device-${name}-${Math.floor(Math.random() * 1000)}`;
    const options: IClientOptions = {
        clientId: clientId,
        clean: true,
    };

    console.log(`Publishing to topic: ${topic}`);

    const client: MqttClient = mqtt.connect(BROKER_ADDRESS, options);

    client.on("connect", (): void => {
        console.log(`✅ IoT device for '${name}' connected to MQTT Broker!`);

        setInterval((): void => {
            try {
                console.log(`📡 Publishing data for ${name}...`);

                const temperature: number = parseFloat((Math.random() * (28.0 - 20.0) + 20.0).toFixed(2));
                console.log(`Temperature: ${temperature}°C`);

                const humidity: number = parseFloat((Math.random() * (65.0 - 40.0) + 40.0).toFixed(2));
                console.log(`Humidity: ${humidity}%`);

                const occupancy: boolean = Math.random() < 0.5;
                console.log(`Occupancy: ${occupancy ? "Occupied" : "Unoccupied"}`);

                client.publish(
                    topic,
                    JSON.stringify({
                        data: JSON.stringify({
                            agency: agency,
                            floor: floor,
                            room: room,
                            temperature: temperature,
                            humidity: humidity,
                            occupancy: occupancy,
                        }),
                    })
                );
            } catch (error) {
                console.error(`❌ Error publishing data for ${name}:`, error);
            }
        }, 3 * 1000);
    });

    client.on("error", (err: Error): void => {
        console.error(`❌ Error with IoT device for ${name}:`, err);

        client.end();
    });

    client.on("reconnect", (): void => {
        console.log(`🔄 Reconnecting IoT device for ${name}...`);
    });

    client.on("close", (): void => {
        console.log(`🔒 IoT device for ${name} connection closed.`);
    });
}

function main(): void {
    console.log("Starting IoT device simulators...");
    console.log(`Connecting to MQTT Broker at ${BROKER_ADDRESS}...`);

    IOT_DEVICES.forEach((iotDevice: IoTDeviceConfig, index: number): void => {
        setTimeout((): void => {
            simulateIoTDevice(iotDevice);
        }, ((index - 1) / 10) * 2.5 * 1000);
    });

    process.on("SIGINT", (): void => {
        console.log("\nStopping all IoT device simulators...");

        IOT_DEVICES.forEach((iotDevice) => {
            console.log(`Stopping IoT device for ${iotDevice.room}...`);
        });

        console.log("All IoT devices stopped. Exiting...");

        process.exit();
    });
}

main();
