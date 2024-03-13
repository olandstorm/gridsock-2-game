import createPopup from './lib/createPopup.mjs';

export default function endGame(
  socket,
  room,
  gameContainer,
  timerContainer,
  beforeGameContainer
) {
  createPopup('Times up!');
  const gridContainer = document.querySelector('.grid_container');
  gridContainer.remove();
  timerContainer.remove();

  const waitingSpan = document.createElement('span');
  waitingSpan.innerText = 'Waiting for 4 players to connect...';
  waitingSpan.classList.add('waiting_span');

  beforeGameContainer.appendChild(waitingSpan);

  //Listen to if theres 4 players in room
  socket.emit('start over', room);
  socket.on('start over', () => {
    console.log('start over is ok');
    beforeGameContainer.innerHTML = '';
    const startGameBtn = document.createElement('button');
    startGameBtn.innerText = 'Play again';

    startGameBtn.addEventListener('click', () => {
      socket.emit('startCountdown', room);
    });
    beforeGameContainer.append(startGameBtn);
    //If someone leaves
    socket.on('player left', () => {
      beforeGameContainer.innerHTML = '';
      const waitingSpan = document.createElement('span');
      waitingSpan.innerText = 'Waiting for 4 players to connect...';
      waitingSpan.classList.add('waiting_span');

      beforeGameContainer.appendChild(waitingSpan);
    });
  });

  gameContainer.appendChild(beforeGameContainer);
}
