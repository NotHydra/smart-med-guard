#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <WiFi.h>

#include "../config.h"
#include "Arduino.h"
#include "DHT.h"

DHT dht(DHTPIN, DHTTYPE);
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

String topic = String("iot-device/") + DEVICE_AGENCY + "/" + String(DEVICE_FLOOR) + "/" + DEVICE_ROOM;
unsigned long lastSensorReading = 0;

void printBorder() {
    Serial.println("========================================");
}

void setup() {
    Serial.begin(SERIAL_BAUD_RATE);
    while (!Serial) {
        delay(10);
    }

    printBorder();
    Serial.println("Smart Med Guard - IoT Device Starting...");
    printBorder();

    initializeSensors();

    printBorder();

    connectToWiFi();

    printBorder();

    setupMQTT();

    printBorder();

    connectToMQTT();

    printBorder();

    Serial.println("System ready - starting monitoring...");
    printBorder();
}

void loop() {
    if (!mqttClient.connected()) {
        reconnectMQTT();

        printBorder();
    }

    mqttClient.loop();

    if ((millis() - lastSensorReading) >= SENSOR_INTERVAL) {
        readAndPublishSensorData();

        lastSensorReading = millis();

        printBorder();
    }

    delay(500);
}

void initializeSensors() {
    Serial.println("Initializing sensors...");

    dht.begin();
    pinMode(PIRPIN, INPUT);

    Serial.println("Warming up sensors...");
    delay(3000);

    float testTemperature = dht.readTemperature();
    float testHumidity = dht.readHumidity();

    if (isnan(testTemperature) || isnan(testHumidity)) {
        Serial.println("WARNING: DHT22 sensor not responding properly!");
        Serial.println("Check wiring: VCC->3.3V, GND->GND, DATA->GPIO4");
    } else {
        Serial.println("DHT22 sensor initialized successfully");
        Serial.println("Test readings:");
        Serial.printf("- Temperature: %.1f°C", testTemperature);
        Serial.println();
        Serial.printf("- Humidity: %.1f%%", testHumidity);
        Serial.println();
    }
}

void connectToWiFi() {
    Serial.println("Connecting to WiFi...");
    Serial.printf("SSID: %s", WIFI_SSID);
    Serial.println();
    Serial.printf("Password: %s", WIFI_PASSWORD);
    Serial.println();

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < WIFI_TIMEOUT) {
        delay(1000);

        Serial.print(".");

        attempts++;
    }

    Serial.println();
    printBorder();

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("WiFi connected successfully!");
        Serial.printf("IP Address: %s", WiFi.localIP().toString().c_str());
        Serial.println();
        Serial.printf("Signal Strength: %d dBm", WiFi.RSSI());
        Serial.println();
    } else {
        Serial.println("Failed to connect to WiFi!");
        Serial.println("Please check your WiFi credentials and try again.");

        while (true) {
            delay(1000);
        }
    }
}

void setupMQTT() {
    Serial.println("Setting up MQTT...");
    Serial.printf("MQTT Broker: %s:%d", MQTT_HOST, MQTT_PORT);
    Serial.println();
    Serial.printf("Client ID: %s", MQTT_CLIENT_ID);
    Serial.println();

    mqttClient.setServer(MQTT_HOST, MQTT_PORT);
}

void connectToMQTT() {
    Serial.println("Connecting to MQTT broker...");

    int attempts = 0;
    while (!mqttClient.connected() && attempts < MQTT_RETRY_ATTEMPTS) {
        Serial.printf("Attempt %d/%d...", attempts + 1, MQTT_RETRY_ATTEMPTS);

        if (mqttClient.connect(MQTT_CLIENT_ID)) {
            Serial.println("Connected!");
            Serial.println("Device Configuration:");
            Serial.printf("- Agency: %s", DEVICE_AGENCY);
            Serial.println();
            Serial.printf("- Floor: %d", DEVICE_FLOOR);
            Serial.println();
            Serial.printf("- Room: %s", DEVICE_ROOM);
            Serial.println();
        } else {
            Serial.printf("Failed (rc=%d). Retrying in %d seconds...", mqttClient.state(), MQTT_RECONNECT_DELAY / 1000);
            Serial.println();

            delay(MQTT_RECONNECT_DELAY);
        }

        attempts++;
    }

    if (!mqttClient.connected()) {
        Serial.printf("Failed to connect to MQTT broker after %d attempts!", MQTT_RETRY_ATTEMPTS);
        Serial.println();
        Serial.println("Please check your MQTT broker configuration.");
    }
}

void reconnectMQTT() {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi disconnected. Reconnecting...");

        connectToWiFi();

        printBorder();
    }

    connectToMQTT();
}

void readAndPublishSensorData() {
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int motionValue = digitalRead(PIRPIN);
    bool occupancy = (motionValue == HIGH);

    unsigned long timestamp = millis();
    Serial.printf("\n[%lu ms] Sensor Reading:", timestamp);
    Serial.println();

    bool validReading = true;
    if (isnan(temperature) || isnan(humidity)) {
        Serial.println("ERROR: Failed to read from DHT22 sensor!");

        validReading = false;
    } else {
        Serial.printf("- Temperature: %.1f°C", temperature);
        Serial.println();
        Serial.printf("- Humidity: %.1f%%", humidity);
        Serial.println();
    }

    Serial.printf("- Motion: %s", occupancy ? "DETECTED" : "None");
    Serial.println();

    if (validReading && mqttClient.connected()) {
        publishSensorData(temperature, humidity, occupancy);
    } else if (!validReading) {
        Serial.println("Skipping MQTT publish due to invalid sensor readings");
    } else {
        Serial.println("Skipping MQTT publish due to not connected to broker");
    }
}

void publishSensorData(float temperature, float humidity, bool occupancy) {
    JsonDocument innerDoc;
    innerDoc["agency"] = DEVICE_AGENCY;
    innerDoc["floor"] = DEVICE_FLOOR;
    innerDoc["room"] = DEVICE_ROOM;
    innerDoc["temperature"] = round(temperature * 100.0) / 100.0;
    innerDoc["humidity"] = round(humidity * 100.0) / 100.0;
    innerDoc["occupancy"] = occupancy;

    String innerDataString;
    serializeJson(innerDoc, innerDataString);

    JsonDocument outerDoc;
    outerDoc["data"] = innerDataString;

    String payload;
    serializeJson(outerDoc, payload);

    Serial.printf("Publishing to topic: %s", topic.c_str());
    Serial.println();
    Serial.printf("Payload: %s", payload.c_str());
    Serial.println();

    if (mqttClient.publish(topic.c_str(), payload.c_str())) {
        Serial.println("Data published successfully!");
    } else {
        Serial.println("Failed to publish data!");
    }
}
