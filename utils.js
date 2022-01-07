const generateRoomId = () => {
	return Math.floor(Math.random() * (99999 - 10000)) + 10000;
};

const defaultBoard = [
	["", "", ""],
	["", "", ""],
	["", "", ""],
];

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

module.exports = { generateRoomId, defaultBoard, getRoomIdCookie, getCurrentDate };
