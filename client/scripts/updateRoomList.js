import { io } from "socket.io-client";
import displayChatRoom from "./displayChatRoom";
const socket = io("http://localhost:3000");

export default function updateRoomList(rooms) {
    const roomsContainer = document.querySelector(".rooms_container");
    roomsContainer.innerHTML = "";
    rooms.forEach(room => {
        const roomName = document.createElement("button");
        roomName.textContent = room;
        roomName.addEventListener("click", () => {
            socket.emit("join room", room);
            displayChatRoom(room);
        });
        roomsContainer.appendChild(roomName);
    });
}