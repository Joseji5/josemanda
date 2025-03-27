const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

let players = {};

io.on("connection", socket => {
    let id = socket.id;
    players[id] = { id, x: Math.random() * 800, y: Math.random() * 600, score: 0 };

    socket.emit("playerId", id);
    io.emit("updatePlayers", players);

    socket.on("move", playerData => {
        if (players[id]) {
            players[id] = playerData;
            io.emit("updatePlayers", players);
        }
    });

    socket.on("attack", () => {
        for (let otherId in players) {
            if (otherId !== id) {
                let attacker = players[id];
                let target = players[otherId];
                let distance = Math.hypot(attacker.x - target.x, attacker.y - target.y);
                
                if (distance < 50) {  // Si está en rango, el otro muere
                    players[otherId].x = Math.random() * 800;
                    players[otherId].y = Math.random() * 600;
                    players[id].score += 1;
                    io.emit("updatePlayers", players);
                }
            }
        }
    });

    socket.on("disconnect", () => {
        delete players[id];
        io.emit("updatePlayers", players);
    });
});

server.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
