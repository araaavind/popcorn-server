require('dotenv').config();
const express = require('express');
const socket = require('socket.io');

const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`listening at ${port}`));

const io = socket(server);

app.get('/', (req, res) => {
    res.send("Popcorn video player server");
});

io.on('connection', (socket) => {
    console.log("A user connected");
    io.emit('connected', { body: "A user joined!" });
    socket.on('disconnect', () => {
        console.log("A user disconnected");
        io.emit('disconnected', { body: "A user left!" });
    });
});