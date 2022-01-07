const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const socketIo = require("socket.io");
const { createRoom, socketHandler } = require("./controller");

const app = express();
const port = 5000;

const corsConfig = {
	origin: "http://localhost:3000",
	credentials: true,
	sameSite: "None",
	secure: true,
};

app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());

app.post("/create-room", createRoom);

const server = app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

const io = socketIo(server, {
	cors: corsConfig,
});
socketHandler(io);
