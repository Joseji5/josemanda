// Configuración básica
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas") });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear nave
const geometry = new THREE.ConeGeometry(1, 2, 8);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(geometry, material);
scene.add(player);

player.position.z = -5;

// Controles
let keys = {};
window.addEventListener("keydown", (event) => keys[event.key] = true);
window.addEventListener("keyup", (event) => keys[event.key] = false);

function movePlayer() {
    if (keys["ArrowLeft"]) player.position.x -= 0.1;
    if (keys["ArrowRight"]) player.position.x += 0.1;
    if (keys["ArrowUp"]) player.position.y += 0.1;
    if (keys["ArrowDown"]) player.position.y -= 0.1;
}

// Crear enemigos
const enemies = [];
function createEnemy() {
    const geo = new THREE.SphereGeometry(0.5, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const enemy = new THREE.Mesh(geo, mat);
    enemy.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5, -10);
    scene.add(enemy);
    enemies.push(enemy);
}

// IA de enemigos
function moveEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.position.z += 0.05;
        if (enemy.position.z > 0) {
            scene.remove(enemy);
            enemies.splice(index, 1);
            createEnemy();
        }
    });
}

// Disparos
const bullets = [];
function shoot() {
    const bulletGeo = new THREE.BoxGeometry(0.2, 0.2, 0.5);
    const bulletMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bullet = new THREE.Mesh(bulletGeo, bulletMat);
    bullet.position.set(player.position.x, player.position.y, player.position.z - 1);
    scene.add(bullet);
    bullets.push(bullet);
}

window.addEventListener("keydown", (event) => {
    if (event.key === " ") shoot();
});

// Movimiento de disparos
function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.position.z -= 0.2;
        if (bullet.position.z < -10) {
            scene.remove(bullet);
            bullets.splice(index, 1);
        }
    });
}

// Colisiones
function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            const distance = bullet.position.distanceTo(enemy.position);
            if (distance < 0.5) {
                scene.remove(bullet);
                scene.remove(enemy);
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                createEnemy();
            }
        });
    });
}

// Animación
function animate() {
    requestAnimationFrame(animate);
    movePlayer();
    moveEnemies();
    moveBullets();
    checkCollisions();
    renderer.render(scene, camera);
}

for (let i = 0; i < 5; i++) createEnemy();
animate();

