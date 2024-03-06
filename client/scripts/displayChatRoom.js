import displayMainPage from './displayMainPage';
import updateChat from './updateChat.mjs';
import sendChat from './sendChat.mjs';
import { socket } from '../main.js';

export default function displayChatRoom(room) {
  document.body.innerHTML = '';

  const chatPage = document.createElement('div');
  chatPage.classList.add('chat_page');

  chatPage.innerHTML = `
    <nav class="nav_bar">
        <h2>friendHub</h2>
        <h3>${room}</h3>
        <button class="leave_room_btn">Leave Room</button>
    </nav>
    <div class="chat_main_section">
        <div class="send_message_container">
            <div>
                <label>Message:</label>
                <input type="text" class="input_message" id="inputMessage">
            </div>
            <button class="send_message_button" id="sendMessageBtn">SEND</button>
        </div>

        <div class="chat_box">
            <ul id="chatList">
        </div>
    </div>
    `;

  console.log('chat rum:', room);
  socket.on('chat', (arg) => {
    console.log('chat tillbaka:', arg);
    updateChat(arg);
  });

  document.body.appendChild(chatPage);

  let inputMessage = document.querySelector('#inputMessage');
  let sendMessageBtn = document.querySelector('#sendMessageBtn');

  sendMessageBtn.addEventListener('click', function () {
    sendChat(inputMessage, room);
    inputMessage.value = '';
  });

  const leaveRoomBtn = document.querySelector('.leave_room_btn');
  leaveRoomBtn.addEventListener('click', displayMainPage);
}
