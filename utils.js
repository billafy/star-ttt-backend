const generateRoomId = () => {
	return Math.floor(Math.random() * (99999 - 10000)) + 10000;
};

const getRoomIdCookie = (cookieString) => {
	if(!cookieString) 
		return "";
	const splitCookies = cookieString.split(";");
	for (cookie of splitCookies) {
		const [name, value] = cookie.split("=");
		if (name.trim() === "roomId") return value.trim();
	}
	return "";
};

const getCurrentDate = () => {
	const date = new Date();
	return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

const checkWinner = (board, move) => {
	for (let i = 0; i < 3; ++i) {
		for (let j = 0; j < 3; ++j) {
			if (board[i][j] !== move) break;
			if (j == 2) return true;
		}
	}
	for (let i = 0; i < 3; ++i) {
		for (let j = 0; j < 3; ++j) {
			if (board[j][i] !== move) break;
			if (j == 2) return true;
		}
	}
	for (let i = 0, j = 0; i < 3 && j < 3; ++i, ++j) {
		if (board[i][j] !== move) break;
		if (i == 2) return true;
	}
	for (let i = 0, j = 2; i < 3 && j >= 0; ++i, --j) {
		if (board[i][j] !== move) break;
		if (i == 2) return true;
	}
	return false;
};

module.exports = { generateRoomId, getRoomIdCookie, getCurrentDate, checkWinner };
