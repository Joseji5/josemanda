const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let gameRunning = false;

const player1 = { x: 100, y: 250, size: 50, color: "blue", speed: 5, vx: 0, vy: 0, lives: 3, attack: false, attackCooldown: false };
const player2 = { x: 650, y: 250, size: 50, color: "red", speed: 5, vx: 0, vy: 0, lives: 3, attack: false, attackCooldown: false };

const keys = {};

function drawPlayer(player, number) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(number, player.x + 15, player.y + 35);

    if (player.attack) {
        ctx.beginPath();
        ctx.arc(player.x + 25, player.y + 25, 40, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fill();
    }
}

function drawLives() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Jugador 1", 50, 50);
    ctx.fillText("Jugador 2", 650, 50);

    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(50 + i * 30, 70, 10, 0, Math.PI * 2);
        ctx.fillStyle = i < player1.lives ? "blue" : "gray";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(750 - i * 30, 70, 10, 0, Math.PI * 2);
        ctx.fillStyle = i < player2.lives ? "red" : "gray";
        ctx.fill();
    }
}

function checkAttack(player, opponent) {
    if (player.attack) {
        const dist = Math.hypot(opponent.x - player.x, opponent.y - player.y);
        if (dist < 60) {
            opponent.lives--;
            player.attack = false;
            setTimeout(() => (player.attackCooldown = false), 1000);
        }
    }
}

function updateGame() {
    player1.x += player1.vx;
    player1.y += player1.vy;
    player2.x += player2.vx;
    player2.y += player2.vy;

    checkAttack(player1, player2);
    checkAttack(player2, player1);

    if (player1.lives === 0 || player2.lives === 0) {
        gameRunning = false;
        document.getElementById("pantalla-final").style.display = "flex";
        document.getElementById("mensaje-ganador").innerText =
            player1.lives > 0 ? "¡Jugador 1 GANA!" : "¡Jugador 2 GANA!";
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLives();
    drawPlayer(player1, "1");
    drawPlayer(player2, "2");
}

function gameLoop() {
    if (gameRunning) {
        updateGame();
        drawGame();
        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;

    if (e.key === "w" && keys["w"] && !player1.attackCooldown) {
        player1.attack = true;
        player1.attackCooldown = true;
        setTimeout(() => (player1.attack = false), 500);
    }
    if (e.key === "ArrowUp" && keys["ArrowUp"] && !player2.attackCooldown) {
        player2.attack = true;
        player2.attackCooldown = true;
        setTimeout(() => (player2.attack = false), 500);
    }
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

document.getElementById("btn-jugar").addEventListener("click", () => {
    document.getElementById("pantalla-inicio").style.display = "none";
    canvas.style.display = "block";
    gameRunning = true;
    gameLoop();
});

document.getElementById("btn-reiniciar").addEventListener("click", () => {
    player1.lives = 3;
    player2.lives = 3;
    player1.x = 100;
    player2.x = 650;
    document.getElementById("pantalla-final").style.display = "none";
    gameRunning = true;
    gameLoop();
});
