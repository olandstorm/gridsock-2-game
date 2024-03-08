import displayMainPage from './displayMainPage';
import displayNewUser from './displayNewUser.js';
import createPopup from './lib/createPopup.mjs';
import loginUser from './loginUser.js';

export default function printStart() {
  document.body.innerHTML = '';

  // create main container
  const mainContainer = document.createElement('div');
  mainContainer.classList.add('main_container');

  const logoBigImg = document.createElement('img');
  logoBigImg.src = 'assets/img/colorchaos_logo.webp';
  logoBigImg.alt = 'Logotype for Color Chaos';
  logoBigImg.classList.add('logo_img_big');

  const loginContainer = document.createElement('div');
  loginContainer.classList.add('login_container');

  const emailLabel = document.createElement('label');
  emailLabel.classList.add('email_label');

  const emailSpan = document.createElement('span');
  emailSpan.classList.add('email_span');
  emailSpan.innerText = 'Email:';

  const emailInput = document.createElement('input');
  emailInput.type = 'text';
  emailInput.classList.add('user_email_input');
  emailInput.id = 'userEmailInput';
  emailInput.placeholder = 'Email';

  emailLabel.append(emailSpan, emailInput);

  const passwordLabel = document.createElement('label');
  passwordLabel.classList.add('name_label');

  const passwordSpan = document.createElement('span');
  passwordSpan.classList.add('name_span');
  passwordSpan.innerText = 'Password:';

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.classList.add('user_password_input');
  passwordInput.id = 'userPasswordInput';
  passwordInput.placeholder = 'Password';

  passwordLabel.append(passwordSpan, passwordInput);

  const enterBtn = document.createElement('button');
  enterBtn.innerText = 'Enter';
  enterBtn.classList.add('enter_btn');
  enterBtn.id = 'saveUser';

  enterBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      createPopup('Please fill in both email and password fields');
      return;
    } else {
      loginUser(email, password);
    }
  });

  const newUserBtn = document.createElement('button');
  newUserBtn.innerText = 'Create a new user';
  newUserBtn.classList.add('new_user_btn');
  newUserBtn.id = 'newUser';

  newUserBtn.addEventListener('click', () => {
    displayNewUser(loginContainer);
  });

  loginContainer.append(emailLabel, passwordLabel, enterBtn, newUserBtn);

  mainContainer.append(logoBigImg, loginContainer);

  // add mainContainer to body
  document.body.append(mainContainer);
}
