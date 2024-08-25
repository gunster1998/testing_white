const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d")
let mouseX = 0;
let mouseY = 0;
let gameOver = false;
let scoreHero1 = 0;
let scoreHero2 = 0;


  
// параметры для героев




const hero1 = {
    x:50,
    y: canvas.height/2,
    radius:20,
    speedY:5,
    color:"#FF0000",
    health:100
};

const hero2 = {
    x:canvas.width-50,
    y: canvas.height/2,
    radius:20,
    speedY:5,
    color:"#0000FF",
    health:100
}

//Типы снарядов
let projectiles= []

function drawCircle(hero){
    ctx.beginPath();
    ctx.arc(hero.x,hero.y, hero.radius,0,Math.PI*2);
    ctx.fillStyle = hero.color;
    ctx.fill();
    ctx.closePath();

};
// рисование снаряда
function drawProjectile(projectile) {
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
    ctx.fillStyle = projectile.color;
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Герой 1 Очков: " + scoreHero1, 10, 20);
    ctx.fillText("Герой 2 Очков: " + scoreHero2, canvas.width - 160, 20);
}


function drawHealthBar(hero){
    const barWidth = 50;
    const barHeight = 5;
    const x = hero.x - barWidth / 2;
    const y = hero.y - hero.radius - 10;

    // Рисуем рамку для полоски здоровья
    ctx.strokeStyle = "#000";
    ctx.strokeRect(x, y, barWidth, barHeight);

    // Рисуем заполненную часть полоски здоровья
    const healthWidth = (hero.health / 100) * barWidth;
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, healthWidth, barHeight);
}



let keys = {};

document.addEventListener("keydown", (e) =>{
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
})

canvas.addEventListener("mousemove",(e) => {
    mouseX = e.clientX- canvas.offsetLeft;
    mouseY = e.clientY - canvas.offsetTop;
})



function updateHero (hero,upKey,downkey){

    /// обновление cнаряд
    if (keys[upKey]) {
        hero.y -= hero.speedY;
    } else if (keys[downkey]) {
        hero.y += hero.speedY;
    }
    // удаление снярдов за границей
    if (hero.y +hero.radius > canvas.height) {
        hero.speedY *= -1; 
        hero.y = canvas.height - hero.radius;
        
    } else if ( hero.y - hero.radius <0){
        hero.speedY *= -1; 
        hero.y = hero.radius;
    }

    
    const distance = Math.hypot(hero.x - mouseX, hero.y - mouseY);
    //console.log(distance)
    if (distance < hero.radius + 2) { // Увеличьте отступ для более чувствительного отталкивания
        if (hero.y < mouseY) {
            hero.y -= hero.speedY; // Двигаем героя вверх
            hero.speedY *= -1; 
        } else {
            hero.y += hero.speedY; // Двигаем героя вниз
            hero.speedY *= -1; 
        }
    }
}

function fireProjectile(hero, direction){
    const projectile = {
        x:hero.x + (direction === 1 ? hero.radius  : -hero.radius),
        y:hero.y,
        radius:5, 
        speedX:5 * direction,
        color: hero.color,

    }
    projectiles.push(projectile)
}

function checkGameOver() {
    if (hero1.health <= 0 || hero2.health <= 0) {
        gameOver = true;
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";

        if (hero1.health <= 0) {
            ctx.fillText("Герой 2 победил!", canvas.width / 2, canvas.height / 2);
        } else if (hero2.health <= 0) {
            ctx.fillText("Герой 1 победил!", canvas.width / 2, canvas.height / 2);
        }

        document.getElementById("restartButton").style.display = "block";
    }
}

//Обновление снарядов

function updateProjectiles(){
    // обновление снарядов
    for (let i=projectiles.length -1; i>=0; i--) {
        const projectile = projectiles[i];
        projectile.x += projectile.speedX;

    //удаляем
    if (projectile.x +projectile.radius < 0 || projectile.x - projectile.radius > canvas.width){
        projectiles.splice(i,1);
    }

    //проверяем столкновение с героем
    if (Math.hypot(hero2.x - projectile.x, hero2.y - projectile.y) < hero2.radius + projectile.radius) {
        projectiles.splice(i, 1);
        hero2.health -= 10; // Уменьшаем здоровье героя 2
        scoreHero1++
        console.log("Попадание в героя 2");
    } else if (Math.hypot(hero1.x - projectile.x, hero1.y - projectile.y) < hero1.radius + projectile.radius) {
        projectiles.splice(i, 1);
        hero1.health -= 10; // Уменьшаем здоровье героя 1
        scoreHero2++
        console.log("Попадание в героя 1");
    }
    }
}

function gameLoop(){
    if (!gameOver){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    updateHero(hero1,"w","s");
    drawHealthBar(hero1);
    updateHero(hero1,"ц","ы");
    updateHero(hero2, "ArrowUp","ArrowDown");
    drawHealthBar(hero2);
    drawScore()

    drawCircle(hero1);
    drawCircle(hero2);
  
    updateProjectiles();
    for (let i = 0; i < projectiles.length; i++) {
        drawProjectile(projectiles[i]);
        console.log("Отрисовка снаряда:", projectiles[i]); // Отладка
    }
    checkGameOver()
    requestAnimationFrame(gameLoop);
}
}

function restartGame() {
    hero1.health = 100;
    hero2.health = 100;
    scoreHero1 = 0;
    scoreHero2 = 0;
    projectiles = [];
    gameOver = false;

    document.getElementById("restartButton").style.display = "none";

    gameLoop(); // Перезапускаем игру
}



document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
        fireProjectile(hero1, 1); // Пробел для стрельбы вправо (герой 1)
        console.log(projectiles)
    } else if (e.key === "Enter") {
        fireProjectile(hero2, -1); // Enter для стрельбы влево (герой 2)
    }
});

gameLoop();