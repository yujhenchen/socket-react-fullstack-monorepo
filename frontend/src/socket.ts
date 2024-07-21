import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.VITE_NODE_ENV === undefined ? 'TODO: add production url' : import.meta.env.VITE_SERVER_URL;

export const socket = io(URL, {
    // withCredentials: true,
});
