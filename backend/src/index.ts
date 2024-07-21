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
// TODO: need to enable cors for dev env
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
    console.log('a user connected');
});

server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
