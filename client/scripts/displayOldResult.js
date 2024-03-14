import closePopup from './lib/closePopup.mjs';
import displayResultMessage from './displayResultMessage.js';
import calculateOldResult from './lib/calculateOldResult.js';

export default function displayOldResult(gameResult) {
  const popupBackground = document.createElement('div');
  popupBackground.classList.add('popup_background');
  const popup = document.createElement('div');
  popup.classList.add('popup_container');
  popup.classList.add('old_results_popup');

  const oldGameHeader = document.createElement('h2');
  oldGameHeader.classList.add('old_game_header');
  oldGameHeader.innerText = 'Game results';

  const gridDiv = displayResultMessage(gameResult);
  const resultObject = calculateOldResult(gameResult);

  function sortScore(resultObject) {
    const scoreArray = Object.entries(resultObject);

    scoreArray.sort((a, b) => b[1] - a[1]);

    const sortedScores = scoreArray.map(([color, score]) => ({
      color,
      score,
    }));

    const winningColor = document.createElement('h3');
    winningColor.classList.add('winning_player');
    const winningColorSpan = document.createElement('span');
    const winningTextColor = sortedScores[0].color;
    winningColorSpan.innerText = sortedScores[0].color;
    winningColorSpan.classList.add(`winning_span_${winningTextColor}`);
    winningColor.innerText = 'The winner was ';
    winningColor.append(winningColorSpan, '!');

    popup.appendChild(winningColor);

    const resultList = document.createElement('ul');
    resultList.classList.add('old_result_list');

    sortedScores.forEach((score) => {
      const resultListItem = document.createElement('li');
      resultListItem.classList.add('old_result_list_item');
      resultListItem.innerText = score.color + ': ' + score.score;
      resultList.appendChild(resultListItem);
      popup.append(resultList);
    });
  }

  sortScore(resultObject);

  popup.append(oldGameHeader, gridDiv);

  const closePopupBtn = document.createElement('button');
  closePopupBtn.innerText = 'Close';
  closePopupBtn.classList.add('close_popup_btn');
  closePopupBtn.addEventListener('click', () => {
    closePopup(popupBackground);
  });

  popup.appendChild(closePopupBtn);
  popupBackground.appendChild(popup);
  document.body.appendChild(popupBackground);
}
