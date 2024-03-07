import closePopup from './closePopup.mjs';

export default function createPopup(text, popupClass, btn, btnClass, btnClick) {
  const popupBackground = document.createElement('div');
  popupBackground.classList.add('popup_background');
  const popup = document.createElement('div');
  popup.classList.add('popup_container');
  popup.classList.add(popupClass);
  const popupText = document.createElement('span');
  popupText.classList.add('popup_text');
  popupText.innerText = text;

  popup.appendChild(popupText);

  if (btn && btnClass && btnClick) {
    const popupBtn = document.createElement('button');
    popupBtn.innerText = btn;
    popupBtn.classList.add(btnClass);
    popupBtn.addEventListener('click', () => {
      btnClick();
      closePopup(popupBackground);
    });
    popup.appendChild(popupBtn);
  }

  const closePopupBtn = document.createElement('button');
  closePopupBtn.innerText = 'Close';
  closePopupBtn.classList.add('close_popup_btn');
  closePopupBtn.addEventListener('click', () => {
    closePopup(popupBackground);
  });

  popup.appendChild(closePopupBtn);
  popupBackground.appendChild(popup);
  document.body.appendChild(popupBackground);

  return popupBackground;
}
