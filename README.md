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

Define the socket object type:
```
type SocketType = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, Record<string, never>>;
```

Declare custom rooms ([an arbitrary channel that sockets can `join` and `leave`](https://socket.io/docs/v4/rooms/)):
```
const customRooms = ["Room A", "Room B", "Room C"];
```

Event handler for managing disconnections. Use `io.of("/").sockets.size` to get [The number of currently connected clients](https://socket.io/docs/v4/server-api/#attributes-4), and emit the `receive_online_people_count` event to all connected clients, including the current one.
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

A generic function to handle socket emit events: check if a client has joined an additional room beyond the default room (public channel) using `socket.rooms.size > 1`; if so, emit the event to that specific room, otherwise, emit the event to all connected clients, including the current one:
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

Handle the client’s "choose room" event by defining a `leaveRooms` function that allows the current socket to leave all custom rooms (while remaining in the default public channel), and emit the `receive_room_selected_value` event with the rooms the current socket joins to the socket itself:
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

Listen for the connection event to handle incoming sockets, then use `io.emit("receive_online_people_count", io.of("/").sockets.size);` to broadcast the current number of connected clients:
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



---



## Problems and Solutions: Develop phase


### Error: `Property 'description' does not exist on type 'Error'.ts` and `Property 'context' does not exist on type 'Error'.ts`
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
TBC


#### Solution
TBC



### How to: Handle disconnect event and broadcast to all clients (including the one that is going to disconnect)
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


#### Solution
- https://socket.io/docs/v4/server-api/#engineclientscount

Use `io.of("/").sockets.size` instead of `io.engine.clientsCount`.
```
const handleDisconnect = (socket: SocketType) => () => {
    ... 
    
    io.emit("receive_online_people_count", io.of("/").sockets.size);
    
    ...
}
```



### Error: `No 'Access-Control-Allow-Origin' header is present on the requested resource`


#### Root cause
TBC


#### Solution
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



### Error: `The esbuild loader for this file is currently set to "js" but it must be set to "jsx" to be able to parse JSX syntax. You can use "loader: { '.js': 'jsx' }" to do that`
Error when run `pnpm run dev` after creating and using a React TypeScript component App.tsx
![image](https://hackmd.io/_uploads/ryUULeRdR.png)


#### Root cause
Default Turborepo with Vite for React component files file extension using **.ts** instead of **.tsx** (which are the default generated files when create a new vite project with React and TypeScript at Vite version `5.3.4`)


#### Solution
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



### Error 
![image](https://hackmd.io/_uploads/HkYdGX0dR.png)


#### Root cause
TBC


#### Solution
- https://github.com/bobbyhadz/typescript-unknown-file-extension-error/blob/main/package.json

remove "type": "module", in package.json
add in  tsconfig.json

TBC

##### Steps
Refer to the repo and update my files
- tsconfig.json
- package.json


---

## Problems and Solutions: Build and Deploy phases

### Error: `tsconfig.json:4:5 - error TS6310: Referenced project '/socket-react-fullstack-monorepo/apps/web/tsconfig.app.json' may not disable emit`

#### Root cause
TBC


#### Solution
- https://github.com/microsoft/TypeScript/issues/49844



### Error: `ERR_PNPM_LOCKFILE_BREAKING_CHANGE  Lockfile /usr/src/app/pnpm-lock.yaml not compatible with current pnpm`

During building docker file `RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile`


#### Root cause
Because `RUN corepack enable` in the Dockerfile downloads the pnpm version 8.15.6 (TODO: add image), but the pnpm-lock.yaml file that is generated by running `pnpm i` is generated by the local installed pnpm package (by `npm install -g pnpm`), which the version is 9.15.1. SO the version mismatch causes the error.


#### Solution
- https://github.com/pnpm/pnpm/issues/6609

Change (downgrade) the version of local installed pnpm to match the target version that corepack downloads in the Dockerfile, which is 8.15.6. And generate a new pnpm-lock.yaml using the target version of pnpm:

```
npm install -g pnpm@8.15.6
```

And check the pnpm version after finishing install, make sure it shows the correct target version (which is 8.15.6 here):
```
pnpm --version
```

Delete the local pnpm-lock.yaml
```
rm pnpm-lock.yaml
```

Run pnpm install command to generate a new rm pnpm-lock.yaml files 
```
pnpm i
```



### Error: After running the command `pnpm run -r build` and `pnpm deploy --filter=backend --prod /prod/backend`, there is no dist/ folder in the /prod/backend

#### Root cause
TBC

#### Solution
- https://github.com/pnpm/pnpm/issues/5020

Add files in apps/backend/package.json
```
 "files": [
    "dist"
  ],
```



### Error: `Error: Cannot find module 'tslib'`
- https://docs.docker.com/reference/cli/docker/container/logs/

After run the container with the command
```
docker run -d -p 8000:8000 backend:latest
```

And run the command to check logs
```
docker logs containerID
```

#### Root cause 
apps/backend/package.json package tslib is in devDependencies, however, it should be in dependencies according to the npm tslib url 
```
...

"devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.14.12",
    "nodemon": "^3.1.4",
    "tslib": "^2.6.3",
    "typescript": "^5.3.3"
  },

...
```

#### Solution
- https://www.npmjs.com/package/tslib

Move tslib into dependencies, and run `pnpm i` to generate pnpm-lock.yaml base on the new dependencies in the apps/backend/package.json.

```
...

"dependencies": {
    "tslib": "^2.6.3",
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "socket.io": "^4.7.5",
    "ts-node": "^10.9.2",
    "zod": "^3.23.8"
  }

...
```

Build and docker image again



### Error: ERR_PNPM_NO_SCRIPT_OR_SERVER  Missing script start or file server.js
After build and run the web container, run `docker logs containerID`, see this error.

#### Root cause
There is no `start` in scripts in apps/web/package.json

```
"scripts": {
    "dev": "vite --clearScreen false",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint \"src/**/*.ts\""
  },
```

#### Solution
- https://www.npmjs.com/package/serve

Use serve

Install serve globally in docker file
```
RUN pnpm add -g serve
```

Make sure the port is the same as the port this is set in Vite config

Change this from
```
EXPOSE 8001
CMD [ "pnpm", "start" ]
```

To (since the default port is 5173, if need to change the default, ned to update apps/web/vite.config.ts)
```
EXPOSE 5173
CMD [ "serve", "-s", "dist", "-l", "5173" ]
```

Build and run a Docker container in detached mode (`-d`), mapping port 5173 on the host to port 5173 in the container, using the `web:latest` image.
```
docker run -d -p 5173:5173 web:latest
```


### Error: web application fails to communicate with the running server on another container (http://localhost:8000/)
server error
index-4wkcNhfW.js:47 Error: server error
    at Ox._onPacket (index-4wkcNhfW.js:40:76516)
    at Ie.emit (index-4wkcNhfW.js:40:62436)
    at xx.onPacket (index-4wkcNhfW.js:40:64545)
    at r (index-4wkcNhfW.js:40:65633)
    at Array.forEach (<anonymous>)
    at xx.onData (index-4wkcNhfW.js:40:65675)
    at Ie.emit (index-4wkcNhfW.js:40:62436)
    at Bt._onLoad (index-4wkcNhfW.js:40:68578)
    at n.onreadystatechange (index-4wkcNhfW.js:40:68005)

#### Root cause 
TBC


#### Solution 1: Run docker containers on the same network
- https://docs.docker.com/engine/network/

Create a custom, user-defined network
```
docker network create -d bridge my-net
```

Run backend container on the created network
```
docker run --network=my-net -d -p 8000:8000 backend:latest
```

Run web container on the created network 
```
docker run --network=my-net -d -p 5173:5173 web:latest
```

##### Full Dockerfile for the mono repo
```
FROM node:23-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack pnpm --version

RUN pnpm add -g serve

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=backend --prod /prod/backend
RUN pnpm deploy --filter=web --prod /prod/web

# backend
FROM base AS backend
COPY --from=build /prod/backend /prod/backend
WORKDIR /prod/backend
EXPOSE 8000
CMD [ "pnpm", "start" ]

# web
FROM base AS web
COPY --from=build /prod/web /prod/web
WORKDIR /prod/web
EXPOSE 5173
CMD [ "serve", "-s", "dist", "-l", "5173" ]
```


#### Solution 2: to allow docker containers communicate with each other using Render: Blueprint YAML Reference
- https://render.com/docs/blueprint-spec









### How to: Debug a running Docker container: docker container exec
- https://docs.docker.com/reference/cli/docker/container/exec/

For example, check if an environment variable exists in a running docker container.

List all running docker container to see the container ID of the target one
```
docker ps
```

Allocate a pseudo-TTY of the target container using the container ID (ae980e452cbe is the container ID)

```
docker exec -it ae980e452cbe /bin/sh
```

List all the environment variables
```
env
```

Example output 

```

# env             
NODE_VERSION=23.5.0
HOSTNAME=ae980e452cbe
YARN_VERSION=1.22.22
HOME=/root
TERM=xterm
PATH=/pnpm:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
CLIENT_URL=http://localhost:5173
PWD=/prod/backend
PNPM_HOME=/pnpm
# 

```


### How to: Build docker images and run as containers on Render

#### Solution 1: Using render.yaml
Need credit card info on Render, does not try


#### Solution 2: use the docker file for mono repo
this need to run custom build and run command

failed


#### Solution 3: divide the mono repo docker file into 2 docker files (for backend and web)
deploy 2 web services separately on Render

failed, client fails to communicate to backend service

##### URLs
FE
https://realtime-components-fe.onrender.com/

BE
https://realtime-components-be.onrender.com/





### Error: unable to access environment variables that are set to the Vite web service on Render
The deployed web application fails to access the given environment variable `VITE_SERVER_URL`, thus, it uses the fallback url `http://localhost:8000/` instead.

In apps/web/src/socket.ts
```
...

const URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000/";

export const socket: Socket = io(URL, {
    // withCredentials: true,
});

...
```

Open the Network tab on Chrome Dev Tool, see the socket client connect url is incorrect:

curl 'http://localhost:8000/socket.io/?EIO=4&transport=polling&t=e7wwuouj' \
  -H 'sec-ch-ua-platform: "Android"' \
  -H 'Referer;' \
  -H 'User-Agent: Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36' \
  -H 'Accept: */*' \
  -H 'sec-ch-ua: "Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"' \
  -H 'sec-ch-ua-mobile: ?1'

#### Root cause
TBC


#### Solution 1: not an ideal solution, hardcode backend application url
In apps/web/.env, provide value `https://realtime-components-be.onrender.com` to `VITE_SERVER_URL`
```
...

VITE_SERVER_URL=https://realtime-components-be.onrender.com

...
```

And commit and push the changes to remote repo, notice that Render redeploy both services (because both services use the same repository)

After finishing deploy, check the Network tab in Chrome Devtool of the frontend application. Seeing the target url that Socket.IO client connects to is correct (which is `https://realtime-components-be.onrender.com` here)

curl 'https://realtime-components-be.onrender.com/socket.io/?EIO=4&transport=polling&t=esr8sgyt' \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7' \
  -H 'origin: https://realtime-components-fe.onrender.com' \
  -H 'priority: u=1, i' \
  -H 'referer: https://realtime-components-fe.onrender.com/' \
  -H 'sec-ch-ua: "Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"' \
  -H 'sec-ch-ua-mobile: ?1' \
  -H 'sec-ch-ua-platform: "Android"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'user-agent: Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'

  TODO: will remove the .env file in the frontend project, and provide the url in the frontend project Environment - Environment Variables on Render fix this problem?



---



## Other resources

### A Beginner's Guide to WebSockets
- https://www.youtube.com/watch?v=8ARodQ4Wlf4
	- use Chrome dev to debug, WS -> Frames



### Not need to use dotenv after Node.js 20.6.0
- https://medium.com/@tony.infisical/stop-using-dotenv-in-node-js-v20-6-0-8febf98f6314
- https://dev.to/cjreads665/nodejs-2060-say-goodbye-to-dotenv-2ijl



### Validate Environment Variables With Zod
- https://catalins.tech/validate-environment-variables-with-zod/
- https://creatures.sh/blog/env-type-safety-and-validation/



### Full stack project structure
- https://github.com/idurar/idurar-erp-crm



### Use bun with vite
- https://vitejs.dev/guide/
- https://bun.sh/guides/ecosystem/vite



### Use `process.env` with Vite frontend project
- https://vitejs.dev/guide/env-and-mode

Use
```
import.meta.env.NODE_ENV
```

For example
```
const URL = import.meta.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';
```



### During development, you need to enable CORS on your server
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



### Troubleshooting connection issues
- https://socket.io/docs/v4/troubleshooting-connection-issues/



### Run and Debug Vite using VSCode
- https://mfcallahan.com/2023/04/24/configuring-vs-code-for-vue-js-development-using-vite/



### Building a Real-Time Chat App with Next.js, Socket.io, and TypeScript
- https://stackademic.com/blog/building-a-real-time-chat-app-with-next-js-socket-io-and-typescript



### Setup monorepos using Turborepo with Vite and Express.js and TypeScript using pnpm
- https://turbo.build/repo/docs
- https://github.com/tanishqmanuja/todos-react-elysia/tree/main



### Vite with turbo
```
pnpm dlx create-turbo@latest -e with-vite
```



### Express.js
Use nodemon
- https://github.com/remy/nodemon



### Deploy using Docker and Render

#### Working with Docker
- https://pnpm.io/docker

#### Docker on Render
- https://render.com/docs/docker

