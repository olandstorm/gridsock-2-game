import displayMainPage from "./displayMainPage";

export default function printStart() {
  const body = document.body;

  body.innerHTML = '';

  const logoBigImg = document.createElement('img');
  /* logoImg.src = ''; */
  logoBigImg.alt = 'Logotype for FriendHUB';

  const nameContainer = document.createElement('div');
  nameContainer.classList.add('name_container');

  const nameLabel = document.createElement('label');
  nameLabel.classList.add('name_label');

  const nameSpan = document.createElement('span');
  nameSpan.classList.add('name_span');

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.classList.add('user_name_input');
  nameInput.id = 'userName';
  nameInput.placeholder = 'Name';

  nameLabel.append(nameSpan, nameInput);

  const enterBtn = document.createElement('button');
  enterBtn.innerText = 'Enter';
  enterBtn.classList.add('enter_btn');
  enterBtn.id = 'saveUser';

  enterBtn.addEventListener('click', () => {
    let userName = nameInput.value;
    sessionStorage.setItem('user', userName);
    nameInput.value = '';
    displayMainPage();
  });

  nameContainer.append(nameLabel, enterBtn);

  body.append(logoBigImg, nameContainer);
}
