import displayMainPage from './displayMainPage.js';
import updateChat from './updateChat.js';
import sendChat from './sendChat.js';
import createGameGrid from './displayGameGrid.js';
import updatePlayers from './updatePlayers.js';
import { socket } from '../main.js';
import printStart from './displayStartPage.js';
import createPopup from './lib/createPopup.mjs';
import endGame from './endGame.js';

export default function displayChatRoom(room) {
  document.body.innerHTML = '';

  const chatPage = document.createElement('div');
  chatPage.classList.add('chat_page');

  // create nav element
  const navBar = document.createElement('nav');
  navBar.classList.add('nav_bar');

  const logoSmallImg = document.createElement('img');
  logoSmallImg.src = '/img/colorchaos_logo_small.webp';
  logoSmallImg.alt = 'Logotype for Color Chaos';
  logoSmallImg.classList.add('logo_img_small');

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

  // When a user leaves the page, emit event and update player list
  window.addEventListener('beforeunload', () => {
    socket.emit(
      'leave room',
      room,
      localStorage.getItem('user'),
      sessionStorage.getItem('color')
    );
    updatePlayers(room);
  });

  const topBtnsContainer = document.createElement('div');
  topBtnsContainer.classList.add('top_btns_container');
  topBtnsContainer.append(leaveRoomBtn);

  const stickyContainer = document.createElement('div');
  stickyContainer.classList.add('sticky_container');
  stickyContainer.appendChild(topBtnsContainer);

  document.body.append(stickyContainer, logoSmallImg);
  navBar.appendChild(roomName);

  const mainContentContainer = document.createElement('div');
  mainContentContainer.classList.add('main_content_container');

  const gameContainer = document.createElement('div');
  gameContainer.classList.add('game_container');

  const beforeGameContainer = document.createElement('div');
  beforeGameContainer.classList.add('before_game_container');

  const waitingSpan = document.createElement('span');
  waitingSpan.innerText = 'Waiting for 4 players to connect...';
  waitingSpan.classList.add('waiting_span');

  beforeGameContainer.appendChild(waitingSpan);

  const timerContainer = document.createElement('div');
  timerContainer.classList.add('timer_container');
  const timerDisplay = document.createElement('span');
  timerDisplay.classList.add('timer_span');

  timerContainer.appendChild(timerDisplay);

  const playersListContainer = document.createElement('div');
  playersListContainer.classList.add('players_list_container');

  const subTextContainer = document.createElement('div');
  subTextContainer.classList.add('sub_text_container');
  const subTextSpan = document.createElement('span');
  subTextSpan.classList.add('sub_text_span');
  const shortInstruction = document.createElement('span');
  shortInstruction.classList.add('short_instruction_span');
  shortInstruction.innerText = 'Collect as many squares as you can!';

  subTextContainer.append(subTextSpan, shortInstruction);

  //Listen to if theres 4 players in room
  socket.on('enable start', () => {
    beforeGameContainer.innerHTML = '';
    const startGameBtn = document.createElement('button');
    startGameBtn.id = 'startGameBtn';
    startGameBtn.innerText = 'Start Game';

    startGameBtn.addEventListener('click', () => {
      socket.emit('startCountdown', room);
      socket.off('enable start');
    });
    beforeGameContainer.append(startGameBtn);
  });

  //If someone leaves
  socket.on('player left', () => {
    beforeGameContainer.innerHTML = '';
    const waitingSpan = document.createElement('span');
    waitingSpan.innerText = 'Waiting for 4 players to connect...';
    waitingSpan.classList.add('waiting_span');

    beforeGameContainer.appendChild(waitingSpan);
  });

  socket.on('countdown', (countdown) => {
    beforeGameContainer.innerHTML = '';
    const countdownText = document.createElement('span');
    countdownText.classList.add('countdown_span');
    beforeGameContainer.appendChild(countdownText);
    countdownText.innerText = `Get ready, game starts in... ${countdown}`;
  });

  gameContainer.append(
    playersListContainer,
    beforeGameContainer,
    subTextContainer
  );

  // create container for messages
  const chatMainSection = document.createElement('div');
  chatMainSection.classList.add('chat_main_section');

  const sendMessageContainer = document.createElement('div');
  sendMessageContainer.classList.add('send_message_container');

  const inputLabel = document.createElement('label');
  inputLabel.classList.add('message_label');

  const inputSpan = document.createElement('span');
  inputSpan.classList.add('input_span');
  inputSpan.innerText = 'Message:';

  const inputMessage = document.createElement('input');
  inputMessage.classList.add('input_message');
  inputMessage.type = 'text';
  inputMessage.id = 'inputMessage';

  inputLabel.append(inputSpan, inputMessage);

  const sendMessageBtn = document.createElement('button');
  sendMessageBtn.classList.add('send_message_button');
  sendMessageBtn.id = 'sendMessageBtn';
  sendMessageBtn.innerText = 'SEND';
  sendMessageBtn.addEventListener('click', () => {
    const writtenMessage = inputMessage.value;
    if (writtenMessage) {
      sendChat(writtenMessage, room);
      inputMessage.value = '';
    }
  });

  sendMessageContainer.append(inputLabel, sendMessageBtn);

  // create chat box
  const chatBox = document.createElement('div');
  chatBox.classList.add('chat_box');

  const chatList = document.createElement('ul');
  chatList.classList.add('chat_list');
  chatList.id = 'chatList';

  // Updates the player list displayed in the UI based on the received roomConnectedUsers object.
  updatePlayers(room.roomId);

  chatBox.appendChild(chatList);

  // add all elements to chatPage
  chatMainSection.append(chatBox, sendMessageContainer);
  mainContentContainer.append(gameContainer, chatMainSection);
  chatPage.append(navBar, mainContentContainer);

  let gameTimer = {
    intervalId: null,
    seconds: 0,
    minutes: 0,
  };

  //Listen to timeinfo from server
  socket.on('gameDuration', (duration) => {
    console.log('gameDuration', duration);

    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    gameTimer.minutes = minutes;
    gameTimer.seconds = remainingSeconds;
    startTimer(gameTimer);
  });

  //Start timer client side
  function startTimer(timer) {
    updateTimer(timer);
    gameTimer.intervalId = setInterval(() => {
      if (timer.seconds === 0) {
        if (timer.minutes === 0) {
          clearInterval(gameTimer.intervalId);
          //Tell server time is up?
          socket.emit('endGame', room);
        } else {
          timer.seconds = 59;
          timer.minutes -= 1;
        }
      } else {
        timer.seconds -= 1;
      }
      updateTimer(timer);
    }, 1000);
  }

  function updateTimer(timer) {
    if (timerDisplay === null) {
      return;
    }
    timerDisplay.innerText = `${formatTime(timer.minutes)}:${formatTime(
      timer.seconds
    )}`;
  }

  //Listen to when game ends from server
  socket.on('gameEnd', (gameIdScore) => {
    stopTimer(gameTimer);
    endGame(
      socket,
      room,
      gameIdScore,
      gameContainer,
      timerContainer,
      beforeGameContainer
    );
  });

  function stopTimer(timer) {
    if (timer.intervalId === null) {
      return;
    }
    clearInterval(timer.intervalId);
    timer.intervalId = null;
  }

  function formatTime(time) {
    return time < 10 ? `0${time}` : `${time}`;
  }

  socket.on('chat', (arg) => {
    updateChat(arg, chatBox);
  });

  //Listen to when game starts from server
  socket.on('gameStart', () => {
    //display game grid
    createGameGrid(
      gameContainer,
      room.roomId,
      beforeGameContainer,
      timerContainer
    );
  });

  document.body.appendChild(chatPage);
}
