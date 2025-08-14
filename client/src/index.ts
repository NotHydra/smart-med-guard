import mqtt, { IClientOptions, MqttClient } from "mqtt";

interface IoTDeviceConfig {
    agency: string;
    floor: string;
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
        agency: "pertamina_hospital",
        floor: "1",
        room: "melati_001",
    },
    {
        agency: "pertamina_hospital",
        floor: "1",
        room: "melati_002",
    },
    {
        agency: "pertamina_hospital",
        floor: "1",
        room: "melati_003",
    },
    {
        agency: "pertamina_hospital",
        floor: "2",
        room: "anggrek_001",
    },
    {
        agency: "pertamina_hospital",
        floor: "2",
        room: "anggrek_002",
    },
    {
        agency: "pertamina_hospital",
        floor: "3",
        room: "tulip_001",
    },
    {
        agency: "kanojoso_hospital",
        floor: "1",
        room: "dahlia_001",
    },
    {
        agency: "kanojoso_hospital",
        floor: "1",
        room: "dahlia_002",
    },
    {
        agency: "kanojoso_hospital",
        floor: "2",
        room: "mawar_001",
    },
    {
        agency: "kanojoso_hospital",
        floor: "2",
        room: "mawar_002",
    },
    {
        agency: "kanojoso_hospital",
        floor: "2",
        room: "mawar_003",
    },
    {
        agency: "kanojoso_hospital",
        floor: "3",
        room: "sakura_001",
    },
    {
        agency: "siloam_hospital",
        floor: "1",
        room: "kenanga_001",
    },
    {
        agency: "siloam_hospital",
        floor: "1",
        room: "kenanga_002",
    },
    {
        agency: "siloam_hospital",
        floor: "2",
        room: "teratai_001",
    },
    {
        agency: "siloam_hospital",
        floor: "2",
        room: "teratai_002",
    },
    {
        agency: "rs_budi_kemuliaan",
        floor: "1",
        room: "seruni_001",
    },
    {
        agency: "rs_budi_kemuliaan",
        floor: "1",
        room: "seruni_002",
    },
    {
        agency: "rs_budi_kemuliaan",
        floor: "2",
        room: "kamboja_001",
    },
    {
        agency: "rs_budi_kemuliaan",
        floor: "2",
        room: "kamboja_002",
    },
];

function simulateIoTDevice(iotDeviceConfig: IoTDeviceConfig): void {
    const { agency, floor, room }: IoTDeviceConfig = iotDeviceConfig;
    const name: string = `${agency}-${floor}-${room}`;
    const temperatureTopic: string = `iot-device/${agency}/${floor}/${room}/temperature`;
    const humidityTopic: string = `iot-device/${agency}/${floor}/${room}/humidity`;
    const occupancyTopic: string = `iot-device/${agency}/${floor}/${room}/occupancy`;

    console.log(`Starting IoT device for ${name}...`);

    const clientId: string = `iot-device-${name}-${Math.floor(Math.random() * 1000)}`;
    const options: IClientOptions = {
        clientId: clientId,
        clean: true,
    };

    console.log(`Publishing to topics:`);
    console.log(`- Temperature  : ${temperatureTopic}`);
    console.log(`- Humidity     : ${humidityTopic}`);
    console.log(`- Occupancy    : ${occupancyTopic}`);

    const client: MqttClient = mqtt.connect(BROKER_ADDRESS, options);

    client.on("connect", (): void => {
        console.log(`✅ IoT device for '${name}' connected to MQTT Broker!`);

        setInterval((): void => {
            try {
                console.log(`📡 Publishing data for ${name}...`);

                const temperature: number = parseFloat((Math.random() * (28.0 - 20.0) + 20.0).toFixed(2));
                const humidity: number = parseFloat((Math.random() * (65.0 - 40.0) + 40.0).toFixed(2));
                const occupancy: boolean = Math.random() < 0.5;

                console.log(`Temperature: ${temperature}°C`);
                client.publish(
                    temperatureTopic,
                    JSON.stringify({
                        data: temperature,
                    })
                );

                console.log(`Humidity: ${humidity}%`);
                client.publish(
                    humidityTopic,
                    JSON.stringify({
                        data: humidity,
                    })
                );

                console.log(`Occupancy: ${occupancy ? "Occupied" : "Unoccupied"}`);
                client.publish(
                    occupancyTopic,
                    JSON.stringify({
                        data: occupancy,
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
        }, index * 1000);
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
