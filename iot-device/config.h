#ifndef CONFIG_H
#define CONFIG_H

// Device Identification
const char* DEVICE_AGENCY = "Pertamina Hospital";
const int DEVICE_FLOOR = 1;
const char* DEVICE_ROOM = "Melati 001";

// Serial baud rate
#define SERIAL_BAUD_RATE 115200

// Pin Configuration
#define DHTPIN 4
#define DHTTYPE DHT22
#define PIRPIN 18

// Sensor Reading Interval
const unsigned long SENSOR_INTERVAL = 5 * 1000;

// WiFi Configuration
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// WiFi connection timeout
#define WIFI_TIMEOUT 30

// MQTT Broker Configuration
const char* MQTT_HOST = "YOUR_MQTT_BROKER_ADDRESS";
const int MQTT_PORT = 1883;

// MQTT Client ID
const char* MQTT_CLIENT_ID = "iot-device-pertamina-1-melati-001";

// MQTT connection retry attempts
#define MQTT_RETRY_ATTEMPTS 10

// MQTT reconnection delay
#define MQTT_RECONNECT_DELAY 5 * 1000

#endif