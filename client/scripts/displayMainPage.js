import { socket } from '../main.js';
import updateRoomList from './updateRoomList';
import displayChatRoom from './displayGameRoom.js';
import closePopup from './lib/closePopup.mjs';
import printStart from './displayStartPage.js';
import updateColor from './lib/updateColorInfo.js';

let currentColor = null;

export default function displayMainPage() {
  document.body.innerHTML = '';

  const mainContainer = document.createElement('div');
  mainContainer.classList.add('main_container');

  // create logo
  const logoBigImg = document.createElement('img');
  logoBigImg.src = '/img/colorchaos_logo.webp';
  logoBigImg.alt = 'Logotype for Color Chaos';
  logoBigImg.classList.add('logo_img_big');

  const enterRoomInstruction = document.createElement('span');
  enterRoomInstruction.innerText = 'Enter a room';

  // create container for rooms and create new room
  const roomsContainer = document.createElement('div');
  roomsContainer.classList.add('rooms_container');

  const createRoomSection = document.createElement('div');
  createRoomSection.classList.add('create_room_section');

  const createRoomText = document.createElement('span');
  createRoomText.classList.add('create_room_text');
  createRoomText.innerText = 'Or create a new room';

  const inputRoomName = document.createElement('input');
  inputRoomName.type = 'text';
  inputRoomName.classList.add('input_room_name');
  inputRoomName.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const roomName = inputRoomName.value;
      if (roomName) {
        socket.emit('create room', roomName);
        socket.once('room object', (room) => {
          const userName = localStorage.getItem('user');
          const uuid = localStorage.getItem('userId');
          socket.emit('join room', room, userName, uuid);
          displayChatRoom(room);
        });
      }
      inputRoomName.value = '';
    }
  });

  const instructionBtn = document.createElement('button');
  instructionBtn.innerText = 'How to play';
  instructionBtn.addEventListener('click', () => {
    const popupBackground = document.createElement('div');
    popupBackground.classList.add('popup_background');
    const popup = document.createElement('div');
    popup.classList.add('popup_container');
    popup.classList.add('instruction_popup');

    const instructionHeader = document.createElement('h2');
    instructionHeader.innerText = 'Instructions';

    popup.append(instructionHeader);

    const popupText = document.createElement('span');
    popupText.classList.add('popup_text');

    const instructions = `Dive into the vibrant world of Color Chaos, where randomness adds to the fun! 
    Embrace the unpredictability as you leap into the colorful grid, each player assigned a unique hue - pink, blue, green, or yellow. 
    Click away with gusto, covering squares in your signature shade. 
    But don't forget the strategy - stealing squares from your pals is all part of the game! 
    Can you outwit your buddies and claim the coveted title of color champion? 
    Let loose, laugh it up, and let the chaos ensue!`;

    const rows = instructions.split('\n');

    rows.forEach((row) => {
      const span = document.createElement('span');
      span.innerText = row.trim();

      popupText.appendChild(span);
    });

    popup.appendChild(popupText);

    const closePopupBtn = document.createElement('button');
    closePopupBtn.innerText = 'Close';
    closePopupBtn.classList.add('close_popup_btn');
    closePopupBtn.addEventListener('click', () => {
      closePopup(popupBackground);
    });

    popup.appendChild(closePopupBtn);
    popupBackground.appendChild(popup);
    document.body.appendChild(popupBackground);
  });

  const logoutBtn = document.createElement('button');
  logoutBtn.innerText = 'Log out';
  logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    sessionStorage.clear();
    printStart();
  });

  const topBtnsContainer = document.createElement('div');
  topBtnsContainer.classList.add('top_btns_container');
  topBtnsContainer.append(instructionBtn, logoutBtn);

  const stickyContainer = document.createElement('div');
  stickyContainer.classList.add('sticky_container');
  stickyContainer.appendChild(topBtnsContainer);

  const createRoomBtn = document.createElement('button');
  createRoomBtn.classList.add('create_room_btn');
  createRoomBtn.innerText = 'Create and Enter';
  createRoomBtn.addEventListener('click', () => {
    const roomName = inputRoomName.value;
    if (roomName) {
      socket.emit('create room', roomName);
      socket.once('room object', (room) => {
        const userName = localStorage.getItem('user');
        const uuid = localStorage.getItem('userId');
        socket.emit('join room', room, userName, uuid);
        displayChatRoom(room);
      });
    }
  });

  socket.on('room joined', (data) => {
    currentColor = data.color;
    sessionStorage.setItem('color', data.color);
    updateColor(currentColor);
  });

  // add all element to mainContainer
  createRoomSection.append(createRoomText, inputRoomName, createRoomBtn);
  mainContainer.append(
    logoBigImg,
    enterRoomInstruction,
    roomsContainer,
    createRoomSection
  );

  document.body.append(stickyContainer, mainContainer);

  // Request room list initially and update UI
  socket.emit('get rooms');
  socket.on('room list', updateRoomList);

  socket.on('room full', (roomId) => {
    const fullRoom = document.querySelector(`#room_btn_${roomId}`);
    if (fullRoom) {
      fullRoom.disabled = true;
      fullRoom.innerText += ' (FULL)';
    }
  });

  socket.on('game on', (roomId) => {
    const playingRoom = document.querySelector(`#room_btn_${roomId}`);
    if (playingRoom) {
      playingRoom.disabled = true;
      playingRoom.innerText += ' (IN GAME)';
    }
  });

  socket.on('game off', (roomId) => {
    const playingRoom = document.querySelector(`#room_btn_${roomId}`);
    if (playingRoom) {
      playingRoom.disabled = false;
      playingRoom.innerText = playingRoom.innerText.replace(' (IN GAME)', '');
    }
  });
}

export { currentColor };
