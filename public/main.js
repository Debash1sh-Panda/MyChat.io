// by default it will be work like this
// const socket = io("http://localhost:4000/");
const socket = io();

const clientstotal = document.getElementById('clients-total');
const nameInput = document.getElementById('name-input');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('message_form');
const messageInput = document.getElementById('message-input');
// const feedbackvalue = document.getElementById('feedback');

const messageAudio = new Audio('message-tone.mp3')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
    messageForm.reset();
})

socket.on('clients-total', (data) => {
    clientstotal.innerText = `Total Clients: ${data}`;
})

// sending a message 
function sendMessage(){
    if (messageInput.value === '') return
    // console.log(messageInput.value)
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date(),
        // feedback:
    }
    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = ''
}

// receving a message
socket.on('chat-message', (data) =>{
    // console.log(data);
    messageAudio.play()
    addMessageToUI(false, data)
})

function addMessageToUI(isOwnMessage, data){
    clearFeedback()
    const element = `
        <li class="${isOwnMessage ? "message-right" : "message-left" }">
        <p class="message">
            ${data.message}
            <span>${data.name} * ${moment(data.dateTime).fromNow()}</span>
        </p>
        </li>`

    messageContainer.innerHTML += element
    scrollToButtom()
}

// automatic scroll while entering message
function scrollToButtom(){
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}


// when someone focusing on input field
messageInput.addEventListener('focus', (e)=> {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`
    })
})

// when someone typing through key
messageInput.addEventListener('keypress', (e)=> {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('blur', (e)=> {
    socket.emit('feedback', {
        feedback: ''
    })
})

socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
        <li class="message-feedbck">
        <p class="feedback" id="feedback">
            ${data.feedback}
        </p>
        </li>`
    
    messageContainer.innerHTML += element;
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedbck').forEach(element => {
        element.parentNode.removeChild(element);
    })
}