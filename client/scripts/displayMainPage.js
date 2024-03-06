import { socket } from '../main.js';
import updateRoomList from './updateRoomList';
import displayChatRoom from './displayChatRoom';

export default function displayMainPage() {
  // Rensa body från allt innehåll
  document.body.innerHTML = '';

  // create main container
  const mainContainer = document.createElement('div');
  mainContainer.classList.add('main_container');

  // create header
  const title = document.createElement('h1');
  title.innerText = 'Color Chaos';

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

  const createRoomBtn = document.createElement('button');
  createRoomBtn.classList.add('create_room_btn');
  createRoomBtn.innerText = 'Create and Enter';
  createRoomBtn.addEventListener('click', () => {
    const roomName = inputRoomName.value;
    if (roomName) {
      socket.emit('create room', roomName);
      socket.emit('join room', roomName);
      displayChatRoom(roomName);
    }
  });

  // add all element to mainContainer
  createRoomSection.append(createRoomText, inputRoomName, createRoomBtn);
  mainContainer.append(
    title,
    enterRoomInstruction,
    roomsContainer,
    createRoomSection
  );

  // add mainContainer to body
  document.body.appendChild(mainContainer);

  // Request room list initially and update UI
  socket.emit('get rooms');
  socket.on('room list', updateRoomList);
}
