export default function displayNewGame(
  socket,
  room,
  beforeGameContainer,
  timerContainer
) {
  const gridContainer = document.querySelector('.grid_container');
  if (gridContainer) {
    gridContainer.remove();
  }
  timerContainer.remove();

  const waiting = document.querySelector('.waiting_span');
  if (!waiting) {
    const waitingSpan = document.createElement('span');
    waitingSpan.innerText = 'Waiting for 2-4 players to connect...';
    waitingSpan.classList.add('waiting_span');
    beforeGameContainer.appendChild(waitingSpan);
  }

  //Listen to if theres 2-4 players in room
  socket.emit('start over', room);
  socket.on('start over', () => {
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
      waitingSpan.innerText = 'Waiting for 2-4 players to connect...';
      waitingSpan.classList.add('waiting_span');

      beforeGameContainer.appendChild(waitingSpan);
    });
  });
}
