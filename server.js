require('dotenv').config();
const express = require('express');
const socket = require('socket.io');

const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`listening at ${port}`));

const io = socket(server);

app.get('/', (req, res) => {
    res.send("Popcorn video player server running...");
});

let socketMap = {};

io.on('connection', (socket) => {
    socket.on('change_nickname', (packet) => {
        socket.to(packet.sessionId).emit('message', packet);
        socketMap[socket.id] = packet.nickname;
    });

    socket.on('create_session', (packet) => {
        socket.join(packet.sessionId);
        socket.to(packet.sessionId).emit('message', packet);
        socketMap[socket.id] = packet.nickname;
    });

    socket.on('join_session', (packet) => {
        socket.join(packet.sessionId);
        socket.to(packet.sessionId).emit('message', packet);
        socketMap[socket.id] = packet.nickname;
    });

    socket.on('leave_session', (packet) => {
        socket.to(packet.sessionId).emit('message', packet);
        socket.leave(packet.sessionId);
        delete socketMap[socket.id];
    });

    socket.on('typing_indicator', (packet) => {
        socket.to(packet.sessionId).emit('typing_indicator', packet);
    });

    socket.on('message', (packet) => {
        socket.to(packet.sessionId).emit('message', packet);
    });

    socket.on('playback_sync', (packet) => {
        socket.to(packet.sessionId).emit('playback_sync', packet);
    });

    socket.on('disconnecting', () => {
        let room = Object.keys(socket.rooms)[1];
        if(room) {
            socket.to(room).emit('lost_connection', socketMap[socket.id] + " lost connection.")
        }
        delete socketMap[socket.id];
    });
});