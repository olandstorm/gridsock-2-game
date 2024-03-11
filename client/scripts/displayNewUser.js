import printStart from './displayStartPage.js';
import saveNewUser from './saveNewUser.js';
import createPopup from './lib/createPopup.mjs';

export default function displayNewUser(loginContainer) {
  loginContainer.innerHTML = '';
  const newUserHeader = document.createElement('h2');
  newUserHeader.classList.add('new_user_header');
  newUserHeader.innerText = 'Create a new user';

  const nameLabel = document.createElement('label');
  nameLabel.classList.add('login_label');

  const nameSpan = document.createElement('span');
  nameSpan.classList.add('login_label_span');
  nameSpan.innerText = 'Name:';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.classList.add('user_name_input');
  nameInput.id = 'userNameInput';
  nameInput.placeholder = 'Name';

  nameLabel.append(nameSpan, nameInput);

  const emailLabel = document.createElement('label');
  emailLabel.classList.add('login_label');

  const emailSpan = document.createElement('span');
  emailSpan.classList.add('login_label_span');
  emailSpan.innerText = 'Email:';

  const emailInput = document.createElement('input');
  emailInput.type = 'text';
  emailInput.classList.add('user_email_input');
  emailInput.id = 'userEmailInput';
  emailInput.placeholder = 'Email';

  emailLabel.append(emailSpan, emailInput);

  const passwordLabel = document.createElement('label');
  passwordLabel.classList.add('login_label');

  const passwordSpan = document.createElement('span');
  passwordSpan.classList.add('login_label_span');
  passwordSpan.innerText = 'Password:';

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.classList.add('user_password_input');
  passwordInput.id = 'userPasswordInput';
  passwordInput.placeholder = 'Password';

  passwordLabel.append(passwordSpan, passwordInput);

  const saveNewUserBtn = document.createElement('button');
  saveNewUserBtn.innerText = 'Create user and login';
  saveNewUserBtn.classList.add('create_enter_btn');
  saveNewUserBtn.id = 'saveUserBtn';

  saveNewUserBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const name = nameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password || !name) {
      createPopup('Please fill in all fields');
      return;
    } else {
      saveNewUser(name, email, password);
    }
  });

  const backToLogin = document.createElement('button');
  backToLogin.innerText = 'Back to login';
  backToLogin.classList.add('back_to_login_btn');
  backToLogin.id = 'backToLoginBtn';

  backToLogin.addEventListener('click', () => {
    printStart();
  });

  loginContainer.append(
    newUserHeader,
    nameLabel,
    emailLabel,
    passwordLabel,
    saveNewUserBtn,
    backToLogin
  );
}
