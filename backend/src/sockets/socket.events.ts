import { Server, Socket } from 'socket.io';
import {
  chatAcceptHandler,
  chatDeclineHandler,
  chatEndHandler,
  chatRequestCancelledHandler,
  chatRequestHandler,
  messageSendHandler,
  registerHandler
} from './handlers';

/**
 * Registers all chat-related socket event handlers for a given socket and server instance.
 * @param io - The Socket.IO server instance used to emit events.
 * @param socket - The user's socket instance on which to listen for events.
 */
export const registerSocketEvents = (io: Server, socket: Socket) => {
  registerHandler(socket);
  chatRequestHandler(io, socket);
  chatAcceptHandler(io, socket);
  chatRequestCancelledHandler(io, socket);
  chatDeclineHandler(io, socket);
  messageSendHandler(io, socket);
  chatEndHandler(io, socket);
};
