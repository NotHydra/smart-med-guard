#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <PubSubClient.h>
#include <RTClib.h>
#include <WiFi.h>
#include <Wire.h>

#include "../config.h"

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

DHT dht(DHTPIN, DHTTYPE);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
RTC_DS3231 rtc;
const int TIMEZONE_OFFSET = 8;  // GMT+8

const String topic = String("iot-device/") + DEVICE_AGENCY + "/" + String(DEVICE_FLOOR) + "/" + DEVICE_ROOM;
unsigned long lastSensorReading = 0;
unsigned long lastMotionDetected = 0;
unsigned long lastWiFiReconnectAttempt = 0;
bool presenceDetected = false;
bool offlineMode = false;

void printBorder();
void initializeDisplay();
void displayMessage(const String& message, bool clearFirst = true);
void displaySensorData(float temperature, float humidity, bool occupancy, const String& status);
void initializeSensors();
void initializeRTC();
void connectToWiFi();
void setupMQTT();
void connectToMQTT();
void reconnectMQTT();
void attemptWiFiReconnect();
void readAndPublishSensorData();
void publishSensorData(float temperature, float humidity, bool occupancy, const String& timestamp);
DateTime getLocalDateTime();
void syncRTCWithNTP();

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

    initializeRTC();

    printBorder();

    connectToWiFi();

    printBorder();

    if (!offlineMode) {
        setupMQTT();

        printBorder();

        connectToMQTT();

        printBorder();
    }

    Serial.println("Starting monitoring...");
    display.clearDisplay();
    display.setCursor(0, 0);
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.println("Starting");
    display.println("monitoring...");
    display.display();
    delay(2000);

    // Clear display for first sensor reading
    display.clearDisplay();
    display.display();
    printBorder();
}

void loop() {
    // Attempt WiFi reconnection in background if in offline mode
    if (offlineMode && (millis() - lastWiFiReconnectAttempt) >= WIFI_RECONNECT_INTERVAL) {
        attemptWiFiReconnect();
    }

    if (!offlineMode && !mqttClient.connected()) {
        reconnectMQTT();

        printBorder();
    }

    if (!offlineMode) {
        mqttClient.loop();
    }

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
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);

    display.print("SmartMedGuard #");
    display.println(DEVICE_ROOM);

    // Display RTC timestamp
    DateTime now = getLocalDateTime();
    char timeBuffer[32];
    sprintf(timeBuffer, "%04d-%02d-%02d %02d:%02d:%02d", now.year(), now.month(), now.day(), now.hour(), now.minute(), now.second());
    display.println(timeBuffer);

    // Show offline indicator if in offline mode
    if (offlineMode) {
        display.println("[OFFLINE]");
    }

    display.println("-------------------");

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

    display.print("Presence: ");
    display.println(occupancy ? "Occupied" : "Empty");

    display.display();
    delay(10);
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

void initializeRTC() {
    Serial.println("Initializing RTC...");
    displayMessage("Initializing\nRTC...", true);

    if (!rtc.begin()) {
        Serial.println("ERROR: RTC DS3231 not found!");
        Serial.println("Check wiring: VCC->3.3V, GND->GND, SDA->GPIO21, SCL->GPIO22");

        displayMessage("RTC Error!\nCheck wiring", true);

        return;
    }

    // Check if RTC lost power
    if (rtc.lostPower()) {
        Serial.println("RTC lost power. Time will be synced with NTP after WiFi connection.");
    } else {
        DateTime now = rtc.now();
        Serial.println("RTC initialized successfully");
        Serial.printf("Current RTC time (UTC): %04d-%02d-%02d %02d:%02d:%02d\n", now.year(), now.month(), now.day(), now.hour(), now.minute(), now.second());
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

        // Sync RTC with NTP time
        syncRTCWithNTP();

        offlineMode = false;
    } else {
        Serial.println("Failed to connect to WiFi!");
        Serial.println("Entering offline mode - device will continue reading sensors locally");

        displayMessage("WiFi Failed!\nOffline Mode", true);
        delay(1500);

        offlineMode = true;
        lastWiFiReconnectAttempt = millis();

        // Clear display before monitoring starts
        display.clearDisplay();
        display.display();
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
        Serial.println("WiFi disconnected. Entering offline mode...");

        offlineMode = true;
        lastWiFiReconnectAttempt = millis();

        return;
    }

    connectToMQTT();
}

void attemptWiFiReconnect() {
    Serial.println("Attempting WiFi reconnection in background...");
    Serial.printf("SSID: %s\n", WIFI_SSID);

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 5) {
        delay(1000);

        attempts++;
    }

    lastWiFiReconnectAttempt = millis();

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("WiFi reconnected successfully!");
        Serial.printf("IP Address: %s\n", WiFi.localIP().toString().c_str());
        Serial.printf("Signal Strength: %d dBm\n", WiFi.RSSI());

        offlineMode = false;

        setupMQTT();
        connectToMQTT();
    } else {
        Serial.printf("WiFi reconnection failed. Will retry in %lu seconds\n", WIFI_RECONNECT_INTERVAL / 1000);
    }
}

void readAndPublishSensorData() {
    const float temperature = dht.readTemperature();
    const float humidity = dht.readHumidity();
    const bool currentMotion = digitalRead(PIRPIN) == HIGH;

    if (currentMotion == true) {
        lastMotionDetected = millis();
        presenceDetected = true;
    } else {
        if ((millis() - lastMotionDetected) > PRESENCE_TIMEOUT) {
            presenceDetected = false;
        }
    }

    // Get local time (GMT+8) for display
    DateTime localNow = getLocalDateTime();
    char displayTimestampBuffer[32];
    sprintf(displayTimestampBuffer, "%04d-%02d-%02d %02d:%02d:%02d", localNow.year(), localNow.month(), localNow.day(), localNow.hour(), localNow.minute(), localNow.second());

    // Get UTC time for MQTT
    DateTime utcNow = rtc.now();
    char mqttTimestampBuffer[32];
    sprintf(mqttTimestampBuffer, "%04d-%02d-%02d %02d:%02d:%02d", utcNow.year(), utcNow.month(), utcNow.day(), utcNow.hour(), utcNow.minute(), utcNow.second());

    Serial.printf("\n[%s] Sensor Reading:\n", displayTimestampBuffer);

    bool validReading = true;
    if (isnan(temperature) || isnan(humidity)) {
        Serial.println("ERROR: Failed to read from DHT22 sensor!");

        validReading = false;
    } else {
        Serial.printf("- Temperature: %.1f°C\n", temperature);
        Serial.printf("- Humidity: %.1f%%\n", humidity);
    }

    Serial.printf("- Motion (current): %s\n", currentMotion ? "DETECTED" : "None");
    Serial.printf("- Presence (overall): %s\n", presenceDetected ? "OCCUPIED" : "Empty");
    if (presenceDetected && !currentMotion) {
        unsigned long timeSinceMotion = (millis() - lastMotionDetected) / 1000;

        Serial.printf("  (Last motion: %lu seconds ago)\n", timeSinceMotion);
    }

    String status;
    if (!validReading) {
        Serial.println("Skipping local display update due to invalid sensor readings");

        status = "Sensor Error";
    } else if (offlineMode) {
        Serial.println("Device in offline mode - displaying sensor data locally only");

        status = "Offline";
    } else if (mqttClient.connected()) {
        publishSensorData(temperature, humidity, presenceDetected, mqttTimestampBuffer);

        status = "Published";
    } else {
        Serial.println("Skipping MQTT publish - not connected to broker");

        status = "MQTT Disconn.";
    }

    displaySensorData(temperature, humidity, presenceDetected, status);
}

void publishSensorData(float temperature, float humidity, bool occupancy, const String& timestamp) {
    JsonDocument innerDoc;
    innerDoc["agency"] = DEVICE_AGENCY;
    innerDoc["floor"] = DEVICE_FLOOR;
    innerDoc["room"] = DEVICE_ROOM;
    innerDoc["temperature"] = round(temperature * 100.0) / 100.0;
    innerDoc["humidity"] = round(humidity * 100.0) / 100.0;
    innerDoc["occupancy"] = occupancy;
    innerDoc["timestamp"] = timestamp;

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

DateTime getLocalDateTime() {
    DateTime utcTime = rtc.now();

    // Add timezone offset (GMT+8) in seconds
    time_t adjustedTime = utcTime.unixtime() + (TIMEZONE_OFFSET * 3600);
    return DateTime(adjustedTime);
}

void syncRTCWithNTP() {
    Serial.println("Syncing RTC with NTP server...");
    displayMessage("Syncing time\nwith NTP...", true);

    // Configure time with NTP server
    // Format: configTime(timezone_offset_in_seconds, daylight_offset_in_seconds, ntp_server1, ntp_server2, ntp_server3)
    // For GMT+8, we use +8 hours (positive because we want the local time in GMT+8)
    // However, we need to store UTC in the RTC, so we use 0 offset here and handle conversion manually
    configTime(0, 0, "pool.ntp.org", "time.nist.gov", "time.google.com");

    Serial.println("Waiting for NTP time sync...");
    time_t now = time(nullptr);
    int retry = 0;
    while (now < 24 * 3600 && retry < 20) {
        delay(500);
        Serial.print(".");
        now = time(nullptr);
        retry++;
    }

    Serial.println();
    if (now > 24 * 3600) {
        // The UTC time from NTP is already correct
        struct tm* utcInfo = gmtime(&now);

        DateTime utcDateTime(utcInfo->tm_year + 1900, utcInfo->tm_mon + 1, utcInfo->tm_mday,
                             utcInfo->tm_hour, utcInfo->tm_min, utcInfo->tm_sec);
        rtc.adjust(utcDateTime);

        Serial.println("RTC synced successfully with NTP!");

        // Display local time (GMT+8) for user feedback
        time_t localTime = now + (8 * 3600);
        struct tm* localInfo = gmtime(&localTime);
        Serial.printf("Current local time (GMT+8): %04d-%02d-%02d %02d:%02d:%02d\n",
                      localInfo->tm_year + 1900, localInfo->tm_mon + 1, localInfo->tm_mday,
                      localInfo->tm_hour, localInfo->tm_min, localInfo->tm_sec);

        displayMessage("Time Synced!", true);
        delay(1500);
    } else {
        Serial.println("NTP sync failed - using RTC as-is");
        displayMessage("NTP Failed\nUsing RTC", true);
        delay(1500);
    }
}
