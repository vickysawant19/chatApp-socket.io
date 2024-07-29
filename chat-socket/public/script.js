const socket = io();

const startContainer = document.querySelector(".start-container");
const nameInput = document.querySelector(".name-input");
const startBtn = document.querySelector(".start-btn");

const mainContainer = document.querySelector(".container");
const chatBody = document.querySelector(".chat-body");
const sendBtn = document.querySelector(".send-btn");
const chatInput = document.querySelector(".chat-input");

let userName = "";
let hasName = false;

startBtn.addEventListener("click", (e) => {
  e.preventDefault();
  userName = nameInput.value.trim();
  if (userName !== "") {
    startContainer.classList.add("hidden");
    mainContainer.classList.remove("hidden");
    hasName = true;
    socket.emit("sendData", userName);
  } else {
    alert("Please enter a name.");
  }
});

socket.on("previousMessages", (messages) => {
  if (hasName) {
    messages.forEach((message) => {
      const { name, text } = message;
      const messageType = userName === name ? "outgoing" : "incoming";
      addChat(name, text, messageType);
    });
  }
});

sendBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sendMessage();
});

chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const msg = chatInput.value.trim();
  chatInput.value = "";
  if (msg !== "") {
    socket.emit("chat", { name: userName, text: msg });
  } else {
    alert("Please enter a message.");
  }
}

socket.on("chat", (data) => {
  const { name, text } = data;
  if (userName !== "" && userName !== name) {
    addChat(name, text, "incoming");
  }
  if (userName !== "" && userName === name) {
    addChat(name, text, "outgoing");
  }
});

function addChat(name, text, type) {
  const div = document.createElement("div");
  const h5 = document.createElement("h5");
  const p = document.createElement("p");

  h5.classList.add("name");
  h5.innerHTML = name;

  p.classList.add("text");
  p.innerHTML = text;

  div.append(h5, p);
  div.classList.add("message", type);

  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}
