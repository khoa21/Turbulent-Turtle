const socket = io('http://localhost:3500');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

//new user
const name = prompt('What is name ?');
appendMessage('Welcome to the chat room');
socket.emit('new-user', name);

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-connected', name => {
    appendMessage(`${name} has joined the chat room`);
});

socket.on('user-disconnected', name =>{
    appendMessage(`${name} has left the chat room`);
})

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    console.log('Sending message:', message);
    socket.emit('send-chat-message', message);
    messageInput.value = '';
});

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}