import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.NODE_ENV === 'production' ? 'TODO: add production url' : `${import.meta.env.SERVER_HOST}:${import.meta.env.SERVER_PORT}`;

export const socket = io(URL);
