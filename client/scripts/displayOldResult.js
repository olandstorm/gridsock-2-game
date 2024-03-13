import closePopup from './lib/closePopup.mjs';
import displayResultMessage from './displayResultMessage.js';

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
