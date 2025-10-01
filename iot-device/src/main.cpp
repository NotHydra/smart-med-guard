#include <Arduino.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <PubSubClient.h>
#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include "../config.h"

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

DHT dht(DHTPIN, DHTTYPE);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

const String topic = String("iot-device/") + DEVICE_AGENCY + "/" + String(DEVICE_FLOOR) + "/" + DEVICE_ROOM;
unsigned long lastSensorReading = 0;

void printBorder();
void initializeDisplay();
void displayMessage(const String& message, bool clearFirst = true);
void displaySensorData(float temperature, float humidity, bool occupancy, const String& status);
void initializeSensors();
void connectToWiFi();
void setupMQTT();
void connectToMQTT();
void reconnectMQTT();
void readAndPublishSensorData();
void publishSensorData(float temperature, float humidity, bool occupancy);

void printBorder() {
    Serial.println("========================================");
}

void setup() {
    Serial.begin(SERIAL_BAUD_RATE);
    while (!Serial) {
        delay(10);
    }

    printBorder();
    Serial.println("SmartMedGuard");
    printBorder();

    initializeDisplay();

    printBorder();

    initializeSensors();

    printBorder();

    connectToWiFi();

    printBorder();

    setupMQTT();

    printBorder();

    connectToMQTT();

    printBorder();

    Serial.println("Starting monitoring...");
    displayMessage("Starting\nmonitoring...", true);
    delay(2000);
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

void initializeDisplay() {
    Serial.println("Initializing OLED display...");
    
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
        Serial.println("Failed to initialize OLED display!");
        Serial.println("Check wiring: VCC->3.3V, GND->GND, SDA->GPIO21, SCL->GPIO22");

        return;
    }
    
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println("SmartMedGuard");
    display.println("Initializing...");
    display.display();
    
    Serial.println("OLED display initialized successfully");
}

void displayMessage(const String& message, bool clearFirst) {
    if (clearFirst) {
        display.clearDisplay();
        display.setCursor(0, 0);
    }
    display.println(message);
    display.display();
}

void displaySensorData(float temperature, float humidity, bool occupancy, const String& status) {
    display.clearDisplay();
    display.setCursor(0, 0);
    
    // Title
    display.setTextSize(1);
    display.println("SmartMedGuard");
    display.println("-------------------");
    
    // Device info
    display.print("Room: ");
    display.println(DEVICE_ROOM);
    display.println();
    
    // Sensor data
    if (!isnan(temperature) && !isnan(humidity)) {
        display.print("Temp: ");
        display.print(temperature, 1);
        display.println("C");
        
        display.print("Humidity: ");
        display.print(humidity, 1);
        display.println("%");
    } else {
        display.println("Sensor Error!");
    }
    
    display.print("Motion: ");
    display.println(occupancy ? "DETECTED" : "None");
    
    // Status
    display.println();
    display.print("Status: ");
    display.println(status);
    
    display.display();
}

void initializeSensors() {
    Serial.println("Initializing sensors...");
    displayMessage("Initializing\nSensors...", true);

    dht.begin();
    pinMode(PIRPIN, INPUT);

    Serial.println("Warming up sensors...");
    displayMessage("Warming up\nSensors...", true);
    delay(3000);

    const float testTemperature = dht.readTemperature();
    const float testHumidity = dht.readHumidity();

    if (isnan(testTemperature) || isnan(testHumidity)) {
        Serial.println("WARNING: DHT22 sensor not responding properly!");
        Serial.println("Check wiring: VCC->3.3V, GND->GND, DATA->GPIO4");
    } else {
        Serial.println("DHT22 sensor initialized successfully");
        Serial.println("Test readings:");
        Serial.printf("- Temperature: %.1f°C\n", testTemperature);
        Serial.printf("- Humidity: %.1f%%\n", testHumidity);
    }
}

void connectToWiFi() {
    Serial.println("Connecting to WiFi...");
    Serial.printf("SSID: %s\n", WIFI_SSID);
    Serial.printf("Password: %s\n", WIFI_PASSWORD);
    
    displayMessage("Connecting to\nWiFi...", true);

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < WIFI_TIMEOUT) {
        delay(1000);

        attempts++;
    }

    Serial.println();
    printBorder();

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("WiFi connected successfully!");
        Serial.printf("IP Address: %s\n", WiFi.localIP().toString().c_str());
        Serial.printf("Signal Strength: %d dBm\n", WiFi.RSSI());
        
        display.clearDisplay();
        display.setCursor(0, 0);
        display.println("WiFi Connected!");
        display.println();
        display.print("IP: ");
        display.println(WiFi.localIP().toString());
        display.print("Signal: ");
        display.print(WiFi.RSSI());
        display.println(" dBm");
        display.display();
    } else {
        Serial.println("Failed to connect to WiFi!");
        Serial.println("Please check your WiFi credentials and try again.");
        
        displayMessage("WiFi Failed!\nCheck credentials", true);

        while (true) {
            delay(1000);
        }
    }
}

void setupMQTT() {
    Serial.println("Setting up MQTT...");
    Serial.printf("MQTT Broker: %s:%d\n", MQTT_HOST, MQTT_PORT);
    Serial.printf("Client ID: %s\n", MQTT_CLIENT_ID);
    
    displayMessage("Setting up\nMQTT...", true);

    mqttClient.setServer(MQTT_HOST, MQTT_PORT);
}

void connectToMQTT() {
    Serial.println("Connecting to MQTT broker...");
    displayMessage("Connecting to\nMQTT broker...", true);

    int attempts = 0;
    while (!mqttClient.connected() && attempts < MQTT_RETRY_ATTEMPTS) {
        Serial.printf("Attempt %d/%d...", attempts + 1, MQTT_RETRY_ATTEMPTS);
        
        display.clearDisplay();
        display.setCursor(0, 0);
        display.println("MQTT Connect...");
        display.print("Attempt: ");
        display.print(attempts + 1);
        display.print("/");
        display.println(MQTT_RETRY_ATTEMPTS);
        display.display();

        if (mqttClient.connect(MQTT_CLIENT_ID)) {
            Serial.println("Connected!");
            Serial.println("Device Configuration:");
            Serial.printf("- Agency: %s\n", DEVICE_AGENCY);
            Serial.printf("- Floor: %d\n", DEVICE_FLOOR);
            Serial.printf("- Room: %s\n", DEVICE_ROOM);
            
            display.clearDisplay();
            display.setCursor(0, 0);
            display.println("MQTT Connected!");
            display.println();
            display.println("Device Config:");
            display.print("Floor: ");
            display.println(DEVICE_FLOOR);
            display.print("Room: ");
            display.println(DEVICE_ROOM);
            display.display();
        } else {
            Serial.printf("Failed (rc=%d). Retrying in %d seconds...\n", mqttClient.state(), MQTT_RECONNECT_DELAY / 1000);
            delay(MQTT_RECONNECT_DELAY);
        }

        attempts++;
    }

    if (!mqttClient.connected()) {
        Serial.printf("Failed to connect to MQTT broker after %d attempts!\n", MQTT_RETRY_ATTEMPTS);
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
    const float temperature = dht.readTemperature();
    const float humidity = dht.readHumidity();
    const int motionValue = digitalRead(PIRPIN);
    const bool occupancy = (motionValue == HIGH);

    const unsigned long timestamp = millis();
    Serial.printf("\n[%lu ms] Sensor Reading:\n", timestamp);

    bool validReading = true;
    if (isnan(temperature) || isnan(humidity)) {
        Serial.println("ERROR: Failed to read from DHT22 sensor!");

        validReading = false;
    } else {
        Serial.printf("- Temperature: %.1f°C\n", temperature);
        Serial.printf("- Humidity: %.1f%%\n", humidity);
    }

    Serial.printf("- Motion: %s\n", occupancy ? "DETECTED" : "None");

    // Update display with current sensor data
    String status;
    if (validReading && mqttClient.connected()) {
        publishSensorData(temperature, humidity, occupancy);
        status = "Published";
    } else if (!validReading) {
        Serial.println("Skipping MQTT publish due to invalid sensor readings");
        status = "Sensor Error";
    } else {
        Serial.println("Skipping MQTT publish due to not connected to broker");
        status = "MQTT Disconn.";
    }
    
    displaySensorData(temperature, humidity, occupancy, status);
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

    Serial.printf("Publishing to topic: %s\n", topic.c_str());
    Serial.printf("Payload: %s\n", payload.c_str());

    if (mqttClient.publish(topic.c_str(), payload.c_str())) {
        Serial.println("Data published successfully!");
    } else {
        Serial.println("Failed to publish data!");
    }
}
