import { Server, Socket } from 'socket.io';
import { chatsStore } from '../../state/chats.store';
import { onlineUsersStore } from '../../state/online.store';
import type { SendMessagePayload } from '../../types/socket.types';
import { SOCKET_EVENTS } from '../socket.constants';

/**
 * Registers a listener for `MESSAGE_SEND` that delivers messages to the recipient if they are online and in an active chat.
 * @param io - The Socket.IO server instance used to emit events.
 * @param socket - The user's socket instance on which to listen for events.
 */
export const messageSendHandler = (io: Server, socket: Socket) => {
  socket.on(SOCKET_EVENTS.MESSAGE_SEND, (payload: SendMessagePayload) => {
    const chat = chatsStore.get(payload.fromUserId);

    if (!chat || chat.partnerId !== payload.toUserId) {
      socket.emit(SOCKET_EVENTS.ERROR, {
        message: 'No active chat with this user'
      });
      return;
    }

    const targetSocketId = onlineUsersStore.getSocketId(payload.toUserId);

    if (!targetSocketId) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'User disconnected' });
      return;
    }

    io.to(targetSocketId).emit(SOCKET_EVENTS.MESSAGE_RECEIVED, payload);
  });
};
