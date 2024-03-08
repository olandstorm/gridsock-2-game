import displayMainPage from './displayMainPage';

export default function printStart() {
  document.body.innerHTML = '';

  // create main container
  const mainContainer = document.createElement('div');
  mainContainer.classList.add('main_container');

  const logoBigImg = document.createElement('img');
  logoBigImg.src = 'assets/img/colorchaos_logo.webp';
  logoBigImg.alt = 'Logotype for Color Chaos';
  logoBigImg.classList.add('logo_img_big');

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

  mainContainer.append(logoBigImg, nameContainer);

  // add mainContainer to body
  document.body.append(mainContainer);
}