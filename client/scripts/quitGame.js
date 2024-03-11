import displayMainPage from "./displayMainPage";

export default function quitGame() {
    console.log("hello")
    const popupContainer = document.querySelector('.popup_container');

    const quitBtn = document.createElement('button');
    quitBtn.classList.add('quit_button');
    quitBtn.innerText = 'Quit';

    quitBtn.addEventListener('click', displayMainPage);

    popupContainer.appendChild(quitBtn);
}