const {
	generateRoomId,
	defaultBoard,
	getCurrentDate,
} = require("./utils.js");

let rooms = {};

const createRoom = (req, res) => {
	const username = req.body.username;
	if (!username)
		return res
			.json({ success: false, error: "Username not provided" })
			.status(400);
	let roomId = generateRoomId();
	while (rooms[roomId]) roomId = generateRoomId();
	rooms[roomId] = {
		roomId: roomId,
		players: { player1: {}, player2: {} },
		board: defaultBoard,
		turns: 0,
	};
	res.json({
		success: true,
		roomId,
		room: rooms[roomId],
	});
};

const socketHandler = (io) => {
	io.on("connection", (socket) => {
		console.log(`${getCurrentDate()} ${socket.id}`);
		socket.on("join-room", (body) => {
			const { username, roomId } = body;
			if (!username || !roomId) return;
			if (!rooms[roomId].players.player1.playerId)
				rooms[roomId].players.player1 = {
					username: username,
					playerId: socket.id,
				};
			else if (!rooms[roomId].players.player2.playerId)
				rooms[roomId].players.player2 = {
					username: username,
					playerId: socket.id,
				};
			else return;
			socket.join(String(roomId));
			io.to(String(roomId)).emit('room-data', rooms[roomId]);
			console.log(rooms[roomId]);
		});
	});
};

module.exports = { createRoom, socketHandler };
