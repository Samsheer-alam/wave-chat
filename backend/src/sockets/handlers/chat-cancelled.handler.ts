import { Server, Socket } from 'socket.io';
import { onlineUsersStore } from '../../state/online.store';
import { ChatRequestCancelPayload } from '../../types/socket.types';
import { SOCKET_EVENTS } from '../socket.constants';

/**
 * Registers a listener for `CHAT_REQUEST_CANCELLED` that notifies the target user if they are online.
 * @param io - The Socket.IO server instance used to emit events.
 * @param socket - The user's socket instance on which to listen for events.
 */
export const chatRequestCancelledHandler = (io: Server, socket: Socket) => {
  socket.on(
    SOCKET_EVENTS.CHAT_REQUEST_CANCELLED,
    (payload: ChatRequestCancelPayload) => {
      const targetSocketId = onlineUsersStore.getSocketId(payload.toUserId);

      if (targetSocketId) {
        io.to(targetSocketId).emit(SOCKET_EVENTS.CHAT_REQUEST_CANCELLED, {
          cancelledBy: payload.fromUserId
        });
      }
    }
  );
};
