let room, tBox, rBox; 

const socket = io("http://localhost:3000", {withCredentials: true});

const createRoom = async () => {
    const username = document.getElementById("username").value.trim();
    if (!username) return;
    const response = await fetch("http://localhost:3000/create-room", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
        credentials: 'include',
        secure: true,
    });
    const data = await response.json();
    console.log(data);
    if(data.success) {
        socket.emit('join-room', {username, roomId: data.roomId}, {credentials: 'include'});
        rBox.style.display = 'none';
        tBox.style.display = 'block';
    }
};

const joinRoom = async () => {
    const username = document.getElementById("username").value.trim(),
        roomId = document.getElementById("roomId").value.trim();
    if(!username || !roomId) 
        return;
    socket.emit("join-room", { username, roomId });
};

window.addEventListener("load", () => {
    const createRoomBtn = document.getElementById("createRoomBtn");
    const joinRoomBtn = document.getElementById("joinRoomBtn");
    rBox = document.getElementById("room-join");
    tBox = document.getElementById("tic-tac-toe");

    if (createRoomBtn) createRoomBtn.addEventListener("click", createRoom);
    if (joinRoomBtn) joinRoomBtn.addEventListener("click", joinRoom);
});

/* let turn = "X";
let isgameover = false;

const changeTurn = () => {
    return turn === "X" ? "0" : "X";
};

const checkWin = () => {
    let boxtext = document.getElementsByClassName("boxtext");
    let wins = [
        [0, 1, 2, 5, 5, 0],
        [3, 4, 5, 5, 15, 0],
        [6, 7, 8, 5, 25, 0],
        [0, 3, 6, -5, 15, 90],
        [1, 4, 7, 5, 15, 90],
        [2, 5, 8, 15, 15, 90],
        [0, 4, 8, 5, 15, 45],
        [2, 4, 6, 5, 15, 135],
    ];
    wins.forEach((e) => {
        if (
            boxtext[e[0]].innerText === boxtext[e[1]].innerText &&
            boxtext[e[2]].innerText === boxtext[e[1]].innerText &&
            boxtext[e[0]].innerText !== ""
        ) {
            document.querySelector(".info").innerText =
                boxtext[e[0]].innerText + " Won";
            isgameover = true;
            document
                .querySelector(".imgbox")
                .getElementsByTagName("img")[0].style.width = "200px";
            document.querySelector(
                ".line"
            ).style.transform = `translate(${e[3]}vw, ${e[4]}vw) rotate(${e[5]}deg)`;
            document.querySelector(".line").style.width = "20vw";
        }
    });
};

let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach((element) => {
    let boxtext = element.querySelector(".boxtext");
    element.addEventListener("click", () => {
        if (boxtext.innerText === "") {
            boxtext.innerText = turn;
            turn = changeTurn();
            checkWin();
            if (!isgameover) {
                document.getElementsByClassName("info")[0].innerText =
                    "Turn for " + turn;
            }
        }
    });
});

reset.addEventListener("click", () => {
    let boxtexts = document.querySelectorAll(".boxtext");
    Array.from(boxtexts).forEach((element) => {
        element.innerText = "";
    });
    turn = "X";
    isgameover = false;
    document.querySelector(".line").style.width = "0vw";
    document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
    document
        .querySelector(".imgbox")
        .getElementsByTagName("img")[0].style.width = "0px";
}); */
