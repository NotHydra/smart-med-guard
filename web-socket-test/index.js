const { io } = require("socket.io-client");

const WS_SERVER_URL = "http://localhost:3002";
const RECONNECT_ATTEMPTS = 5;
const CONNECT_TIMEOUT = 5000;

console.log("🚀 Starting WebSocket Debug Client...");
console.log(`📡 Connecting to: ${WS_SERVER_URL}`);

const socket = io(WS_SERVER_URL, {
	transports: ["websocket"],
	timeout: CONNECT_TIMEOUT,
	reconnectionAttempts: RECONNECT_ATTEMPTS,
	reconnectionDelay: 1000,
});

socket.on("connect", function () {
	console.log("✅ Connected to the Socket.IO server! 🚀");
	console.log(`🆔 Socket ID: ${socket.id}`);
	console.log(`🔌 Transport: ${socket.io.engine.transport.name}`);

	socket.emit("hello", "Hello from debug client!");

	console.log("📤 Sent hello message to server");
});

socket.on("connect_error", function (err) {
	console.error("❌ Socket.IO connection error:", err.message);
	console.error("🔍 Error details:", err);
});

socket.on("disconnect", function (reason) {
	console.log(`🔌 Disconnected from server. Reason: ${reason}`);
});

socket.on("reconnect", function (attemptNumber) {
	console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
});

socket.on("reconnect_attempt", function (attemptNumber) {
	console.log(`🔄 Reconnection attempt #${attemptNumber}`);
});

socket.on("reconnect_error", function (err) {
	console.error("❌ Reconnection error:", err.message);
});

socket.on("reconnect_failed", function () {
	console.error("❌ Reconnection failed after all attempts");
});

socket.on("hello", function (data) {
	console.log(`📨 Received hello response:`, data);
});

const iotDeviceIds = ["cmecl1ysi07yqo50y5nhd0wto"];

iotDeviceIds.forEach((iotDeviceId) => {
	socket.emit("iot-device-topic-join", iotDeviceId);

	socket.on("new", function (data) {
		console.log(`📡 New data from IoT device (${iotDeviceId}):`, data);
	});

	socket.on("history", function (data) {
		console.log(`📜 History data from IoT device (${iotDeviceId}):`, data);
	});
});

process.on("SIGINT", function () {
	console.log("\n🛑 Shutting down debug client...");

	socket.emit("iot-device-topic-leave");
	socket.disconnect();

	console.log("👋 Debug client stopped");

	process.exit(0);
});

console.log("🎯 Listening for IoT device events...");
console.log("📝 Expected event patterns:");

iotDeviceIds.forEach((iotDeviceId) => {
	console.log(`   - iot-device/${iotDeviceId}`);
});

console.log("\n⏳ Waiting for events... (Press Ctrl+C to stop)");
