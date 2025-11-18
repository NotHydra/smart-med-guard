#include <Arduino.h>
#include <RTClib.h>

extern RTC_DS3231 rtc;

/**
 * Syncs the RTC with the provided date and time (in GMT+8)
 * @param year - Year (e.g., 2025)
 * @param month - Month (1-12)
 * @param day - Day (1-31)
 * @param hour - Hour (0-23, GMT+8 timezone)
 * @param minute - Minute (0-59)
 * @param second - Second (0-59)
 */
void syncRTC(uint16_t year, uint8_t month, uint8_t day, uint8_t hour, uint8_t minute, uint8_t second) {
    // Convert GMT+8 time back to UTC by subtracting 8 hours
    DateTime gmtPlus8(year, month, day, hour, minute, second);
    time_t utcTime = gmtPlus8.unixtime() - (8 * 3600);  // Subtract 8 hours for UTC

    rtc.adjust(DateTime(utcTime));
    Serial.printf("[RTC SYNC] Time set to: %04d-%02d-%02d %02d:%02d:%02d (GMT+8)\n",
                  year, month, day, hour, minute, second);
}

/**
 * Syncs RTC with system time (compilation time)
 * Useful when RTC loses power
 * Note: Compilation time is typically in UTC or local machine time
 * Adjust accordingly if needed
 */
void syncRTCWithCompilationTime() {
    // Set RTC to compilation time (assumes build system is in UTC)
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
    DateTime now = rtc.now();
    Serial.printf("[RTC SYNC] Time synced to compilation time (UTC): %04d-%02d-%02d %02d:%02d:%02d\n",
                  now.year(), now.month(), now.day(), now.hour(), now.minute(), now.second());
    Serial.println("[RTC SYNC] Note: Displayed time will show GMT+8 offset");
}

/**
 * Checks if RTC lost power
 * @return true if RTC lost power, false otherwise
 */
bool rtcLostPower() {
    return rtc.lostPower();
}

/**
 * Gets the current RTC time
 * @return DateTime object with current RTC time
 */
DateTime getRTCTime() {
    return rtc.now();
}

/**
 * Prints current RTC time to Serial
 */
void printRTCTime() {
    DateTime now = rtc.now();
    Serial.printf("[RTC] Current time: %04d-%02d-%02d %02d:%02d:%02d\n",
                  now.year(), now.month(), now.day(), now.hour(), now.minute(), now.second());
}

/**
 * Validates the RTC connection
 * @return true if RTC is connected and working, false otherwise
 */
bool isRTCConnected() {
    if (!rtc.begin()) {
        Serial.println("[RTC ERROR] RTC DS3231 not found!");
        return false;
    }
    return true;
}
