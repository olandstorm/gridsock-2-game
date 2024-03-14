import closePopup from './closePopup.mjs';

export default function createPopup(text, popupClass,) {
  const popupBackground = document.createElement('div');
  popupBackground.classList.add('popup_background');
  const popup = document.createElement('div');
  popup.classList.add('popup_container');
  popup.classList.add(popupClass);
  const popupText = document.createElement('span');
  popupText.classList.add('popup_text');
  popupText.innerText = text;

  popup.appendChild(popupText);

  const closePopupBtn = document.createElement('button');
  closePopupBtn.innerText = 'Close';
  closePopupBtn.classList.add('close_popup_btn');
  closePopupBtn.addEventListener('click', () => {
    closePopup(popupBackground);
  });

  popup.appendChild(closePopupBtn);
  popupBackground.appendChild(popup);
  document.body.appendChild(popupBackground);
  closePopupBtn.focus();

  return popupBackground;
}
