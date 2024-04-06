const express = require("express");
const chatApp = express();

require("dotenv").config();
PORT = process.env.PORT || 4000

const path = require("path");
chatApp.use(express.static(path.join(__dirname, 'public')));

const server = chatApp.listen(PORT, () => {
    console.log("Server started..")
});

const io = require('socket.io')(server);

let socketsConected = new Set();

io.on('connection', onConnected);

function onConnected(socket) {
    console.log(socket.id);
    socketsConected.add(socket.id);

    io.emit('clients-total', socketsConected.size);

    socket.on('disconnect', () => {
        console.log('socket disconnected', socket.id);
        socketsConected.delete(socket.id);

        io.emit('clients-total', socketsConected.size);
    })

    socket.on('message', (data) =>{
        // console.log(data)
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
    })
}

