const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const socket = io();
let players = {};
let playerId = null;

socket.on("playerId", id => {
    playerId = id;
});

socket.on("updatePlayers", serverPlayers => {
    players = serverPlayers;
});

const keys = {};
window.addEventListener("keydown", e => (keys[e.key] = true));
window.addEventListener("keyup", e => (keys[e.key] = false));

function update() {
    if (playerId && players[playerId]) {
        let player = players[playerId];
        if (keys["w"]) player.y -= 5;
        if (keys["s"]) player.y += 5;
        if (keys["a"]) player.x -= 5;
        if (keys["d"]) player.x += 5;
        socket.emit("move", player);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let id in players) {
        let p = players[id];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = p.id === playerId ? "blue" : "red";
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillText(p.id, p.x - 5, p.y + 5);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();
