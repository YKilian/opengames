const spaceship = document.getElementById('spaceship');
let spaceship_hit_box_main = document.getElementById('spaceship_hit-box_main');
let spaceship_hit_box_wing = document.getElementById('spaceship_hit-box_wing');
const spaceshipImages = ['spaceship1.png', 'spaceship2.png'];
const pointsImages = ['1point.png', '5point.png', '10point.png'];
let currentImageIndex;
let score = 0;
let dead = true;
let health = 100;
const health_bar = document.getElementById('health_bar');
let boost = 0;
let boost_available = false;
const boost_bar = document.getElementById('boost_bar');
const status_bar = document.getElementById('status_bar');
const keyList =  [];

setInterval(switchSpaceshipImage, 150);

spaceship.addEventListener('dragstart', (event) => {
    event.preventDefault();
});
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});
document.addEventListener("dblclick", (event) =>{
    event.preventDefault();
})
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function reset_all_val(){
    score = 0;
    document.getElementById("score").innerHTML = "Score: " + score;
    currentImageIndex = 0;
    updateScore(-score);
    updateHealth(-health+100);
    updateBoost(-boost);
    health_bar.style.width = health + "%";
    set_spaceship_to_null();
}

function set_spaceship_to_null(){
    spaceship.style.left = '50%';
    spaceship.style.top = '80%';
    spaceship_hit_box_main.style.left = '49%';
    spaceship_hit_box_main.style.top = '80%';
    spaceship_hit_box_wing.style.left = '45%';
    spaceship_hit_box_wing.style.top = '85%';
}

function restart(){
    reset_all_val()
    dead = false;
    document.getElementById("gameOver").style.display = "none";
    document.addEventListener('mousemove', moveSpaceship);
    document.body.style.cursor = "none";
}

function exit(){
    reset_all_val();
    pregame();
}

function pregame(){
    reset_all_val();
    spaceship.style.transform = 'translate(-50%, 0%)';
    document.body.style.cursor = "default";
    dead= true;
    document.getElementById("gameOver").style.display = "none";
    document.getElementById("score").style.display = "none";
    status_bar.style.display = "none";
    document.getElementById("preGame").style.display = "block";
}

function start(){
    reset_all_val();
    document.getElementById("preGame").style.display = "none";
    document.getElementById("score").style.display = "block";
    spaceship.style.transform = 'translate(0%, 0%)';
    dead = false;
    document.body.style.cursor = "none";
    status_bar.style.display = "flex";
    document.addEventListener('mousemove', moveSpaceship);
    update();
}

function updateScore(amount) {
    score += amount;
    document.getElementById("score").innerHTML = "Score: " + score;
}

function updateHealth(amount){
    health += amount;
    if (health >= 100){
        health = 100;
    }
    if (health <= 0){
        health = 0;
    }
    health_bar.style.width = health + "%";
    health_bar.innerHTML = health + "HP";
}

function updateBoost(amount){
    boost += amount;
    if (boost >= 100){
        boost = 100;
    }
    if (boost <= 0){
        boost = 0;
    }
    boost_bar.style.width = boost + "%";
    boost_bar.innerHTML = boost + "%";
}

function keyDownHandler(event){
    if (! keyList.includes(event.key)){
        switch (event.key) {
            case " ":
                keyList.push(event.key);
                createLaserBeam(true);
                break;
            case "m":
                if (boost_available){
                    makeBoost();
                }
                break;
        }
    }
}

function makeBoost(){
    if(boost > 0){
        updateBoost(-1)
        createLaserBeam(false);
    }
    if (boost === 0){
        boost_available = false;
    }
}

function keyUpHandler(event) {
    let keyIndex = keyList.indexOf(event.key);
    if (keyIndex !== -1) {
        keyList.splice(keyIndex, 1);
    }
    if(event.key === 'm'){
        boost_available = false;
    }
}

function moveSpaceship(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    spaceship.style.left = mouseX - spaceship.clientWidth / 2 + 'px';
    spaceship.style.top = mouseY - spaceship.clientHeight / 2 + 'px';

    spaceship_hit_box_main.style.left = mouseX - spaceship_hit_box_main.clientWidth / 2 + 'px';
    spaceship_hit_box_main.style.top = mouseY - spaceship_hit_box_main.clientHeight / 2 + 'px';
    spaceship_hit_box_wing.style.left = mouseX - spaceship_hit_box_wing.clientWidth / 2 + 'px';
    spaceship_hit_box_wing.style.top = mouseY + spaceship_hit_box_wing.clientHeight / 8 + 'px';
}

function createLaserBeam(canIncreaseBoost) {
    const spaceshipRect = spaceship.getBoundingClientRect();
    let laserX = 0;
    let laserY = 0;
    if(canIncreaseBoost){
        let laserBeam = createNew();
        laserX = spaceshipRect.left + spaceshipRect.width / 2 - 5;
        laserY = spaceshipRect.top - 50;
        laserBeam.style.backgroundColor = 'red';
        shoot(laserBeam);
    }else{
        let laserBeam = createNew();
        laserX = spaceshipRect.left + spaceshipRect.width / 4 - 13;
        laserY = spaceshipRect.top + spaceshipRect.height / 3 - 23;
        laserBeam.style.backgroundColor = 'yellow';
        shoot(laserBeam);
        laserBeam = createNew();
        laserX = spaceshipRect.right - spaceshipRect.width / 4 + 2;
        laserY = spaceshipRect.top + spaceshipRect.height / 3 - 23;
        laserBeam.style.backgroundColor = 'yellow';
        shoot(laserBeam);
    }

    function createNew(){
        const laserBeam = document.createElement('div');
        laserBeam.classList.add('laser-beam');
        laserBeam.setAttribute('canIncreaseBoost', canIncreaseBoost);
        return laserBeam;
    }

    function shoot(laserBeam){
        laserBeam.style.left = laserX + 'px';
        laserBeam.style.top = laserY + 'px';

        const container = document.getElementById('game-container');
        container.appendChild(laserBeam);
        const laserAnimation = laserBeam.animate(
            [
                { top: laserY + 'px', opacity: 1 },
                { top: -laserBeam.clientHeight + 'px', opacity: 0 }
            ],
            {
                duration: laserY,
                easing: 'linear'
            }
        );

        laserAnimation.onfinish = () => {
            if (container.contains(laserBeam)) {
                container.removeChild(laserBeam);
            }
        };
    }
}

function switchSpaceshipImage() {
    currentImageIndex = (currentImageIndex + 1) % spaceshipImages.length;
    spaceship.src = spaceshipImages[currentImageIndex];
}

function extractPoints(absolutePath) {
    const lastSlashIndex = absolutePath.lastIndexOf('/');
    const fileName = absolutePath.substring(lastSlashIndex + 1);
    const fileNameParts = fileName.split('_');
    const numberPrefix = parseInt(fileNameParts[0], 10);

    if (!isNaN(numberPrefix) && numberPrefix >= 1 && numberPrefix <= 100) {
        return numberPrefix;
    } else {
        return null;
    }
}


function update() {
    const container = document.getElementById('game-container');
    const containerHeight = container.clientHeight;
    let maxItems = Math.min(50, 10+score/100);

    function checkCollisions() {
        const fallingImages = document.querySelectorAll('.enemy');
        const laserBeams = document.querySelectorAll('.laser-beam');

        fallingImages.forEach((fallingImage) => {
            laserBeams.forEach((laserBeam) => {
                if (isCollision(fallingImage, laserBeam)) {
                    let eHealth = parseInt(fallingImage.getAttribute('HealthPoints') - 1);
                    let points = parseInt(fallingImage.getAttribute('Points'));
                    if (eHealth <= 0){
                        updateScore(extractPoints(fallingImage.src))
                        if (container.contains(fallingImage)) {
                            container.removeChild(fallingImage);
                        }
                        if (laserBeam.getAttribute('canIncreaseBoost') === 'true'){
                            updateBoost(points);
                        }
                    }else{
                        fallingImage.setAttribute('HealthPoints', eHealth.toString());
                    }
                    if (container.contains(laserBeam)) {
                        container.removeChild(laserBeam);
                    }
                    if (boost >= 100){
                        boost_available = true;
                    }
                }
            });

            if (isCollision(fallingImage, spaceship_hit_box_main)){
                updateHealth(-10)
                if (container.contains(fallingImage)) {
                    container.removeChild(fallingImage);
                }
            }

            if (isCollision(fallingImage, spaceship_hit_box_wing)){
                updateHealth(-5)
                if (container.contains(fallingImage)) {
                    container.removeChild(fallingImage);
                }
            }

            if (health <= 0){
                gameOver();
            }

            if (fallingImage.offsetTop >= containerHeight) {
                container.removeChild(fallingImage);
            }
        });

        requestAnimationFrame(checkCollisions);
    }

    function isCollision(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }

    function createEnemy(url) {
        const enemy = document.createElement('img');
        enemy.classList.add('enemy');
        enemy.src = url;
        let points = extractPoints(enemy.src);
        enemy.style.width = 90 - 2 * points + 'px';
        enemy.style.height = 90 - 2 * points + 'px';
        enemy.setAttribute('HealthPoints', (points / 2).toString());
        enemy.setAttribute('Points', points.toString());

        const container = document.getElementById('game-container');
        const randomX = Math.random() * (container.clientWidth - enemy.clientWidth);
        const randomY = -enemy.clientHeight;

        enemy.style.left = randomX + 'px';
        enemy.style.top = randomY + 'px';

        if(!dead){
            container.appendChild(enemy);
        }

        const fallAnimation = enemy.animate(
            [
                { top: randomY + 'px'},
                { top: container.clientHeight + 'px'}
            ],
            {
                duration: 9000 - points*100 - Math.min(5000, score),
                easing: 'linear'
            }
        );

        fallAnimation.onfinish = () => {
            if (container.contains(enemy)) {
                container.removeChild(enemy);
            }
        };
        return enemy;
    }

    checkCollisions();

    setInterval(() => {
        maxItems = Math.min(50, 10+score/100);
        if (document.querySelectorAll('.enemy').length < maxItems) {
            const randomImageUrl = pointsImages[Math.floor(Math.random() * pointsImages.length)];
            createEnemy(randomImageUrl);
        }
    }, 100);
}

function gameOver() {
    dead=true;
    document.getElementById("gameOver").style.display = "block";
    document.removeEventListener('mousemove', moveSpaceship);
    document.body.style.cursor = "default"

    const fallingImages = document.querySelectorAll('.enemy');
    const container = document.getElementById('game-container')

    fallingImages.forEach((fallingImage) => {
        if (container.contains(fallingImage)) {
            container.removeChild(fallingImage);
        }
    });
}

pregame();
