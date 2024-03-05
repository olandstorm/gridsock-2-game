import { io } from "socket.io-client";
import updateRoomList from "./updateRoomList";
import displayChatRoom from "./displayChatRoom";
const socket = io("http://localhost:3000");

export default function displayMainPage() {

    document.body.innerHTML = "";
    const mainContainer = document.createElement("div");
    mainContainer.classList.add("main_container");

    mainContainer.innerHTML = `
        <h1>friendHub</h1>
        <span>Enter a room</span>
        <div class="rooms_container"></div>
        <div class="create_room_section">
            <span class="create_room_text">Or create a new room</span>
            <input type="text" class="input_room_name">
            <button class="create_room_btn">Create and Enter</button>
        </div>
    `;

    // Change this when a proper html structure has been agreed upon
    document.body.appendChild(mainContainer);

    const createRoomBtn = document.querySelector(".create_room_btn");
    const inputRoomName = document.querySelector(".input_room_name");

    // Request room list initially and update UI
    socket.emit("get rooms");
    socket.on("room list", updateRoomList);

    // Create a room and then join it
    createRoomBtn.addEventListener("click", () => {
        const roomName = inputRoomName.value;
        if (roomName) {
            socket.emit("create room", roomName); 
            socket.emit("join room", roomName); 
            displayChatRoom(roomName);
        }
    });
}
