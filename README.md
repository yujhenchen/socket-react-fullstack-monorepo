## About The Project

A real-time multi-user full-stack web application built with monorepo using Turbo. The backend utilizes Socket.io and Express.js, while the frontend is crafted with Vite, React, Tailwind CSS, and Flowbite-React. Features include common web elements like dropdown lists, textareas, and radio buttons, along with Google Maps API integration


## Features and explanations

### Server side

**apps\backend\src\index.ts**

Create an Express.js application with CORS enabled, running on a specified port and served by an HTTP server:
```
const app = express();
const port = env.port;

app.use(cors());

// create a HTTP server object
const server = http.createServer(app);
```

Initialize a new instance of socket.io
```
const io = new Server(server, {
    cors: {
        origin: env.clientUrl,
        // credentials: true
    }
});
```

Define socket object type:
```
type SocketType = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, Record<string, never>>;
```

Declare custom room ([an arbitrary channel that sockets can `join` and `leave`](https://socket.io/docs/v4/rooms/)):
```
const customRooms = ["Room A", "Room B", "Room C"];
```

Event handler for handling disconnected event. Use `io.of("/").sockets.size` to get [The number of currently connected clients](https://socket.io/docs/v4/server-api/#attributes-4), emit event `receive_online_people_count` to all the connected clients (including the current one):
```
const handleDisconnect = (socket: SocketType) => () => {
    console.log('A user disconnected:', socket.id, 'io.of("/").sockets.size:', io.of("/").sockets.size);
    try {
        io.emit("receive_online_people_count", io.of("/").sockets.size);
    } catch (error) {
        console.error(error)
    }
}
```

A generic function to handle socket emit event. Since all the connected clients is joined a default room (public channel), use `socket.rooms.size > 1` to check if the client joins an extra room besides the default room (public channel). Emitting an event to the room if the client joins an extra room, otherwise emitting the event to all teh connected clients (including the current one):
```
const handleEmit = <T extends Record<string, unknown> | string | number | boolean>(socket: SocketType, eventName: string) => (value: T) => {
    try {
        // NOTE: `socket.rooms.size > 1` because a socket is always in the public channel
        if (socket.rooms.size > 1) socket.rooms.forEach(room => socket.to(room).emit(eventName, value));  // TODO: `socket.to(room).emit` this is not able to send to the sender itself
        else io.emit(eventName, value);
    } catch (error) {
        console.error(error)
    }
}
```

Handle client choose room event. Define a `leaveRooms` function to let the current socket leave all the custom rooms (the client will still be in the default room, which is the public channel). Emit the event `receive_room_selected_value` with rooms that current socket joins to the current socket:
```
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
```

listen on the connection event for incoming sockets. Use `io.emit("receive_online_people_count", io.of("/").sockets.size);` to broadcast the number of currently connected clients:
```
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
```

Listen to connection errors and handle them:
```
io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
});
```

expose port
```
server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
```





### Client side


## Issues Encountered and Solutions
Add something


## Troubleshooting connection issues
- https://socket.io/docs/v4/troubleshooting-connection-issues/

### Error `Property 'description' does not exist on type 'Error'.ts` and `Property 'context' does not exist on type 'Error'.ts`
When monitor `connect_error` event at client side
```
 useEffect(() => {
    socket.on("connect_error", (err) => {
      // the reason of the error, for example "xhr poll error"
      console.log(err.message);

      // some additional description, for example the status code of the initial HTTP response
      console.log(err.description);

      // some additional context, for example the XMLHttpRequest object
      console.log(err.context);
    });

    return () => {
      socket.off("connect_error");
    };
  }, []);
```

#### Root cause
???

#### Solution
???



## How to handle disconnect event and broadcast to all clients (including the one that is going to disconnect)
When monitoring and handling the `disconnect` event as below in the function `handleDisconnect`, `io.emit("receive_online_people_count", count);` fails on emit event to all clients. Because the current user has disconnected.
```
const handleDisconnect = (socket: SocketType) => () => {
    console.log('A user disconnected:', socket.id);
    const count = io.engine.clientsCount;
    io.emit("receive_online_people_count", count); // when a user disconnect, this won't be send to all users
}

// listen on the connection event for incoming sockets
io.on('connection', (socket: SocketType) => {
    console.log('a user connected', socket.id);

    const count = io.engine.clientsCount;
    io.emit("receive_online_people_count", count);

    ...

    socket.on("disconnect", handleDisconnect(socket));
});
```

### Root cause
???

### Solution
- https://socket.io/docs/v4/server-api/#engineclientscount

Use `io.of("/").sockets.size` instead of `io.engine.clientsCount`.
```
const handleDisconnect = (socket: SocketType) => () => {
    ... 
    
    io.emit("receive_online_people_count", io.of("/").sockets.size);
    
    ...
}

```



## A Beginner's Guide to WebSockets
- https://www.youtube.com/watch?v=8ARodQ4Wlf4
	- use Chrome dev to debug, WS -> Frames


## Not need to use dotenv after Node.js 20.6.0
- https://medium.com/@tony.infisical/stop-using-dotenv-in-node-js-v20-6-0-8febf98f6314
- https://dev.to/cjreads665/nodejs-2060-say-goodbye-to-dotenv-2ijl



## Validate Environment Variables With Zod
- https://catalins.tech/validate-environment-variables-with-zod/
- https://creatures.sh/blog/env-type-safety-and-validation/



## Full stack project structure
- https://github.com/idurar/idurar-erp-crm

### Use bun with vite
- https://vitejs.dev/guide/
- https://bun.sh/guides/ecosystem/vite



## Use `process.env` with Vite frontend project
- https://vitejs.dev/guide/env-and-mode

Use
```
import.meta.env.NODE_ENV
```

For example
```
const URL = import.meta.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';
```



## During development, you need to enable CORS on your server
- https://socket.io/how-to/use-with-react
- https://socket.io/docs/v4/handling-cors

server side
```
const io = new Server(server, {
    cors: {
        origin: env.clientUrl,
        // credentials: true
    }
});
```

client side
```
// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.VITE_NODE_ENV === undefined ? 'TODO: add production url' : import.meta.env.VITE_SERVER_URL;

export const socket = io(URL, {
    // withCredentials: true,
});
```


### Solution to the error `No 'Access-Control-Allow-Origin' header is present on the requested resource`
- https://socket.io/docs/v4/handling-cors

```
Access to XMLHttpRequest at 'http://localhost:3000/socket.io/?EIO=4&transport=polling&t=P3KPn60' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

Make sure the `cors` package is installed in package.json and set up correctly in the backend application. For example:
```
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
        credentials: true
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

```



## Run and Debug Vite using VSCode
- https://mfcallahan.com/2023/04/24/configuring-vs-code-for-vue-js-development-using-vite/



## Building a Real-Time Chat App with Next.js, Socket.io, and TypeScript
- https://stackademic.com/blog/building-a-real-time-chat-app-with-next-js-socket-io-and-typescript



## Setup monorepos using Turborepo with Vite and Express.js and TypeScript using pnpm
- https://turbo.build/repo/docs
- https://github.com/tanishqmanuja/todos-react-elysia/tree/main


### Vite
```
pnpm dlx create-turbo@latest -e with-vite
```

#### Error `The esbuild loader for this file is currently set to "js" but it must be set to "jsx" to be able to parse JSX syntax. You can use "loader: { '.js': 'jsx' }" to do that`

Error when run `pnpm run dev` after creating and using a React TypeScript component App.tsx
![image](https://hackmd.io/_uploads/ryUULeRdR.png)


##### Root cause
Default Turborepo with Vite for React component files file extension using **.ts** instead of **.tsx** (which are the default generated files when create a new vite project with React and TypeScript at Vite version `5.3.4`)


##### Solution
Create a Vite React project, copy files **tsconfig.app.json**, **tsconfig.node.json**, **tsconfig.json**, and **vite.config.ts** under the current repo **./apps/web/**.

And then add missing dependencies into package.json file.


###### Steps
Run command 
```
pnpm create vite
```

Choose the target tech stack
- React
- TypeScript
- ...

Copy above files into the current repo


### Express.js

Use nodemon
- https://github.com/remy/nodemon


#### Error 
![image](https://hackmd.io/_uploads/HkYdGX0dR.png)


##### Root cause
??? 

##### Solution
- https://github.com/bobbyhadz/typescript-unknown-file-extension-error/blob/main/package.json

remove "type": "module", in package.json ??
add in  tsconfig.json ??

###### Steps
Refer to the repo and update my files
- tsconfig.json
- package.json



### Deal with .env files
Not yet
