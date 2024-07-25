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
        console.log(`socket.id: ${socket.id}, msg: ${msg}`);
        // TODO: study the difference between `socket.broadcast.emit` and `io.emit`
        io.emit('receive_msg', msg);    // Broadcast the message to all connected clients (including the sender)
        // socket.broadcast.emit('receive_msg', msg);    // Broadcast the message to all connected clients (except the sender)
    });

    // TODO: how to handle boolean, client side HTML select component cannot handle expanding or not
    // socket.on("dropdown_is_expanded", (isExpanded: boolean) => { 
    //     console.log(`socket.id: ${socket.id}, isExpanded: ${isExpanded}`);

    //     io.emit('receive_dropdown_is_expanded', isExpanded);
    // });

    socket.on("dropdown_selected_value", (value: string) => {
        console.log(`socket.id: ${socket.id}, value: ${value}`);

        io.emit('receive_dropdown_selected_value', value);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id)
    })
});

server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
