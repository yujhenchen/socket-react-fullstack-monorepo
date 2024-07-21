import express from "express";
import { Server } from 'socket.io';
import http from 'http';
import { env } from "./config/env";

const app = express();
const port = env.port;

// create a HTTP server object
const server = http.createServer(app);

// initialize a new instance of socket.io
const io = new Server(server);

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

// TODO: use bun with express.js
// const server = Bun.serve({
//     port: 3000,
//     fetch(req) {
//         return new Response("Bun!");
//     },
// });

// console.log(`Listening on http://localhost:${server.port} ...`);