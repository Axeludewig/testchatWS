const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 80 });
let connectedUsers = 0; // Variable to track the number of connected users

wss.on("connection", function connection(ws) {
	// Increment the connected users count
	connectedUsers++;
	console.log(
		"Nuevo usuario conectado. Total de usuarios conectados:",
		connectedUsers
	);

	// Send the number of connected users and connect notification to all clients
	sendConnectedUserCount();
	sendNotification(
		`Nuevo usuario conectado. Total de usuarios: ${connectedUsers}`
	);

	ws.on("message", function incoming(message) {
		// This event handler is triggered when a message is received from a client
		console.log("Mensaje recibido:", message);

		wss.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(message);
			}
		});
	});

	ws.on("close", function close() {
		// Decrement the connected users count
		connectedUsers--;
		console.log(
			"Usuario desconectado. Total de usuarios conectados:",
			connectedUsers
		);

		// Send the updated number of connected users and disconnect notification to all clients
		sendConnectedUserCount();
		sendNotification(
			`Usuario desconectado. Total de usuarios: ${connectedUsers}`
		);
	});

	ws.send("Bienvenido al servidor de chat!");
});

// Function to send the number of connected users to all clients
function sendConnectedUserCount() {
	const message = `Total de usuarios conectados: ${connectedUsers}`;
	wss.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(message, function error(err) {
				if (err) {
					console.error("Error sending connected user count:", err);
				}
			});
		}
	});
}

// Function to send a notification to all clients
function sendNotification(notification) {
	wss.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(notification, function error(err) {
				if (err) {
					console.error("Error sending notification:", err);
				}
			});
		}
	});
}

if (wss) {
	console.log("Running chat server...");
}
