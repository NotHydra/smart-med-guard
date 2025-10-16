#ifndef CONFIG_H
#define CONFIG_H

// Device Identification
const char* DEVICE_AGENCY = "Klinik ITK";
const int DEVICE_FLOOR = 1;
const char* DEVICE_ROOM = "001";

// Serial Configuration
const unsigned long SERIAL_BAUD_RATE = 115200;

// Pin Configuration
const int DHTPIN = 4;
const int DHTTYPE = 22;
const int PIRPIN = 18;

// Sensor Configuration
const unsigned long SENSOR_INTERVAL = 3 * 1000;
const unsigned long PRESENCE_TIMEOUT = 5 * 60 * 1000;

// WiFi Configuration
const char* WIFI_SSID = "SmartMedGuard";
const char* WIFI_PASSWORD = "123123123";
const int WIFI_TIMEOUT = 30;

// MQTT Broker Configuration
const char* MQTT_HOST = "smart-med-guard.local";
const int MQTT_PORT = 1883;
const char* MQTT_CLIENT_ID = "iot-device-klinik-itk-1-001";
const int MQTT_RETRY_ATTEMPTS = 10;
const unsigned long MQTT_RECONNECT_DELAY = 5 * 1000;

#endif