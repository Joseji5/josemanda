const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

let gameRunning = false;
let score = 0;
let speed = 4;

const player = {
    x: 50,
    y: canvas.height - 50,
    size: 30,
    color: "#00ffcc",
    vy: 0,
    gravity: 0.8,
    jumpPower: -12,
    onGround: true
};

const obstacles = [];
const points = [];

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

function drawObstacles() {
    ctx.fillStyle = "red";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
    });
}

function drawPoints() {
    ctx.fillStyle = "blue";
    points.forEach(point => {
        ctx.fillRect(point.x, point.y, point.size, point.size);
    });
}

function updateGame() {
    player.vy += player.gravity;
    player.y += player.vy;

    if (player.y > canvas.height - 50) {
        player.y = canvas.height - 50;
        player.onGround = true;
        player.vy = 0;
    }

    obstacles.forEach(obstacle => {
        obstacle.x -= speed;
    });

    points.forEach(point => {
        point.x -= speed;
    });

    if (Math.random() < 0.02) {
        obstacles.push({ x: canvas.width, y: canvas.height - 50, size: 30 });
    }

    if (Math.random() < 0.01) {
        points.push({ x: canvas.width, y: canvas.height - 100, size: 20 });
    }

    obstacles.forEach((obstacle, index) => {
        if (
            player.x < obstacle.x + obstacle.size &&
            player.x + player.size > obstacle.x &&
            player.y < obstacle.y + obstacle.size &&
            player.y + player.size > obstacle.y
        ) {
            endGame();
        }

        if (obstacle.x < -obstacle.size) {
            obstacles.splice(index, 1);
        }
    });

    points.forEach((point, index) => {
        if (
            player.x < point.x + point.size &&
            player.x + player.size > point.x &&
            player.y < point.y + point.size &&
            player.y + player.size > point.y
        ) {
            score += 10;
            points.splice(index, 1);
        }

        if (point.x < -point.size) {
            points.splice(index, 1);
        }
    });

    speed += 0.001;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawObstacles();
    drawPoints();

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Puntuación: " + score, 10, 30);
}

function gameLoop() {
    if (gameRunning) {
        updateGame();
        drawGame();
        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && player.onGround) {
        player.vy = player.jumpPower;
        player.onGround = false;
    }
});

document.getElementById("btn-jugar").addEventListener("click", () => {
    document.getElementById("pantalla-inicio").style.display = "none";
    canvas.style.display = "block";
    gameRunning = true;
    score = 0;
    speed = 4;
    gameLoop();
});

document.getElementById("btn-reiniciar").addEventListener("click", () => {
    document.getElementById("pantalla-final").style.display = "none";
    gameRunning = true;
    score = 0;
    speed = 4;
    gameLoop();
});

function endGame() {
    gameRunning = false;
    document.getElementById("pantalla-final").style.display = "flex";
    document.getElementById("mensaje-resultado").innerText = "¡Perdiste! Puntuación: " + score;
}

