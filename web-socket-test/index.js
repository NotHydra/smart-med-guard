const { io } = require("socket.io-client");

const socket = io("http://localhost:3002", {
	transports: ["websocket"],
});

socket.on("connect", function () {
	console.log("Connected to the Socket.IO server! 🚀");
	console.log("Socket ID:", socket.id);

	socket.emit("hello", "Hello, Server!");
});

socket.on("hello", function (data) {
	console.log(`Received from server: ${data}`);
});

socket.on("connect_error", function (err) {
	console.error("Socket.IO error:", err);
});

socket.on("disconnect", function () {
	console.log("Disconnected from the Socket.IO server.");
});
