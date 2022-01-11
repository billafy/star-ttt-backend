const { generateRoomId, getCurrentDate, checkWinner } = require("./utils.js");

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
		board: [
			["", "", ""],
			["", "", ""],
			["", "", ""],
		],
		turns: 0,
		playerTurn: "player1",
		gameOver: false,
		winner: null,
		winningRow: [],
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
					winCount: 0,
				};
			else if (!rooms[roomId].players.player2.playerId)
				rooms[roomId].players.player2 = {
					username: username,
					playerId: socket.id,
					winCount: 0,
				};
			else return;
			socket.join(String(roomId));
			io.to(String(roomId)).emit("room-data", rooms[roomId]);
		});

		socket.on("play-turn", (body) => {
			const { position, roomId, player } = body;
			if (!position || !roomId || !rooms[roomId] || rooms[roomId].gameOver) return;
			if (rooms[roomId].board[position[0]][position[1]] !== "") return;
			if (player === "player1") {
				rooms[roomId].board[position[0]][position[1]] = "X";
				rooms[roomId].playerTurn = "player2";
			} else {
				rooms[roomId].board[position[0]][position[1]] = "O";
				rooms[roomId].playerTurn = "player1";
			}
			rooms[roomId].turns += 1;
			if (rooms[roomId].turns >= 5) {
				let winner = "";
				if (player === "player1")
					winner = checkWinner(rooms[roomId].board, "X");
				else winner = checkWinner(rooms[roomId].board, "O");
				if (winner) {
					rooms[roomId].gameOver = true;
					rooms[roomId].winner = player;
					++rooms[roomId].players[player].winCount;
				}
				else if(rooms[roomId].turns === 9)
					rooms[roomId].gameOver = true;
			}
			io.to(String(roomId)).emit("room-data", rooms[roomId]);
		});

		socket.on('play-again', (body) => {
			const {roomId} = body;
			if(!roomId) return; 
			rooms[roomId] = {
				...rooms[roomId],
				board: [ 
					["", "", ""],
					["", "", ""],
					["", "", ""],
				],
				turns: 0,
				playerTurn: "player1",
				gameOver: false,
				winner: null,
				winningRow: [],
			};
			io.to(String(roomId)).emit("room-data", rooms[roomId]);
		})
	});
};

module.exports = { createRoom, socketHandler };