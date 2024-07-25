# About this project
Full stack web application built with a monorepo using Turbo, featuring a Socket.io and Express.js backend, and a Vite, React, Tailwind CSS, and Flowbite-React frontend.

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
