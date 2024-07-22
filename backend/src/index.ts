import express from "express";
import { Server } from 'socket.io';
import http from 'http';
import { env } from "./config/env";
import cors from 'cors';

const app = express();
const port = env.port;

app.use(cors());

// create a HTTP server object
const server = http.createServer(app);

// initialize a new instance of socket.io
const io = new Server(server, {
    cors: {
        origin: env.clientUrl,
        // credentials: true
    }
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// listen on the connection event for incoming sockets
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on("send_msg", (msg: string) => {
        console.log(`msg: ${msg}`);
        // TODO: study the difference between `socket.broadcast.emit` and `io.emit`
        io.emit('receive_msg', msg); // Broadcast the message to all connected clients
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id)
    })
});

server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
