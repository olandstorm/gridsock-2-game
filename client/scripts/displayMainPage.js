import { socket } from '../main.js';
import updateRoomList from './updateRoomList';
import displayChatRoom from './displayChatRoom';
import createPopup from './lib/createPopup.mjs';

let currentColor = null;

export default function displayMainPage() {
  // Rensa body från allt innehåll
  document.body.innerHTML = '';

  // create main container
  const mainContainer = document.createElement('div');
  mainContainer.classList.add('main_container');

  // create logo
  const logoBigImg = document.createElement('img');
  logoBigImg.src = 'assets/img/colorchaos_logo.webp';
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

  const instructionBtn = document.createElement('button');
  instructionBtn.innerText = 'How to play';
  instructionBtn.addEventListener('click', () => {
    createPopup(
      `The game starts with a blank canvas.
    Click on the squares to color the square.
    The goal is to cover as much of the canvas as possible with one's color before time runs out.`,
      'instruction_popup'
    );
  });

  const topBtnsContainer = document.createElement('div');
  topBtnsContainer.classList.add('top_btns_container');
  topBtnsContainer.appendChild(instructionBtn);

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
        const userName = sessionStorage.getItem('user');
        socket.emit('join room', room, userName);
        displayChatRoom(room);
      });
    }
  });

  socket.on('room joined', (data) => {
    currentColor = data.color;
    sessionStorage.setItem('color', data.color);
  });

  // add all element to mainContainer
  createRoomSection.append(createRoomText, inputRoomName, createRoomBtn);
  mainContainer.append(
    logoBigImg,
    enterRoomInstruction,
    roomsContainer,
    createRoomSection
  );

  // add mainContainer to body
  document.body.append(stickyContainer, mainContainer);

  // Request room list initially and update UI
  socket.emit('get rooms');
  socket.on('room list', updateRoomList);
}

export { currentColor };
