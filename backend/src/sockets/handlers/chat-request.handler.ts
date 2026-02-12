import { Server, Socket } from 'socket.io';
import { onlineUsersStore } from '../../state/online.store';
import type { ChatRequestPayload } from '../../types/socket.types';
import { SOCKET_EVENTS } from '../socket.constants';

/**
 * Registers a listener for `CHAT_REQUEST` that forwards the chat request to the target user or emits an error if offline.
 * @param io - The Socket.IO server instance used to emit events.
 * @param socket - The user's socket instance on which to listen for events.
 */
export const chatRequestHandler = (io: Server, socket: Socket) => {
  socket.on(SOCKET_EVENTS.CHAT_REQUEST, (payload: ChatRequestPayload) => {
    const targetSocketId = onlineUsersStore.getSocketId(payload.toUserId);

    if (!targetSocketId) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'User is not online' });
      return;
    }

    io.to(targetSocketId).emit(SOCKET_EVENTS.CHAT_REQUEST_RECEIVED, payload);
  });
};
