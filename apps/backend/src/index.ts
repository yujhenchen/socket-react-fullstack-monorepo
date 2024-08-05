import express from "express";
import { Server, Socket } from 'socket.io';
import http from 'http';
import { env } from "./config/env";
import cors from 'cors';
import { DefaultEventsMap } from "socket.io/dist/typed-events";

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

type SocketType = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, Record<string, never>>;

const customRooms = ["Room A", "Room B", "Room C"];

const handleDisconnect = (socket: SocketType) => () => {
    console.log('A user disconnected:', socket.id, 'io.of("/").sockets.size:', io.of("/").sockets.size);
    try {
        io.emit("receive_online_people_count", io.of("/").sockets.size);
    } catch (error) {
        console.error(error)
    }
}

const handleEmit = <T extends Record<string, unknown> | string | number | boolean>(socket: SocketType, eventName: string) => (value: T) => {
    try {
        // NOTE: `socket.rooms.size > 1` because a socket is always in the public channel
        if (socket.rooms.size > 1) socket.rooms.forEach(room => socket.to(room).emit(eventName, value));  // TODO: `socket.to(room).emit` this is not able to send to the sender itself
        else io.emit(eventName, value);
    } catch (error) {
        console.error(error)
    }
}

const handleSelectRoom = (socket: SocketType) => (roomId: string) => {
    console.log('user enter the room:', socket.id, `roomId: ${roomId}`);

    const leaveRooms = () => {
        socket.rooms.forEach(room => { if (customRooms.includes(room)) { socket.leave(room) } });
    }

    try {
        leaveRooms();  // NOTE: allow this socket to join only one room at a time
        if (roomId !== "public channel") socket.join(roomId);
        socket.emit("receive_room_selected_value", roomId, `socket: ${socket.id} is in the rooms: ${Array.from(socket.rooms).join(',')}`);
    } catch (error) {
        console.error(error)
    }
}

// listen on the connection event for incoming sockets
io.on('connection', (socket: SocketType) => {
    console.log('a user connected', socket.id);

    io.emit("receive_online_people_count", io.of("/").sockets.size);

    socket.on("send_msg", handleEmit(socket, 'receive_msg'));
    socket.on("dropdown_selected_value", handleEmit(socket, 'receive_dropdown_selected_value'));
    socket.on("checkbox_is_checked", handleEmit(socket, 'receive_checkbox_is_checked'));
    socket.on("radio_selected_value", handleEmit(socket, 'receive_radio_selected_value'));
    socket.on("textarea_value", handleEmit(socket, 'receive_textarea_value'));
    socket.on("map_position", handleEmit(socket, 'receive_map_position'));
    socket.on("room_selected_value", handleSelectRoom(socket));

    socket.on("disconnect", handleDisconnect(socket));
});

io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
});

// expose port
server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
