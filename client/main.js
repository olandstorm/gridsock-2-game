import './style.scss';
import { io } from 'socket.io-client';
import printStart from './scripts/displayStartPage.js';
import displayMainPage from './scripts/displayMainPage';

export const API_URL =
  'https://lionfish-app-dp3is.ondigitalocean.app/' || 'http://localhost:3000/';
export const socket = io(API_URL);

// User state check
if (localStorage.getItem('user')) {
  displayMainPage();
} else {
  printStart();
}
