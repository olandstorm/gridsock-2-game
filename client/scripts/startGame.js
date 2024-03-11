let gameTimer;
let remainingTime;

const startGameBtn = document.createElement('button');
startGameBtn.id = 'startGameBtn';
startGameBtn.innerText = 'Start Game';

startGameBtn.addEventListener('click', () => {
    Socket.emit('startGame');    
})

//container.appendChild(startGameBtn);

//Listen to when game starts from server
socket.on('gameStart', () => {
    //hide or empty container
});


//Listen to timeinfo from server
socket.on('gameDuration', (duration) => {
    remainingTime = duration;
    startTimer();
});

//Start timer client side
function startTimer() {
    gameTimer = setInterval(() => {
        remainingTime -= 1000;
        if (!remainingTime <= 0) {
            clearInterval(gameTimer);
            //Tell server time is up?
        }
    }, 1000);
}

//Listen to when game ends from server
socket.on('gameEnd', () => {

    //Additional functions for msg game end...score? etc
    clearInterval(gameTimer);
});