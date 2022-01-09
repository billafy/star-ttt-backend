const { BulkWriteResult } = require("mongodb");
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
		playerTurn: 'player1',
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

const checkWinner = (board, move) => {
	for(let i = 0; i < 3; ++i) {
		for(let j = 0; j < 3; ++j) {
			if(board[i][j] !== move) 
				break;
			if(j == 2) 
				return true;
		}
	}
	for(let i = 0; i < 3; ++i) {
		for(let j = 0; j < 3; ++j) {
			if(board[j][i] !== move) 
				break;
			if(j == 2) 
				return true;
		}
	}
	for(let i = 0, j = 0; i < 3 && j < 3; ++i, ++j) {
		if(board[i][j] !== move) 
			break;
		if(i == 2) 
			return true;
	}
	for(let i = 0, j = 2; i < 3 && j >= 0; ++i, --j) {
		if(board[i][j] !== move) 
			break;
		if(i == 2) 
			return true;
	}
	return false;
}

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
		});

		socket.on('play-turn', (body) => {
			const {position, roomId, player} = body;
			if(!position || !roomId || !rooms[roomId]) 
				return;
			if(rooms[roomId].board[position[0]][position[1]] !== "") 
				return;
			if(player === 'player1') {
				rooms[roomId].board[position[0]][position[1]] = 'X';
				rooms[roomId].playerTurn = 'player2';
			}
			else {
				rooms[roomId].board[position[0]][position[1]] = 'O';
				rooms[roomId].playerTurn = 'player1';
			}
			rooms[roomId].turns += 1;
			if(rooms[roomId].turns >= 5) {
				let winner = "";
				if(player === 'player1') 
					winner = checkWinner(rooms[roomId].board, 'X');
				else 
					winner = checkWinner(rooms[roomId].board, 'O');
				console.log(winner);
				if(winner) {
					rooms[roomId].gameOver = true;
					rooms[roomId].winner = player;
				}
			}
			io.to(String(roomId)).emit('room-data', rooms[roomId]);
		})
	});
};

module.exports = { createRoom, socketHandler };
