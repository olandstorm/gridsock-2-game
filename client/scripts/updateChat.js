export default function updateChat(chat) {
  console.log(chat);
  const chatList = document.querySelector('#chatList');
  const li = document.createElement('li');
  let user = chat.user;
  const savedUser = sessionStorage.getItem('user');
  let color = chat.color;

  li.classList.add('msg_color_' + color);

  if (chat.user === savedUser) {
    user = 'You';
    li.classList.add('msg_from_user');
  } else {
    li.classList.add('msg_from_other');
  }

  li.innerText = user + ' said: ' + chat.message + chat.createdAt;
  chatList.append(li);
}
