import closePopup from './lib/closePopup.mjs';
import displayNewGame from './displayNewGame.js';

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

  displayNewGame(socket, room, beforeGameContainer, timerContainer);

  gameContainer.appendChild(beforeGameContainer);
}
