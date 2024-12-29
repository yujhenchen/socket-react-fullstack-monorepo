import { io, Socket } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = import.meta.env.VITE_NODE_ENV === 'production' ? undefined : import.meta.env.VITE_SERVER_URL;
const URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000/";

export const socket: Socket = io(URL, {
    // withCredentials: true,
});
