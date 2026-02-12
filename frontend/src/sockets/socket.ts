import { io, Socket } from 'socket.io-client';
import config from '../config';

const SERVER_URL = config.SOCKET_ENDPOINT;

export const socket: Socket = io(SERVER_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling', 'flashsocket']
});
