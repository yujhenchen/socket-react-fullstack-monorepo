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

// deal with socket related features
type SocketType = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, Record<string, never>>;

const handleSendMessage = (socket: SocketType) => (message: string) => {
    try {
        console.log(`socket.id: ${socket.id}, message: ${message}`);
        io.emit('receive_msg', message);
    } catch (error) {
        console.error(error)
    }
}

const handleDropdownSelectedValue = (socket: SocketType) => (value: string) => {
    try {
        console.log(`socket.id: ${socket.id}, value: ${value}`);
        io.emit('receive_dropdown_selected_value', value);
    } catch (error) {
        console.error(error)
    }
}

const handleCheckboxIsChecked = (socket: SocketType) => (checked: boolean) => {
    try {
        console.log(`socket.id: ${socket.id}, value: ${checked}`);
        io.emit('receive_checkbox_is_checked', checked);
    } catch (error) {
        console.error(error)
    }
}

const handleRadioIsChecked = (socket: SocketType) => (value: string) => {
    try {
        console.log(`socket.id: ${socket.id}, value: ${value}`);
        io.emit('receive_radio_selected_value', value);
    } catch (error) {
        console.error(error)
    }
}

const handleDisconnect = (socket: SocketType) => () => {
    console.log('A user disconnected:', socket.id)
}

// listen on the connection event for incoming sockets
io.on('connection', (socket: SocketType) => {
    console.log('a user connected', socket.id);

    socket.on("send_msg", handleSendMessage(socket));
    socket.on("dropdown_selected_value", handleDropdownSelectedValue(socket));
    socket.on("checkbox_is_checked", handleCheckboxIsChecked(socket));
    socket.on("radio_selected_value", handleRadioIsChecked(socket));

    socket.on("disconnect", handleDisconnect(socket));
});

// expose port
server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
