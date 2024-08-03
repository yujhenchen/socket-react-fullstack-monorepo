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

// const handleSendMessage = (socket: SocketType) => (message: string) => {
//     console.log(`socket.id: ${socket.id}, message: ${message}`);
//     try {
//         io.emit('receive_msg', message);
//     } catch (error) {
//         console.error(error)
//     }
// }

// const handleDropdownSelectedValue = (socket: SocketType) => (value: string) => {
//     console.log(`socket.id: ${socket.id}, value: ${value}`);
//     try {
//         io.emit('receive_dropdown_selected_value', value);
//     } catch (error) {
//         console.error(error)
//     }
// }

// const handleCheckboxIsChecked = (socket: SocketType) => (checked: boolean) => {
//     console.log(`socket.id: ${socket.id}, value: ${checked}`);
//     try {
//         io.emit('receive_checkbox_is_checked', checked);
//     } catch (error) {
//         console.error(error)
//     }
// }

// const handleRadioIsChecked = (socket: SocketType) => (value: string) => {
//     console.log(`socket.id: ${socket.id}, value: ${value}`);
//     try {
//         io.emit('receive_radio_selected_value', value);
//     } catch (error) {
//         console.error(error)
//     }
// }

// const handleTextareaValue = (socket: SocketType) => (value: string) => {
//     console.log(`socket.id: ${socket.id}, value: ${value}`);
//     try {
//         io.emit('receive_textarea_value', value);
//     } catch (error) {
//         console.error(error)
//     }
// }

// const handleMapPosition = (socket: SocketType) => (position: {
//     lat: number;
//     lng: number;
// }) => {
//     console.log(`socket.id: ${socket.id}, position:`, position);
//     try {
//         io.emit('receive_map_position', position);
//     } catch (error) {
//         console.error(error)
//     }
// }

const handleDisconnect = (socket: SocketType) => () => {
    console.log('A user disconnected:', socket.id, 'io.of("/").sockets.size:', io.of("/").sockets.size);
    try {
        io.emit("receive_online_people_count", io.of("/").sockets.size);
    } catch (error) {
        console.error(error)
    }
}

const handleEmit = <T extends Record<string, unknown> | string | number | boolean>(eventName: string) => (value: T) => {
    try {
        io.emit(eventName, value);
    } catch (error) {
        console.error(error)
    }
}

// listen on the connection event for incoming sockets
io.on('connection', (socket: SocketType) => {
    console.log('a user connected', socket.id);

    io.emit("receive_online_people_count", io.of("/").sockets.size);

    // socket.on("send_msg", handleSendMessage(socket));
    // socket.on("dropdown_selected_value", handleDropdownSelectedValue(socket));
    // socket.on("checkbox_is_checked", handleCheckboxIsChecked(socket));
    // socket.on("radio_selected_value", handleRadioIsChecked(socket));
    // socket.on("textarea_value", handleTextareaValue(socket));
    // socket.on("map_position", handleMapPosition(socket));

    // socket.on("disconnect", handleDisconnect(socket));
    socket.on("send_msg", handleEmit('receive_msg'));
    socket.on("dropdown_selected_value", handleEmit('receive_dropdown_selected_value'));
    socket.on("checkbox_is_checked", handleEmit('receive_checkbox_is_checked'));
    socket.on("radio_selected_value", handleEmit('receive_radio_selected_value'));
    socket.on("textarea_value", handleEmit('receive_textarea_value'));
    socket.on("map_position", handleEmit('receive_map_position'));

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
