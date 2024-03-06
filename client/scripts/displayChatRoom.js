import displayMainPage from './displayMainPage';
import updateChat from './updateChat.mjs';
import sendChat from './sendChat.mjs';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');

export default function displayChatRoom(room) {
  document.body.innerHTML = '';

  const chatPage = document.createElement('div');
  chatPage.classList.add('chat_page');

//   chatPage.innerHTML = `
//     <nav class="nav_bar">
//         <h2>friendHub</h2>
//         <h3>${room}</h3>
//         <button class="leave_room_btn">Leave Room</button>
//     </nav>
//     <div class="chat_main_section">
//         <div class="send_message_container">
//             <div>
//                 <label>Message:</label>
//                 <input type="text" class="input_message" id="inputMessage">
//             </div>
//             <button class="send_message_button" id="sendMessageBtn">SEND</button>
//         </div>

//         <div class="chat_box">
//             <ul id="chatList">
//         </div>
//     </div>
//     `;

// Skapa och konfigurera nav element
const navBar = document.createElement('nav');
navBar.classList.add('nav_bar');

const title = document.createElement('h2');
title.innerText = 'Color Chaos';

const roomName = document.createElement('h3');
roomName.innerText = room;

const leaveRoomBtn = document.createElement('button');
leaveRoomBtn.classList.add('leave_room_btn');
leaveRoomBtn.innerText = 'Leave Room';
leaveRoomBtn.addEventListener('click', () => {
        displayMainPage();
    });
    
navBar.append(title, roomName, leaveRoomBtn);

// Skapa och konfigurera container för meddelanden
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
    sendChat(inputMessage);
    inputMessage.value = '';
  });

sendMessageContainer.append(inputLabel, inputMessage, sendMessageBtn);

// Skapa och konfigurera chat box
const chatBox = document.createElement('div');
chatBox.classList.add('chat_box');

const chatList = document.createElement('ul');
chatList.id = 'chatList';

chatBox.appendChild(chatList);

// Lägg till alla element till chatPage
chatMainSection.append(sendMessageContainer, chatBox);
chatPage.append(navBar, chatMainSection);

  socket.on('chat', (arg) => {
    updateChat(arg);
  });

  document.body.appendChild(chatPage);
  
}
