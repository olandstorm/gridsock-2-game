import { API_URL } from '../main.js';
import displayOldResult from './displayOldResult.js';

export default function updateChat(chat, chatBox) {
  console.log(chat);
  const chatList = document.querySelector('#chatList');
  const li = document.createElement('li');
  let user = chat.user;
  const savedUser = localStorage.getItem('user');
  let color = chat.color;

  const gameId = chat.gameId;

  li.classList.add('msg_color_' + color);

  if (chat.user === savedUser) {
    user = 'You';
    li.classList.add('msg_from_user');
  } else {
    li.classList.add('msg_from_other');
  }

  const msgSender = document.createElement('span');
  msgSender.classList.add('msg_sender');
  msgSender.innerText = user + ' said:';

  const msg = document.createElement('span');
  msg.classList.add('msg_span');
  msg.innerText = chat.message;

  const msgTime = document.createElement('span');
  msgTime.classList.add('msg_time');
  msgTime.innerText = chat.createdAt;

  if (gameId) {
    const oldGameBtn = document.createElement('button');
    oldGameBtn.classList.add('old_game_btn');
    oldGameBtn.innerText = 'here';

    oldGameBtn.addEventListener('click', async () => {
      const gameResult = await fetch(API_URL + 'results/' + gameId).then(
        (res) => res.json()
      );
      displayOldResult(gameResult);
    });

    msg.append(oldGameBtn);
  }

  li.append(msgSender, msg, msgTime);
  chatList.append(li);
  chatBox.scrollTop = chatBox.scrollHeight;
}
