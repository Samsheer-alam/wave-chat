import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { chatsStore } from '../../state/chats.store';
import { onlineUsersStore } from '../../state/online.store';
import { ChatAcceptPayload } from '../../types/socket.types';
import { SOCKET_EVENTS } from '../socket.constants';

/**
 * Handles the chat acceptance event between two users.
 * Registers a listener for `CHAT_ACCEPT` that starts a chat between two online users or emits an error if either is offline.
 * @param io - The Socket.IO server instance used to emit events.
 * @param socket - The user's socket instance on which to listen for events.
 */
export const chatAcceptHandler = (io: Server, socket: Socket) => {
  socket.on(SOCKET_EVENTS.CHAT_ACCEPT, (payload: ChatAcceptPayload) => {
    const fromSocketId = onlineUsersStore.getSocketId(payload.fromUserId);
    const toSocketId = onlineUsersStore.getSocketId(payload.toUserId);

    if (!fromSocketId || !toSocketId) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'One user is offline' });
      return;
    }

    const chatId = uuidv4();

    chatsStore.set(payload.fromUserId, chatId, payload.toUserId);
    chatsStore.set(payload.toUserId, chatId, payload.fromUserId);

    io.to(fromSocketId).emit(SOCKET_EVENTS.CHAT_STARTED, {
      chatId,
      partnerId: payload.toUserId
    });

    io.to(toSocketId).emit(SOCKET_EVENTS.CHAT_STARTED, {
      chatId,
      partnerId: payload.fromUserId
    });
  });
};
