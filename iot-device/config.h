#ifndef CONFIG_H
#define CONFIG_H

// Device Identification
const char* DEVICE_AGENCY = "Pertamina Hospital";
const int DEVICE_FLOOR = 1;
const char* DEVICE_ROOM = "Melati 001";

// Serial Configuration
const unsigned long SERIAL_BAUD_RATE = 115200;

// Pin Configuration
const int DHTPIN = 4;
const int DHTTYPE = 22;
const int PIRPIN = 18;

// Sensor Configuration
const unsigned long SENSOR_INTERVAL = 5 * 1000;

// WiFi Configuration
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const int WIFI_TIMEOUT = 30;

// MQTT Broker Configuration
const char* MQTT_HOST = "YOUR_MQTT_BROKER_ADDRESS";
const int MQTT_PORT = 1883;
const char* MQTT_CLIENT_ID = "iot-device-pertamina-1-melati-001";
const int MQTT_RETRY_ATTEMPTS = 10;
const unsigned long MQTT_RECONNECT_DELAY = 5 * 1000;

#endif