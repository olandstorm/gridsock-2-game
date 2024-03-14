import closePopup from './lib/closePopup.mjs';

export default function endGame(
  socket,
  room,
  gameIdScore,
  gameContainer,
  timerContainer,
  beforeGameContainer
) {
  const popupBackground = document.createElement('div');
  popupBackground.classList.add('popup_background');
  const popup = document.createElement('div');
  popup.classList.add('popup_container');
  popup.classList.add('result_popup');

  const resultHeader = document.createElement('span');
  resultHeader.classList.add('result_header');
  resultHeader.innerText = 'Here is the result:';

  const resultList = document.createElement('ul');
  resultList.classList.add('result_list');

  const scoreObject = gameIdScore.score;

  function sortScore(scoreObject) {
    const scoreArray = Object.entries(scoreObject);

    scoreArray.sort((a, b) => b[1] - a[1]);

    const sortedScores = scoreArray.map(([player, score]) => ({
      player,
      score,
    }));

    const winningPlayer = document.createElement('h3');
    winningPlayer.classList.add('winning_player');
    winningPlayer.innerText = 'The winner is ' + sortedScores[0].player + '!!!';

    popup.appendChild(winningPlayer);

    sortedScores.forEach((score) => {
      const resultListItem = document.createElement('li');
      resultListItem.classList.add('result_list_item');
      resultListItem.innerText = score.player + ': ' + score.score;
      resultList.appendChild(resultListItem);
    });
  }

  sortScore(scoreObject);

  popup.append(resultHeader, resultList);

  const closePopupBtn = document.createElement('button');
  closePopupBtn.innerText = 'Close';
  closePopupBtn.classList.add('close_popup_btn');
  closePopupBtn.addEventListener('click', () => {
    closePopup(popupBackground);
  });

  popup.appendChild(closePopupBtn);
  popupBackground.appendChild(popup);
  document.body.appendChild(popupBackground);

  const gridContainer = document.querySelector('.grid_container');
  gridContainer.remove();
  timerContainer.remove();

  const waitingSpan = document.createElement('span');
  waitingSpan.innerText = 'Waiting for 2-4 players to connect...';
  waitingSpan.classList.add('waiting_span');

  beforeGameContainer.appendChild(waitingSpan);

  //Listen to if theres 2-4 players in room
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
      waitingSpan.innerText = 'Waiting for 2-4 players to connect...';
      waitingSpan.classList.add('waiting_span');

      beforeGameContainer.appendChild(waitingSpan);
    });
  });

  gameContainer.appendChild(beforeGameContainer);
}
