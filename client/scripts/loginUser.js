import { API_URL } from '../main.js';
import displayMainPage from './displayMainPage.js';
import createPopup from './lib/createPopup.mjs';

export default function loginUser(email, password) {
  fetch(API_URL + 'users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email, password: password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.name && data.UUID) {
        localStorage.setItem('user', data.name);
        localStorage.setItem('userId', data.UUID);
        displayMainPage();
      } else {
        createPopup(data.message);
      }
    });
}
