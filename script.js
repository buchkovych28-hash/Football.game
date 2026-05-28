const goalkeeper = document.getElementById('goalkeeper');
const ball = document.getElementById('ball');
const kicker = document.getElementById('kicker');
const message = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn'); 
const targets = document.querySelectorAll('.target');

const scorePsgEl = document.getElementById('score-psg');
const scoreArsenalEl = document.getElementById('score-arsenal');
const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');

let scorePSG = 0;
let scoreArsenal = 0;
let totalGoals = 0; 
let isPlaying = true; 
let currentPlayer = ''; 

const goalkeeperActions = ['up_left', 'up_right', 'down_left', 'down_right', 'up_center', 'down_center'];

// ФУНКЦІЯ СТАРТУ ГРИ
window.startGame = function(player) {
    currentPlayer = player;
    kicker.src = `${player}_stand.png`;
    startScreen.style.display = 'none'; 
    isPlaying = false; 
}

targets.forEach(target => {
    target.addEventListener('click', function() {
        if (isPlaying || totalGoals >= 3) return; 
        isPlaying = true; 

        const playerTarget = this.getAttribute('data-target');
        
        // Скрипт 100% голів
        const guaranteedMissActions = goalkeeperActions.filter(action => action !== playerTarget);
        const goalkeeperTarget = guaranteedMissActions[Math.floor(Math.random() * guaranteedMissActions.length)];

        // Анімація удару
        kicker.src = `${currentPlayer}_kick.png`;
        kicker.className = 'kicker-kick';

        let fixedImage = goalkeeperTarget;
        if (goalkeeperTarget === 'up_left') fixedImage = 'up_right';
        else if (goalkeeperTarget === 'up_right') fixedImage = 'up_left';
        else if (goalkeeperTarget === 'down_left') fixedImage = 'down_right';
        else if (goalkeeperTarget === 'down_right') fixedImage = 'down_left';

        // М'яч летить
        setTimeout(() => {
            ball.style.transform = `translate(${getBallX(playerTarget)}, ${getBallY(playerTarget)}) scale(0.3)`;
            ball.style.transition = 'all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }, 150);

        // Воротар стрибає
        setTimeout(() => {
            if (goalkeeperTarget === 'up_center') {
                goalkeeper.src = 'goalkeeper_up_center.png';
                goalkeeper.style.transform = `translateX(-50%) translateY(-20px) scale(1.05)`;
            } else if (goalkeeperTarget === 'down_center') {
                goalkeeper.src = 'goalkeeper_down_center.png';
                goalkeeper.style.transform = `translateX(-50%) translateY(30px) scale(1.05)`;
            } else {
                goalkeeper.src = `goalkeeper_dive_${fixedImage}.png`;
                goalkeeper.style.transform = `translate(calc(-50% + ${getGoalkeeperX(goalkeeperTarget)}), ${getGoalkeeperY(goalkeeperTarget)}) scale(1.05)`;
            }
        }, 50);

        // Фіксація голів та автоматичне повернення на позиції
        setTimeout(() => {
            totalGoals++;
            message.textContent = `ГОЛ! (${totalGoals}/3)`;
            message.style.color = "#13eac9";
            
            if (currentPlayer === 'dembele') {
                scorePSG++;
                scorePsgEl.textContent = scorePSG;
            } else {
                scoreArsenal++;
                scoreArsenalEl.textContent = scoreArsenal;
            }

            if (totalGoals >= 3) {
                setTimeout(() => {
                    endScreen.style.display = 'flex';
                }, 800); 
            } else {
                // ПОВЕРНЕННЯ НА ПОЗИЦІЮ ЧЕРЕЗ 0.9 СЕКУНД
                setTimeout(() => {
                    resetPositions();
                }, 900);
            }
        }, 600);
    });
});

function resetPositions() {
    message.textContent = "Оберіть ціль та бийте!";
    message.style.color = "#13eac9";
    
    kicker.src = `${currentPlayer}_stand.png`;
    kicker.className = 'kicker-stand';
    
    ball.style.transform = 'translateX(-50%)';
    ball.style.transition = 'none';
    
    goalkeeper.src = 'goalkeeper_center.png';
    goalkeeper.style.transform = 'translateX(-50%)';
    
    isPlaying = false;
}

// Координати механіки
function getBallX(t) { 
    if (t === 'up_right') return '250px';
    if (t === 'up_left') return '-320px';
    if (t === 'down_right') return '240px';
    if (t === 'down_left') return '-330px';
    if (t === 'up_center') return '-40px';   
    if (t === 'down_center') return '-40px'; 
    return '0px'; 
}

function getBallY(t) { 
    if (t === 'up_right') return '-350px';
    if (t === 'up_left') return '-340px';
    if (t === 'down_right') return '-190px';
    if (t === 'down_left') return '-195px';
    if (t === 'up_center') return '-330px';  
    if (t === 'down_center') return '-195px'; 
    return '0px'; 
}

function getGoalkeeperX(t) { return t.includes('left') ? '-200px' : '200px'; }
function getGoalkeeperY(t) { return t.includes('up') ? '-50px' : '20px'; }


// --- СКРИПТ АВТОМАТИЧНОЇ МОБІЛЬНОЇ АДАПТАЦІЇ (ДЛЯ IPHONE ТА ANDROID) ---
function resizeGame() {
    const container = document.querySelector('.game-container');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Розрахунок під ширину та висоту екрану телефону
    let scale = windowWidth / 1024;
    if ((572 * scale) > windowHeight) {
        scale = windowHeight / 572;
    }
    
    // Застосування пропорційного стискання
    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = 'center center';
}

window.addEventListener('resize', resizeGame);
window.addEventListener('load', resizeGame);
resizeGame();