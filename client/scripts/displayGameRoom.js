import displayMainPage from './displayMainPage.js';
import updateChat from './updateChat.js';
import sendChat from './sendChat.js';
import createGameGrid from './displayGameGrid.js';
import updatePlayers from './updatePlayers.js';
import { socket } from '../main.js';
import printStart from './displayStartPage.js';
import createPopup from './lib/createPopup.mjs';
import updateRoomList from './updateRoomList.js';

export default function displayChatRoom(room) {
  document.body.innerHTML = '';

  const chatPage = document.createElement('div');
  chatPage.classList.add('chat_page');

  // create nav element
  const navBar = document.createElement('nav');
  navBar.classList.add('nav_bar');

  const title = document.createElement('h2');
  title.innerText = 'Color Chaos';

  const roomName = document.createElement('h3');
  roomName.innerText = room.name;

  const leaveRoomBtn = document.createElement('button');
  leaveRoomBtn.classList.add('leave_room_btn');
  leaveRoomBtn.innerText = 'Leave Room';
  leaveRoomBtn.addEventListener('click', () => {
    console.log(room.roomId);
    socket.emit(
      'leave room',
      room,
      localStorage.getItem('user'),
      sessionStorage.getItem('color')
    );
    updatePlayers(room.roomId);
    socket.removeAllListeners();
    displayMainPage();
    /*     socket.on('room list', updateRoomList); */
    sessionStorage.removeItem('color');
  });

  /*   // When a user leaves the page, emit event and update player list
  window.addEventListener('beforeunload', () => {
    socket.emit('leave room', room, localStorage.getItem('user'), sessionStorage.getItem('color'));
    updatePlayers(room);
  }); */

  const logoutBtn = document.createElement('button');
  logoutBtn.innerText = 'Log out';
  logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    sessionStorage.clear();
    printStart();
  });

  const topBtnsContainer = document.createElement('div');
  topBtnsContainer.classList.add('top_btns_container');
  topBtnsContainer.append(leaveRoomBtn, logoutBtn);

  const stickyContainer = document.createElement('div');
  stickyContainer.classList.add('sticky_container');
  stickyContainer.appendChild(topBtnsContainer);

  document.body.append(stickyContainer);
  navBar.append(title, roomName);

  const gameContainer = document.createElement('div');
  gameContainer.classList.add('game_container');

  // create game grid container
  const gridContainer = document.createElement('div');
  gridContainer.classList.add('grid_container');

  const beforeGameContainer = document.createElement('div');
  beforeGameContainer.classList.add('before_game_container');

  const startGameBtn = document.createElement('button');
  startGameBtn.id = 'startGameBtn';
  startGameBtn.innerText = 'Start Game';

  startGameBtn.addEventListener('click', () => {
    socket.emit('startCountdown', room);
  });

  socket.on('countdown', (countdown) => {
    beforeGameContainer.innerHTML = '';
    const countdownText = document.createElement('span');
    countdownText.classList.add('countdown_span');
    beforeGameContainer.appendChild(countdownText);
    countdownText.innerText = `Get ready, game starts in... ${countdown}`;
  });

  beforeGameContainer.append(startGameBtn);
  gameContainer.append(gridContainer, beforeGameContainer);

  // create container for messages
  const chatMainSection = document.createElement('div');
  chatMainSection.classList.add('chat_main_section');

  const sendMessageContainer = document.createElement('div');
  sendMessageContainer.classList.add('send_message_container');

  const inputLabel = document.createElement('label');
  inputLabel.innerText = 'Message:';

  const inputMessage = document.createElement('input');
  inputMessage.classList.add('input_message');
  inputMessage.type = 'text';
  inputMessage.id = 'inputMessage';

  const sendMessageBtn = document.createElement('button');
  sendMessageBtn.classList.add('send_message_button');
  sendMessageBtn.id = 'sendMessageBtn';
  sendMessageBtn.innerText = 'SEND';
  sendMessageBtn.addEventListener('click', () => {
    sendChat(inputMessage, room);
    inputMessage.value = '';
  });

  sendMessageContainer.append(inputLabel, inputMessage, sendMessageBtn);

  // create chat box
  const chatBox = document.createElement('div');
  chatBox.classList.add('chat_box');

  const chatList = document.createElement('ul');
  chatList.id = 'chatList';

  // Updates the player list displayed in the UI based on the received roomConnectedUsers object.
  updatePlayers(room.roomId);

  chatBox.appendChild(chatList);

  // add all elements to chatPage
  chatMainSection.append(sendMessageContainer, chatBox);
  chatPage.append(navBar, gameContainer, chatMainSection);

  let gameTimer;
  let remainingTime;
  //Listen to timeinfo from server
  socket.on('gameDuration', (duration) => {
    remainingTime = duration;
    startTimer();
  });

  //Start timer client side
  function startTimer() {
    gameTimer = setInterval(() => {
      remainingTime -= 1000;
      console.log('game timer', remainingTime);
      if (remainingTime <= 0) {
        clearInterval(gameTimer);
        //Tell server time is up?
        socket.emit('endGame', room);
      }
    }, 1000);
  }

  //Listen to when game ends from server
  socket.on('gameEnd', () => {
    //Additional functions...score, save board etc
    clearInterval(gameTimer);
    createPopup('Times up!');
  });

  socket.on('chat', (arg) => {
    updateChat(arg);
  });

  //Listen to when game starts from server
  socket.on('gameStart', () => {
    //display game grid
    createGameGrid(gridContainer, room.roomId, beforeGameContainer);
  });

  document.body.appendChild(chatPage);
}
